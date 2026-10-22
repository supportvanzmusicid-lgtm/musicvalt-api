import express from 'express';
import axios from 'axios';

const app = express();
app.use(express.json());

// Daftar server publik Piped cadangan (Fallback list)
const PIPED_INSTANCES = [
  'https://pipedapi.kavin.rocks',
  'https://pipedapi.simpleprivacy.fr',
  'https://piped-api.privacy.com.de',
  'https://pipedapi.astrid.tf'
];

// Helper untuk request dengan sistem rotasi server cadangan
async function fetchFromPiped(endpoint, params = {}) {
  let lastError = null;
  for (const instance of PIPED_INSTANCES) {
    try {
      const response = await axios.get(`${instance}${endpoint}`, {
        params,
        headers: { 'User-Agent': 'Mozilla/5.0' },
        timeout: 6000 // Timeout 6 detik per server
      });
      return response.data;
    } catch (err) {
      lastError = err.message;
      console.warn(`Instance ${instance} gagal, mencoba cadangan lain...`);
      continue;
    }
  }
  throw new Error(`Semua server Piped gagal. Error terakhir: ${lastError}`);
}

// Helper untuk format durasi detik ke "MM:SS"
function formatSecondsToDuration(seconds) {
  if (!seconds) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// 1. Endpoint Search Lagu
app.get('/api/youtube/search', async (req, res) => {
  try {
    const query = req.query.q || 'Official Release';
    
    const data = await fetchFromPiped('/search', { q: query, filter: 'music' });
    const items = data.items || [];

    const formattedSongs = items
      .filter(item => item.type === 'stream' && item.duration > 45) // Buang shorts / video < 45 detik
      .map(item => {
        let videoId = item.id;
        if (!videoId && item.url) {
          videoId = item.url.replace('/watch?v=', '');
        }

        let coverUrl = item.thumbnail || '';
        if (coverUrl.includes('i.ytimg.com')) {
          coverUrl = coverUrl.replace(/\/vi\/([^\/]+)\/.*/, '/vi/$1/maxresdefault.jpg');
        }

        return {
          id: videoId,
          title: item.title || 'Unknown Title',
          artist: item.uploaderName || 'Unknown Artist',
          album: null,
          duration: formatSecondsToDuration(item.duration),
          duration_seconds: item.duration,
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
    console.error('Search Error:', error.message);
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

    const data = await fetchFromPiped(`/streams/${videoId}`);
    const audioStreams = data.audioStreams || [];
    
    const bestAudio = audioStreams
      .filter(stream => stream.url)
      .sort((a, b) => (b.bitrate || 0) - (a.bitrate || 0))[0];

    if (!bestAudio || !bestAudio.url) {
      return res.status(404).json({ success: false, message: 'Format audio tidak ditemukan untuk video ini' });
    }

    return res.status(200).json({
      success: true,
      id: videoId,
      stream_url: bestAudio.url,
      mime_type: bestAudio.mimeType || 'audio/webm',
      bitrate: bestAudio.bitrate || 128000
    });
  } catch (error) {
    console.error('Stream Error:', error.message);
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
  return res.json({ status: 'Online', message: 'MusicValt API Running with Multi-Instance Fallback' });
});

export default app;

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}
