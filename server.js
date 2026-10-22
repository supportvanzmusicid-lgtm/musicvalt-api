import express from 'express';
import axios from 'axios';

const app = express();
app.use(express.json());

// Daftar server publik Invidious yang stabil
const INVIDIOUS_INSTANCES = [
  'https://inv.nadeko.net',
  'https://vid.puffyan.us',
  'https://yt.artemislena.eu',
  'https://invidious.privacyredirect.com'
];

// Helper untuk request dengan rotasi server cadangan Invidious
async function fetchFromInvidious(endpoint, params = {}) {
  let lastError = null;
  for (const instance of INVIDIOUS_INSTANCES) {
    try {
      const response = await axios.get(`${instance}${endpoint}`, {
        params,
        headers: { 'User-Agent': 'Mozilla/5.0' },
        timeout: 6000
      });
      return response.data;
    } catch (err) {
      lastError = err.message;
      console.warn(`Instance Invidious ${instance} gagal, beralih ke cadangan...`);
      continue;
    }
  }
  throw new Error(`Semua server Invidious gagal. Error terakhir: ${lastError}`);
}

// Helper format detik ke "MM:SS"
function formatSecondsToDuration(seconds) {
  if (!seconds) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// 1. Endpoint Search Lagu via Invidious
app.get('/api/youtube/search', async (req, res) => {
  try {
    const query = req.query.q || 'Official Release';
    
    // Invidious search endpoint mengembalikan array langsung
    const items = await fetchFromInvidious('/api/v1/search', { q: query, type: 'video' });
    
    if (!Array.isArray(items)) {
      return res.status(200).json({ success: true, query, total_results: 0, results: [] });
    }

    const formattedSongs = items
      .filter(item => item.type === 'video' && item.lengthSeconds > 45) // Buang shorts / durasi < 45 detik
      .map(item => {
        let coverUrl = '';
        if (item.videoThumbnails && item.videoThumbnails.length > 0) {
          // Ambil thumbnail kualitas tertinggi
          const bestThumb = item.videoThumbnails[item.videoThumbnails.length - 1];
          coverUrl = bestThumb.url || '';
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
    console.error('Search Error:', error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// 2. Endpoint Stream Audio Full Durasi via Invidious
app.get('/api/youtube/stream', async (req, res) => {
  try {
    const videoId = req.query.id;
    if (!videoId) {
      return res.status(400).json({ success: false, message: 'Parameter id wajib diisi!' });
    }

    const data = await fetchFromInvidious(`/api/v
