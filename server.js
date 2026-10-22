import express from 'express';
import axios from 'axios';
import { Innertube, UniversalCache } from 'youtubei.js';

const app = express();
app.use(express.json());

let ytInstance = null;

// Client YouTubei.js khusus Search (WEB)
async function getYouTubeClient() {
  if (!ytInstance) {
    ytInstance = await Innertube.create({
      cache: new UniversalCache(false)
    });
  }
  return ytInstance;
}

// Daftar server fallback Invidious khusus Stream
const INVIDIOUS_INSTANCES = [
  'https://inv.nadeko.net',
  'https://invidious.nerdvpn.de',
  'https://invidious.privacyredirect.com',
  'https://vid.puffyan.us'
];

async function safeFetchInvidious(endpoint, params = {}) {
  for (const instance of INVIDIOUS_INSTANCES) {
    try {
      const response = await axios.get(`${instance}${endpoint}`, {
        params,
        headers: { 
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' 
        },
        timeout: 5000
      });
      if (response.data) return response.data;
    } catch (err) {
      console.warn(`Instance ${instance} error: ${err.message}`);
      continue;
    }
  }
  return null;
}

// Helper memaksa cover HD
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

function parseDurationToSeconds(durationText) {
  if (!durationText) return 0;
  const parts = durationText.split(':').map(Number);
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  return 0;
}

// 1. Endpoint Search Lagu (Menggunakan youtubei.js - Stabil & Pasti Berhasil)
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
      .filter(song => song.id && song.duration_seconds > 45);

    return res.status(200).json({
      success: true,
      query: query,
      total_results: formattedSongs.length,
      results: formattedSongs
    });
  } catch (error) {
    console.error('Search Error:', error);
    return res.status(500).json({ success: false, error: error.message, results: [] });
  }
});

// 2. Endpoint Stream Audio (Menggunakan Proxy Extractor dari ID Video Search)
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
        message: 'Gagal mengunduh stream audio untuk ID ini, silakan coba lagi.' 
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
  return res.json({ status: 'Online', message: 'MusicValt API Hybrid Running' });
});

export default app;

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}
