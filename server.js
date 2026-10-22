import express from 'express';
import axios from 'axios';

const app = express();
app.use(express.json());

// List Instance Invidious & Piped Cadangan
const INVIDIOUS_INSTANCES = [
  'https://inv.nadeko.net',
  'https://invidious.nerdvpn.de',
  'https://invidious.privacyredirect.com',
  'https://vid.puffyan.us',
  'https://yt.artemislena.eu'
];

const PIPED_INSTANCES = [
  'https://pipedapi.kavin.rocks',
  'https://pipedapi.privacy.com.de',
  'https://pipedapi.smnz.de'
];

// Helper format detik ke MM:SS
function formatSecondsToDuration(seconds) {
  if (!seconds) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// 1. Endpoint Search Lagu (Super Ringan & Tahan Crash)
app.get('/api/youtube/search', async (req, res) => {
  try {
    const query = req.query.q || 'Official Release';
    
    // Coba ambil hasil pencarian dari instance cadangan yang responsif
    let items = null;
    for (const instance of INVIDIOUS_INSTANCES) {
      try {
        const response = await axios.get(`${instance}/api/v1/search`, {
          params: { q: query, type: 'video' },
          headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
          timeout: 4000
        });
        if (response.data && Array.isArray(response.data)) {
          items = response.data;
          break;
        }
      } catch (err) {
        continue;
      }
    }

    if (!items) {
      return res.status(200).json({
        success: true,
        query: query,
        total_results: 0,
        results: [],
        message: 'Server sedang sibuk, silakan refresh kembali.'
      });
    }

    const formattedSongs = items
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

// 2. Endpoint Stream Audio (Multi-Fallback)
app.get('/api/youtube/stream', async (req, res) => {
  try {
    const videoId = req.query.id;
    if (!videoId) {
      return res.status(400).json({ success: false, message: 'Parameter id wajib diisi!' });
    }

    let streamData = null;

    // 1. Coba dari Invidious
    for (const instance of INVIDIOUS_INSTANCES) {
      try {
        const response = await axios.get(`${instance}/api/v1/videos/${videoId}`, {
          headers: { 'User-Agent': 'Mozilla/5.0' },
          timeout: 4000
        });

        if (response.data && response.data.adaptiveFormats) {
          const audioStreams = response.data.adaptiveFormats.filter(stream => 
            stream.type && stream.type.includes('audio') && stream.url
          );
          const bestAudio = audioStreams.sort((a, b) => (Number(b.bitrate) || 0) - (Number(a.bitrate) || 0))[0];
          if (bestAudio && bestAudio.url) {
            streamData = {
              stream_url: bestAudio.url,
              mime_type: bestAudio.type || 'audio/webm',
              bitrate: Number(bestAudio.bitrate) || 128000
            };
            break;
          }
        }
      } catch (err) {
        continue;
      }
    }

    // 2. Fallback ke Piped
    if (!streamData) {
      for (const instance of PIPED_INSTANCES) {
        try {
          const response = await axios.get(`${instance}/streams/${videoId}`, {
            headers: { 'User-Agent': 'Mozilla/5.0' },
            timeout: 4000
          });

          if (response.data && response.data.audioStreams) {
            const audioStreams = response.data.audioStreams.filter(stream => stream.url);
            const bestAudio = audioStreams.sort((a, b) => (b.bitrate || 0) - (a.bitrate || 0))[0];
            if (bestAudio && bestAudio.url) {
              streamData = {
                stream_url: bestAudio.url,
                mime_type: bestAudio.mimeType || 'audio/webm',
                bitrate: bestAudio.bitrate || 128000
              };
              break;
            }
          }
        } catch (err) {
          continue;
        }
      }
    }

    if (!streamData) {
      return res.status(404).json({ 
        success: false, 
        message: 'Stream audio gagal ditarik, silakan coba beberapa saat lagi.' 
      });
    }

    return res.status(200).json({
      success: true,
      id: videoId,
      stream_url: streamData.stream_url,
      mime_type: streamData.mime_type,
      bitrate: streamData.bitrate
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
  return res.json({ status: 'Online', message: 'MusicValt API Running Safe & Stable' });
});

export default app;

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}
