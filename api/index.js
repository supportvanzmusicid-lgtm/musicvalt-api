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
    
    // Gunakan pencarian umum (general search) agar hasilnya lebih konsisten
    const searchResults = await yt.search(query, { type: 'video' });
    const rawContents = searchResults.contents || [];

    // Filter dan petakan data dengan aman
    const formattedSongs = rawContents
      .filter(item => item.id && item.title) // Pastikan punya ID dan Judul
      .map((item) => {
        // Ambil thumbnail dengan resolusi terbaik jika ada
        let thumbnails = [];
        if (item.thumbnails) {
          thumbnails = item.thumbnails;
        } else if (item.thumbnail?.contents) {
          thumbnails = item.thumbnail.contents;
        }

        return {
          id: item.id,
          title: item.title?.text || item.title,
          artist: item.author?.name || item.artists?.[0]?.name || 'Unknown Artist',
          album: item.album?.name || null,
          duration: item.duration?.text || item.duration || 'Live/Unknown',
          thumbnail: thumbnails
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
