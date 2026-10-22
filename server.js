import express from 'express';
import axios from 'axios';

const app = express();
app.use(express.json());

const PIPED_API = 'https://pipedapi.kavin.rocks';

// Helper untuk format durasi detik ke "MM:SS"
function formatSecondsToDuration(seconds) {
  if (!seconds) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// 1. Endpoint Search Lagu via Piped API
app.get('/api/youtube/search', async (req, res) => {
  try {
    const query = req.query.q || 'Official Release';
    
    const response = await axios.get(`${PIPED_API}/search`, {
      params: { q: query, filter: 'music' },
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });

    const items = response.data.items || [];
    const formattedSongs = items
      .filter(item => item.type === 'stream' && item.duration > 45) // Buang shorts / video < 45 detik
      .map(item => {
        // Ekstrak ID dari URL item (format: /watch?v=VIDEO_ID)
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

// 2. Endpoint Stream Audio Full Durasi via Piped API
app.get('/api/youtube/stream', async (req, res) => {
  try {
    const videoId = req.query.id;
    if (!videoId) {
      return res.status(400).json({ success: false, message: 'Parameter id wajib diisi!' });
    }

    const response = await axios.get(`${PIPED_API}/streams/${videoId}`, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });

    const audioStreams = response.data.audioStreams || [];
    
    // Pilih format audio dengan kualitas bitrate tertinggi
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
  return res.json({ status: 'Online', message: 'MusicValt API Running Smoothly via Piped' });
});

export default app;

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}
