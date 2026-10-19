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
    const query = req.query.q || 'tulus';
    const yt = await getYT();
    
    const searchResults = await yt.music.search(query);
    
    // Ambil array konten pertama untuk di-debug
    let items = searchResults.songs?.contents || searchResults.contents || [];

    res.json({
      success: true,
      sample_item: items[0] || "Tidak ada item ditemukan"
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = app;
