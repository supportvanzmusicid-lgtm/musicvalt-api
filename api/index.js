const express = require('express');
const { Innertube } = require('youtubei.js');

const app = express();
app.use(express.json());

let ytInstance = null;

async function getYT() {
  if (!ytInstance) {
    ytInstance = await Innertube.create({ 
      client: 'YOUTUBE', // Menggunakan client YouTube utama agar filter musik lebih akurat
      lang: 'id',
      location: 'ID'
    });
  }
  return ytInstance;
}

app.get('/api/search', async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) {
      return res.status(400).json({ error: 'Parameter "q" wajib diisi' });
    }

    const yt = await getYT();
    
    // Cari khusus kategori lagu/musik resmi
    const searchResults = await yt.music.search(query, { type: 'song' });
    
    // Ambil dari rak songs
    const items = searchResults.songs?.contents || searchResults.contents || [];

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

        // Ambil nama artis resmi (biasanya mencakup artis utama atau - Topic)
        let artistName = 'Unknown Artist';
        if (item.artists && Array.isArray(item.artists)) {
          artistName = item.artists.map(a => a.name).join(', ');
        } else if (item.author?.name) {
          artistName = item.author.name;
        }

        // Ambil nama album jika dari rilisan resmi
        let albumName = item.album?.name || null;

        // Ambil durasi
        let durationText = item.duration?.text || item.duration || '0:00';

        // Ambil thumbnail cover lagu
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

module.exports = app;
