const express = require('express');
const { Innertube } = require('youtubei.js');

const app = express();
app.use(express.json());

let ytInstance = null;

async function getYT() {
  if (!ytInstance) {
    ytInstance = await Innertube.create({
      lang: 'id',
      location: 'ID'
    });
  }
  return ytInstance;
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
    
    // Menggunakan pencarian khusus musik agar mendeteksi track official & - Topic
    const searchResults = await yt.music.search(query, { type: 'song' });
    
    // Ambil dari songs contents atau fallback ke videos/contents biasa
    const items = searchResults.songs?.contents || searchResults.videos || searchResults.contents || [];

    const formattedSongs = items
      .filter(item => item.id && item.title)
      .map((item) => {
        // Ambil judul lagu
        let titleText = 'Unknown Title';
        if (typeof item.title === 'string') {
          titleText = item.title;
        } else if (item.title?.text) {
          titleText = item.title.text;
        }

        // Ambil nama artist (bisa dari .artists atau .author)
        let artistName = 'Unknown Artist';
        if (item.artists && Array.isArray(item.artists)) {
          artistName = item.artists.map(a => a.name).join(', ');
        } else if (item.author?.name) {
          artistName = item.author.name;
        }

        // Ambil nama album jika ada
        let albumName = item.album?.name || null;

        // Ambil durasi
        let durationText = item.duration?.text || item.duration || '0:00';

        // Ambil thumbnail resolusi terbaik
        let thumbnails = item.thumbnails || item.thumbnail?.contents || [];

        return {
          id: item.id,
          title: titleText,
          artist: artistName,
          album: albumName,
          duration: durationText,
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
