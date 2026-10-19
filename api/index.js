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

app.get('/api/search', async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) {
      return res.status(400).json({ error: 'Parameter "q" wajib diisi' });
    }

    const yt = await getYT();
    
    // Gunakan pencarian musik secara umum
    const searchResults = await yt.music.search(query);
    
    // Ambil semua kemungkinan data dari berbagai rak YouTube Music (songs, contents, videos, dll)
    let rawItems = [];
    if (searchResults.songs?.contents) {
      rawItems = searchResults.songs.contents;
    } else if (searchResults.contents) {
      rawItems = searchResults.contents;
    } else if (searchResults.videos) {
      rawItems = searchResults.videos;
    }

    // Jika masih kosong, ambil dari pencarian umum utama
    if (rawItems.length === 0) {
      const general = await yt.search(query, { type: 'video' });
      rawItems = general.videos || general.contents || [];
    }

    const formattedSongs = rawItems
      .filter(item => (item.id || item.video_id) && (item.title || item.name))
      .map((item) => {
        let titleText = 'Unknown Title';
        if (typeof item.title === 'string') {
          titleText = item.title;
        } else if (item.title?.text) {
          titleText = item.title.text;
        } else if (typeof item.name === 'string') {
          titleText = item.name;
        }

        let artistName = 'Unknown Artist';
        if (item.artists && Array.isArray(item.artists)) {
          artistName = item.artists.map(a => a.name).join(', ');
        } else if (item.author?.name) {
          artistName = item.author.name;
        } else if (item.authors?.[0]?.name) {
          artistName = item.authors[0].name;
        }

        let durationText = item.duration?.text || item.duration || '0:00';
        let thumbnails = item.thumbnails || item.thumbnail?.contents || item.thumbnail || [];

        return {
          id: item.id || item.video_id,
          title: titleText,
          artist: artistName,
          album: item.album?.name || null,
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
