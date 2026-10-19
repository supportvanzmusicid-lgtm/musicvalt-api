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
    
    // Coba gunakan pencarian standar YouTube
    const searchResults = await yt.search(query);
    
    // Ambil dari berbagai kemungkinan properti contents
    const items = searchResults.videos || searchResults.contents || [];

    const formattedSongs = items
      .filter(item => item.id && item.title)
      .map((item) => {
        // Ambil teks judul dengan aman
        let titleText = 'Unknown Title';
        if (typeof item.title === 'string') {
          titleText = item.title;
        } else if (item.title?.text) {
          titleText = item.title.text;
        }

        // Ambil nama artis / author
        let artistName = 'Unknown Artist';
        if (item.author?.name) {
          artistName = item.author.name;
        } else if (item.authors?.[0]?.name) {
          artistName = item.authors[0].name;
        }

        // Ambil durasi
        let durationText = item.duration?.text || item.duration || '0:00';

        // Ambil thumbnail
        let thumbnails = item.thumbnails || item.thumbnail?.contents || [];

        return {
          id: item.id,
          title: titleText,
          artist: artistName,
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
