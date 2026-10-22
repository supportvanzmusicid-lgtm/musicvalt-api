import express from 'express';
import axios from 'axios';

const app = express();
app.use(express.json());

// List Server Proxy Publik untuk Search & Stream (Rotasi Otomatis)
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

// Helper format detik ke "MM:SS"
function formatSecondsToDuration(seconds) {
  if (!seconds) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// 1. Endpoint Search Unlimited (Tanpa API Key - Multi-Proxy Rotasi)
app.get('/api/youtube/search', async (req, res) => {
  try {
    const query = req.query.q || 'Official Release';
    let songs = [];

    // A. Coba Search via Invidious Instances
    for (const instance of INVIDIOUS_INSTANCES) {
      try {
        const response = await axios.get(`${instance}/api/v1/search`, {
          params: { q: query, type: 'video' },
          headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
          timeout: 4000
        });

        if (response.data && Array.isArray(response.data) && response.data.length > 0) {
          songs = response.data
            .filter(item => item.type === 'video' && (item.lengthSeconds || 0) > 45)
            .map(item => {
              let coverUrl = item.videoThumbnails?.[item.videoThumbnails.length - 1]?.url || '';
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
            });
          
          if (songs.length > 0) break; // Jika berhasil dapet lagu, stop perulangan
        }
      } catch (err) {
        continue; // Kalau instance ini gagal/timeout, lanjut ke instance berikutnya
      }
    }

    // B. Fallback Search via Piped jika Invidious gagal
    if (songs.length === 0) {
      for (const instance of PIPED_INSTANCES) {
        try {
          const response = await axios.get(`${instance}/search`, {
            params: { q: query },
            headers: { 'User-Agent': 'Mozilla/5.0' },
            timeout: 4000
          });

          if (response.data && response.data.items) {
            songs = response.data.items
              .filter(item => item.type === 'stream' && (item.duration || 0) > 45)
              .map(item => {
                let vId = item.id || (item.url ? item.url.replace('/watch?v=', '') : null);
                let coverUrl = item.thumbnail || '';
                if (coverUrl.includes('i.ytimg.com')) {
                  coverUrl = coverUrl.replace(/\/vi\/([^\/]+)\/.*/, '/vi/$1/maxresdefault.jpg');
                }
                return {
                  id: vId,
                  title: item.title || 'Unknown Title',
                  artist: item.uploaderName || 'Unknown Artist',
                  album: null,
                  duration: formatSecondsToDuration(item.duration),
                  duration_seconds: item.duration,
                  cover_hd: coverUrl
                };
              })
              .filter(song => song.id);

            if (songs.length > 0) break;
          }
        } catch (err) {
          continue;
        }
      }
    }

    return res.status(200).json({
      success: true,
      query: query,
      total_results: songs.length,
      results: songs
    });
  } catch (error) {
    console.error('Search Catch Error:', error.message);
    return res.status(200).json({ success: false, error: error.message, results: [] });
  }
});

// 2. Endpoint Stream Audio (Multi-Fallback Stream Engine)
app.get('/api/youtube/stream', async (req, res) => {
  try {
    const videoId = req.query.id;
    if (!videoId) {
      return res.status(400).json({ success: false, message: 'Parameter id wajib diisi!' });
    }

    let streamData = null;

    // A. Coba Stream dari Invidious
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

    // B. Fallback Stream dari Piped
    if (!streamData) {
      for (const instance of PIPED_INSTANCES) {
        try {
          const response = await axios.get
