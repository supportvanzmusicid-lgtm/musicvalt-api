import express from 'express';
import axios from 'axios';
import { Innertube, UniversalCache } from 'youtubei.js';

const app = express();
app.use(express.json());

let ytInstance = null;

async function getYouTubeClient() {
  if (!ytInstance) {
    // Menggunakan client default (WEB) agar yt.music.search berjalan mulus tanpa error 400
    ytInstance = await Innertube.create({
      cache: new UniversalCache(false)
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
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  return 0;
}

// 1. Endpoint Search Lagu (Stabil dengan client default WEB)
app.get('/api/youtube/search', async (req, res) => {
  try {
    const query = req.query.q || 'Official Release Topic';
    const yt = await getYouTubeClient();
    
    const searchResults = await yt.music.search(query, { type: 'song' });
    const rawSongs = searchResults.songs?.contents || searchResults.contents || [];

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
      // Filter lagu di bawah 45 detik untuk membuang shorts / preview
      .filter(song => song.id && song.duration_seconds > 45);

    return res.status(200).json({
      success: true,
      query: query,
      total_results: formattedSongs.length,
      results: formattedSongs
    });
  } catch (error) {
    console.error('Search Error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// 2. Endpoint Stream Audio Full Durasi
app.get('/api/youtube/stream', async (req, res) => {
  try {
    const videoId = req.query.id;
    if (!videoId) {
      return res.status(400).json({ success: false, message: 'Parameter id wajib diisi!' });
    }

    const yt = await getYouTubeClient();

    let info;
    try {
      info = await yt.getBasicInfo(videoId);
    } catch (err) {
      return res.status(400).json({ 
        success: false, 
        message: 'ID Video tidak valid atau gagal mengambil info lagu.' 
      });
    }

    const streamingData = info.streaming_data;
    if (!streamingData || !streamingData.adaptive_formats) {
      return res.status(404).json({ success: false, message: 'Format audio tidak ditemukan' });
    }

    // Ambil format audio saja dengan bitrate tertinggi
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

// 3. Endpoint GitHub Releases
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
  return res.json({ status: 'Online', message: 'MusicValt API Running Smoothly' });
});

export default app;

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}
