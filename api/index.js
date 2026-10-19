const express = require('express');
const { Innertube } = require('youtubei.js');

const app = express();
app.use(express.json());

let ytInstance = null;

async function getYT() {
  if (!ytInstance) {
    ytInstance = await Innertube.create({ client: 'WEB' });
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
    
    // Gunakan pencarian umum standar YouTube (lebih stabil dan selalu ada thumbnail/artis)
    const searchResults = await yt.search(query, { type: 'video' });
    const items = searchResults.videos || searchResults.contents || [];

    const formattedSongs = items
      .filter(item => item.id && item.title)
      .map((item) => {
        // Ambil judul dengan aman
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

        // Ambil URL Thumbnail / Cover langsung dalam bentuk array / string terbaik
        let thumbnails = [];
        if (item.thumbnails && Array.isArray(item.thumbnails)) {
          thumbnails = item.thumbnails;
        } else if (item.thumbnail?.contents) {
          thumbnails = item.thumbnail.contents;
        }

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

module.exports = app;
