import express from 'express';
import axios from 'axios';
import { Innertube, UniversalCache } from 'youtubei.js';

const app = express();
app.use(express.json());

let ytInstance = null;

async function getYouTubeClient() {
  if (!ytInstance) {
    ytInstance = await Innertube.create({
      retrieve_player: true, // Wajib true untuk decipher signature YouTube
      generate_session_locality: true,
      cache: new UniversalCache(false)
    });
  }
  return ytInstance;
}

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

// 1. Endpoint Search Lagu Resmi
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
    return res.status(500).json({ success: false, error: error.message });
  }
});

// 2. Endpoint Stream (FIX 30 DETIK - Menggunakan Decipher Format & Fallback URL)
app.get('/api/youtube/stream', async (req, res) => {
  try {
    const videoId = req.query.id;
    if (!videoId) {
      return res.status(400).json({ success: false, message: 'Parameter id wajib diisi' });
    }

    const yt = await getYouTubeClient();
    const info = await yt.getInfo(videoId);

    // Ambil format audio terbaik yang berdurasi penuh
    const format = info.chooseFormat({
      type: 'audio',
      quality: 'best'
    });

    if (!format) {
      return res.status(404).json({ success: false, message: 'Format audio tidak ditemukan' });
    }

    // Dapatkan URL yang sudah di-decipher oleh InnerTube
    const streamUrl = format.decipher(yt.session.player);

    if (!streamUrl) {
      return res.status(404).json({ success: false, message: 'Gagal mendecipher stream URL' });
    }

    return res.status(200).json({
      success: true,
      id: videoId,
      stream_url: streamUrl,
      mime_type: format.mime_type,
      bitrate: format.bitrate,
      duration_ms: format.approx_duration_ms
    });
  } catch (error) {
    console.error('Stream Error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/', (req, res) => {
  return res.json({ status: 'Online', message: 'MusicValt API Running' });
});

export default app;
