import express from 'express';
import axios from 'axios';
import { Innertube } from 'youtubei.js';

const app = express();
app.use(express.json());

let ytInstance = null;

async function getYouTubeClient() {
  if (!ytInstance) {
    ytInstance = await Innertube.create({
      retrieve_player: true, // Wajib true agar dekripsi audio aktif (tidak 30 detik)
      generate_session_locality: true
    });
  }
  return ytInstance;
}

// Helper untuk memaksa cover / foto profil ke resolusi HD (1080p)
function getHDCoverUrl(thumbnails) {
  if (!thumbnails || thumbnails.length === 0) return null;
  
  const lastThumb = thumbnails[thumbnails.length - 1];
  let url = lastThumb.url || lastThumb;

  if (typeof url !== 'string') return null;

  if (url.includes('googleusercontent.com') || url.includes('ggpht.com')) {
    url = url.split('=')[0] + '=w1080-h1080-l90-rj';
  } else if (url.includes('i.ytimg.com')) {
    url = url.replace(/\/vi\/([^\/]+)\/.*/, '/vi/$1/maxresdefault.jpg');
  }

  return url;
}

// Helper untuk mengubah string durasi (contoh: "3:45") menjadi total detik
function parseDurationToSeconds(durationText) {
  if (!durationText) return 0;
  const parts = durationText.split(':').map(Number);
  if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  } else if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  return 0;
}

// 1. Endpoint Pencarian Lagu (Diperketat agar tidak ngasal & bersih dari shorts)
app.get('/api/youtube/search', async (req, res) => {
  try {
    const query = req.query.q || 'Official Release Topic';
    const yt = await getYouTubeClient();
    
    const searchResults = await yt.music.search(query, { type: 'song' });
    
    // Ambil secara spesifik dari songs.contents atau telusuri shelf yang valid
    let rawSongs = [];
    if (searchResults.songs && searchResults.songs.contents) {
      rawSongs = searchResults.songs.contents;
    } else if (searchResults.contents) {
      for (const shelf of searchResults.contents) {
        if (shelf.contents && Array.isArray(shelf.contents)) {
          rawSongs = shelf.contents;
          break;
        }
      }
      if (rawSongs.length === 0) {
        rawSongs = searchResults.contents;
      }
    }

    const formattedSongs = rawSongs
      .map(song => {
        let artistName = 'Unknown Artist';
        if (song.artists && Array.isArray(song.artists) && song.artists.length > 0) {
          artistName = song.artists.map(a => a.name).join(', ');
        } else if (song.author) {
          artistName = typeof song.author === 'string' ? song.author : (song.author.name || 'Unknown Artist');
        } else if (song.subtitle) {
          artistName = typeof song.subtitle === 'string' ? song.subtitle : (song.subtitle.text || 'Unknown Artist');
        }

        const thumbnails = song.thumbnails || song.thumbnail || [];
        const hdCover = getHDCoverUrl(thumbnails);
        const durationText = song.duration?.text || null;

        return {
          id: song.id || song.videoId,
          title: song.title || song.name || 'Unknown Title',
          artist: artistName,
          album: song.album?.name || null,
          duration: durationText,
          duration_seconds: parseDurationToSeconds(durationText),
          cover_hd: hdCover
        };
      })
      // FILTER KETAT: Wajib punya ID, durasi valid, dan dibuang jika di bawah 45 detik (shorts/preview)
      .filter(song => {
        if (!song.id) return false;
        if (song.duration_seconds > 0 && song.duration_seconds <= 45) return false;
        return true;
      });

    return res.status(200).json({
      success: true,
      query: query,
      total_results: formattedSongs.length,
      results: formattedSongs
    });
  } catch (error) {
    console.error('YouTube Song Search Error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// 2. Endpoint Pencarian Artist & Foto Profil HD
app.get('/api/youtube/search/artist', async (req, res) => {
  try {
    const query = req.query.q || 'Tulus';
    const yt = await getYouTubeClient();
    
    const searchResults = await yt.music.search(query, { type: 'artist' });

    const formattedArtists = (searchResults.artists?.contents || searchResults.contents || []).map(artist => {
      const thumbnails = artist.thumbnails || artist.thumbnail || [];
      const hdProfilePic = getHDCoverUrl(thumbnails);

      return {
        id: artist.id || artist.channel_id,
        name: artist.name || artist.title || 'Unknown Artist',
        subscribers: artist.subscribers?.text || artist.subtitle?.text || null,
        profile_picture_hd: hdProfilePic,
        thumbnails: thumbnails
      };
    });

    return res.status(200).json({
      success: true,
      query: query,
      total_results: formattedArtists.length,
      results: formattedArtists
    });
  } catch (error) {
    console.error('YouTube Artist Search Error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// 3. Endpoint Stream Audio Full Durasi
app.get('/api/youtube/stream', async (req, res) => {
  try {
    const videoId = req.query.id;
    if (!videoId) {
      return res.status(400).json({ success: false, message: 'Parameter id wajib diisi' });
    }

    const yt = await getYouTubeClient();
    const info = await yt.getBasicInfo(videoId);
    
    const streamingData = info.streaming_data;
    if (!streamingData || !streamingData.adaptive_formats) {
      return res.status(404).json({ success: false, message: 'Format audio tidak ditemukan' });
    }

    const audioFormats = streamingData.adaptive_formats
      .filter(f => f.has_audio && !f.has_video)
      .sort((a, b) => (b.bitrate || 0) - (a.bitrate || 0));

    const selectedFormat = audioFormats[0];

    if (!selectedFormat || !selectedFormat.url) {
      return res.status(404).json({ success: false, message: 'Direct stream URL tidak ditemukan' });
    }

    return res.status(200).json({
      success: true,
      id: videoId,
      stream_url: selectedFormat.url,
      mime_type: selectedFormat.mime_type,
      bitrate: selectedFormat.bitrate
    });
  } catch (error) {
    console.error('Stream Error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// 4. Endpoint GitHub Releases
app.get('/api/github/releases', async (req, res) => {
  try {
    const owner = req.query.owner || 'octocat';
    const repo = req.query.repo || 'Hello-World';
    
    const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}/releases`, {
      headers: { 'User-Agent': 'MusicValt-API' }
    });

    return res.status(200).json({
      success: true,
      releases: response.data
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Root Endpoint
app.get('/', (req, res) => {
  return res.json({ status: 'Online', message: 'MusicValt Backend API Running Smoothly!' });
});

export default app;

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}
