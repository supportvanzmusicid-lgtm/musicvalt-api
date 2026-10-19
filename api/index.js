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
    
    // Pencarian khusus di YouTube Music dengan filter lagu (songs)
    const searchResults = await yt.music.search(query, { type: 'song' });
    
    // Mengambil item dari hasil pencarian lagu YouTube Music
    const items = searchResults.songs?.contents || searchResults.contents || [];

    const formattedSongs = items
      .filter(item => item.id && item.title)
      .map((item) => {
        // Judul lagu
        let titleText = typeof item.title === 'string' ? item.title : (item.title?.text || 'Unknown Title');

        // Nama artis (mendukung artis utama atau rilisan - Topic)
        let artistName = 'Unknown Artist';
        if (item.artists && Array.isArray(item.artists)) {
          artistName = item.artists.map(a => a.name).join(', ');
        } else if (item.author?.name) {
          artistName = item.author.name;
        }

        // Album & Durasi
        let albumName = item.album?.name || null;
        let durationText = item.duration?.text || item.duration || '0:00';

        // Thumbnail / Cover lagu resmi
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
