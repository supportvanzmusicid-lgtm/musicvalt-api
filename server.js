import express from 'express';
import axios from 'axios';
import { Innertube } from 'youtubei.js';

const app = express();
app.use(express.json());

let ytInstance = null;

async function getYouTubeClient() {
  if (!ytInstance) {
    ytInstance = await Innertube.create({
      generate_session_locality: true
    });
  }
  return ytInstance;
}

// Helper untuk memaksa cover ke resolusi HD (1080p)
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

// 1. Endpoint Pencarian Lagu Resmi (Official Release Only)
app.get('/api/youtube/search', async (req, res) => {
  try {
    const query = req.query.q || 'Official Release Topic';
    const yt = await getYouTubeClient();
    
    // Pencarian spesifik ke katalog lagu resmi YouTube Music
    const searchResults = await yt.music.search(query, { type: 'song' });
    const rawSongs = searchResults.songs?.contents || searchResults.contents || [];

    const formattedSongs = rawSongs
      .map(song => {
        const artistName = song.artists 
          ? song.artists.map(a => a.name).join(', ') 
          : (song.author?.name || 'Unknown Artist');

        const thumbnails = song.thumbnails || song.thumbnail || [];
        const hdCover = getHDCoverUrl(thumbnails);
        const durationText = song.duration?.text || null;

        return {
          id: song.id || song.videoId,
          title: song.title || song.name,
          artist: artistName,
          album: song.album?.name || null,
          duration: durationText,
          duration_seconds: parseDurationToSeconds(durationText),
          cover_hd: hdCover
        };
      })
      .filter(song => song.duration_seconds > 45); // Filter anti-shorts / anti-teaser 30s

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

// 2. NEW: Endpoint untuk mengambil URL Direct Audio Full Durasi untuk ExoPlayer
// Akses: /api/youtube/stream?id=VIDEO_ID_LAGU
app.get('/api/youtube/stream', async (req, res) => {
  try {
    const videoId = req.query.id;
    if (!videoId) {
      return res.status(400).json({ success: false, message: 'Parameter id wajib diisi' });
    }

    const yt = await getYouTubeClient();
    const info = await yt.getBasicInfo(videoId);
    
    // Mengambil format audio saja (m4a / webm) dengan bitrate tertinggi
    const format = info.streaming_data?.adaptive_formats
      .filter(f => f.has_audio && !f.has_video)
      .sort((a, b) => b.bitrate - a.bitrate)[0];

    if (!format || !format.url) {
      return res.status(404).json({ success: false, message: 'Direct stream URL tidak ditemukan' });
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

// Root Endpoint
app.get('/', (req, res) => {
  return res.json({ status: 'Online', message: 'MusicValt API Active' });
});

export default app;

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}
