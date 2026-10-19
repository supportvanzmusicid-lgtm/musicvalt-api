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

// Endpoint pesan selamat datang di halaman utama (opsional)
app.get('/', (req, res) => {
  res.json({ message: 'API YouTube Music Aktif!' });
});

// Endpoint Search Musik
app.get('/api/search', async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) {
      return res.status(400).json({ error: 'Parameter "q" wajib diisi' });
    }

    const yt = await getYT();
    
    // Menggunakan pencarian khusus kategori Music / Song
    const searchResults = await yt.music.search(query, { type: 'song' });

    // Ekstrak dan format data lagu (Judul, Artis, Cover, ID Video, Durasi)
    const formattedSongs = searchResults.songs?.contents?.map((item) => {
      return {
        id: item.id,
        title: item.title,
        artist: item.artists ? item.artists.map(a => a.name).join(', ') : 'Unknown Artist',
        album: item.album ? item.album.name : null,
        duration: item.duration ? item.duration.text : null,
        thumbnail: item.thumbnail ? item.thumbnail.contents : []
      };
    }) || [];

    res.json({
      success: true,
      total: formattedSongs.length,
      results: formattedSongs
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Endpoint Play / Info Detail Lagu
app.get('/api/play', async (req, res) => {
  try {
    const videoId = req.query.id;
    if (!videoId) {
      return res.status(400).json({ error: 'Parameter "id" wajib diisi' });
    }

    const yt = await getYT();
    const info = await yt.getInfo(videoId);

    res.json({
      success: true,
      id: videoId,
      title: info.basic_info.title,
      artist: info.basic_info.author,
      duration: info.basic_info.duration,
      thumbnails: info.basic_info.thumbnail
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = app;
