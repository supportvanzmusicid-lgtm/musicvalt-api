const express = require('express');
const { Innertube } = require('youtubei.js');

const app = express();
app.use(express.json());

let ytPromise = null;

async function getYT() {
  if (!ytPromise) {
    ytPromise = Innertube.create({
      lang: 'id',
      location: 'ID'
    });
  }
  return ytPromise;
}

app.get('/', (req, res) => {
  res.json({ message: 'API YouTube Music Aktif!' });
});

app.get('/api/search', async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) {
      return res.status(400).json({ error: 'Parameter "q" wajib diisi' });
    }

    const yt = await getYT();
    
    // Coba cari pakai yt.music.search
    let searchResults = await yt.music.search(query, { type: 'song' });
    let rawContents = searchResults.songs?.contents || searchResults.contents || [];

    // Jika masih kosong, fallback ke pencarian umum YouTube biasa
    if (rawContents.length === 0) {
      const generalSearch = await yt.search(query, { type: 'video' });
      rawContents = generalSearch.contents || [];
    }

    // Format data agar aman dibaca
    const formattedSongs = rawContents.map((item) => {
      return {
        id: item.id || item.video_id,
        title: item.title?.text || item.title || 'Unknown Title',
        artist: item.artists ? item.artists.map(a => a.name).join(', ') : (item.author?.name || 'Unknown Artist'),
        album: item.album ? item.album.name : null,
        duration: item.duration?.text || item.duration || null,
        thumbnail: item.thumbnails || item.thumbnail?.contents || []
      };
    });

    res.json({
      success: true,
      total: formattedSongs.length,
      results: formattedSongs
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/play', async (req, res) => {
  try {
    const videoId = req.query.id;
    if (!videoId) {
      return res.status(400).json({ error: 'Parameter "id" wajib diisi' });
    }

    const yt = await getYT();
    const info = await yt.getInfo(videoId);

    res.json({
      success: key => key,
      success: true,
      id: videoId,
      title: info.basic_info.title,
      artist: info.basic_info.author,
      duration: info.basic_info.duration,
      thumbnails: info.basic_info.thumbnail,
      // URL Streaming audio langsung (jika dibutuhkan untuk pemutar musik)
      // streaming_data: info.streaming_data
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = app;
