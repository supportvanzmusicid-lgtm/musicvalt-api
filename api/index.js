const express = require('express');
const { Innertube } = require('youtubei.js');

const app = express();
app.use(express.json());

let ytPromise = null;

// Inisialisasi YouTubeJS sekali saat fungsi dipanggil pertama kali
async function getYT() {
  if (!ytPromise) {
    ytPromise = Innertube.create({
      lang: 'id',
      location: 'ID'
    });
  }
  return ytPromise;
}

// Endpoint Search: /api/search?q=nama_lagu
app.get('/api/search', async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) {
      return res.status(400).json({ error: 'Parameter "q" wajib diisi' });
    }

    const yt = await getYT();
    const searchResults = await yt.search(query, { type: 'song' });

    res.json({
      success: true,
      results: searchResults.contents
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Endpoint Play/Info: /api/play?id=video_id
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
      title: info.basic_info.title,
      duration: info.basic_info.duration,
      thumbnails: info.basic_info.thumbnail
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = app;
