import express from 'express';
import axios from 'axios';

const app = express();
app.use(express.json());

// Server-server fallback yang terverifikasi aktif
const INVIDIOUS_INSTANCES = [
  'https://inv.nadeko.net',
  'https://invidious.nerdvpn.de',
  'https://invidious.privacyredirect.com',
  'https://vid.puffyan.us'
];

// Helper Fetch yang Aman (Tidak Crash 500 jika semua instance gagal)
async function safeFetchInvidious(endpoint, params = {}) {
  for (const instance of INVIDIOUS_INSTANCES) {
    try {
      const response = await axios.get(`${instance}${endpoint}`, {
        params,
        headers: { 
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' 
        },
        timeout: 4000 // Timeout 4 detik
      });
      if (response.data) return response.data;
    } catch (err) {
      console.warn(`Instance ${instance} error: ${err.message}`);
      continue;
    }
  }
  return null; // Return null alih-alih throw error agar tidak crash 500
}

function formatSecondsToDuration(seconds) {
  if (!seconds) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// 1. Endpoint Search Lagu (Tahan Crash)
app.get('/api/youtube/search', async (req, res) => {
  try {
    const query = req.query.q || 'Official Release';
    const data = await safeFetchInvidious('/api/v1/search', { q: query, type: 'video' });

    if (!data || !Array.isArray(data)) {
      return res.status(200).json({
        success: true,
        query: query,
        total_results: 0,
        results: [],
        message: 'Layanan pencarian sedang sibuk, silakan coba lagi.'
      });
    }

    const formattedSongs = data
      .filter(item => item.type === 'video' && (item.lengthSeconds || 0) > 45)
      .map(item => {
        let coverUrl = '';
        if (item.videoThumbnails && item.videoThumbnails.length > 0) {
          coverUrl = item.videoThumbnails[item.videoThumbnails.length - 1].url || '';
        }

        if (coverUrl.includes('i.ytimg.com')) {
          coverUrl = coverUrl.replace(/\/vi\/([^\/]+)\/.*/, '/vi/$1/maxresdefault.jpg');
        }

        return {
          id: item.videoId,
          title: item.title || 'Unknown Title',
          artist: item.author || 'Unknown Artist',
          album: null,
          duration: formatSecondsToDuration(item.lengthSeconds),
          duration_seconds: item.lengthSeconds,
          cover_hd: coverUrl
        };
      })
      .filter(song => song.id);

    return res.status(200).json({
      success: true,
      query: query,
      total_results: formattedSongs.length,
      results: formattedSongs
    });
  } catch (error) {
    console.error('Search Catch Error:', error.message);
    return res.status(200).json({ success: false, error: error.message, results: [] });
  }
});

// 2. Endpoint Stream Audio (Tahan Crash)
app.get('/api/youtube/stream', async (req, res) => {
  try {
    const videoId = req.query.id;
    if (!videoId) {
      return res.status(400).json({ success: false, message: 'Parameter id wajib diisi!' });
    }

    const data = await safeFetchInvidious(`/api/v1/videos/${videoId}`);
    
    if (!data || !data.adaptiveFormats) {
      return res.status(404).json({ 
        success: false, 
        message: 'Gagal mengambil data audio dari server streaming' 
      });
    }

    const audioStreams = data.adaptiveFormats.filter(stream => 
      stream.type && stream.type.includes('audio') && stream.url
    );

    const bestAudio = audioStreams.sort((a, b) => (Number(b.bitrate) || 0) - (Number(a.bitrate) || 0))[0];

    if (!bestAudio || !bestAudio.url) {
      return res.status(404).json({ success: false, message: 'Format audio tidak ditemukan' });
    }

    return res.status(200).json({
      success: true,
      id: videoId,
      stream_url: bestAudio.url,
      mime_type: bestAudio.type || 'audio/webm',
      bitrate: Number(bestAudio.bitrate) || 128000
    });
  } catch (error) {
    console.error('Stream Catch Error:', error.message);
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
  return res.json({ status: 'Online', message: 'MusicValt API Running Stable' });
});

export default app;

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}
