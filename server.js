import express from 'express';
import axios from 'axios';
import { Innertube, UniversalCache } from 'youtubei.js';

const app = express();
app.use(express.json());

let ytInstance = null;

async function getYouTubeClient() {
  if (!ytInstance) {
    // Menggunakan TV_EMBEDDED untuk melewati blokir 403 & error 404 Vercel
    ytInstance = await Innertube.create({
      client_type: 'TV_EMBEDDED',
      retrieve_player: true,
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

// 1. Endpoint Search Lagu
app.get('/api/youtube/search', async (req, res) => {
  try {
    const query = req.query.q || 'Official Music Audio';
    const yt = await getYouTubeClient();
    
    const searchResults = await yt.search(query, { type: 'video' });
    const rawVideos = searchResults.results || [];

    const formattedSongs = rawVideos
      .map(video => {
        let artistName = 'Unknown Artist';
        if (video.author) {
          artistName = typeof video.author === 'string' ? video.author : (video.author.name || 'Unknown Artist');
        }

        const titleText = video.title?.text || (typeof video.title === 'string' ? video.title : 'Unknown Title');
        const thumbnails = video.thumbnails || [];
        const hdCover = getHDCoverUrl(thumbnails);
        const durationText = video.duration?.text || null;

        return {
          id: video.id || video.videoId,
          title: titleText,
          artist: artistName,
          album: null,
          duration: durationText,
          duration_seconds: parseDurationToSeconds(durationText),
          cover_hd: hdCover
        };
      })
      // Filter video di bawah 45 detik untuk menghindari shorts/preview
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

// 2. Endpoint Stream Audio Full Durasi (Aman dari Error 500)
app.get('/api/youtube/stream', async (req, res) => {
  try {
    const videoId = req.query.id;
    if (!videoId) {
      return res.status(400).json({ success: false, message: 'Parameter id wajib diisi!' });
    }

    const yt = await getYouTubeClient();

    let info;
    try {
      info = await yt.getInfo(videoId);
    } catch (err) {
      return res.status(400).json({ 
        success: false, 
        message: 'ID Video tidak valid. Pastikan memasukkan ID YouTube (misal: dQw4w9WgXcQ), bukan judul lagu!' 
      });
    }

    const format = info.chooseFormat({
      type: 'audio',
      quality: 'best'
    });

    if (!format || !format.url) {
      return res.status(404).json({ success: false, message: 'Format audio tidak ditemukan untuk ID ini' });
    }

    return res.status(200).json({
      success: true,
      id: videoId,
      stream_url: format.url,
      mime_type: format.mime_type,
      bitrate: format.bitrate
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
