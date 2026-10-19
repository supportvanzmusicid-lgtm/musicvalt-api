const express = require('express');
const { Innertube } = require('youtubei.js');

const app = express();
app.use(express.json());

let ytInstance = null;

async function getYT() {
  if (!ytInstance) {
    ytInstance = await Innertube.create({
      // Menggunakan client WEB agar lebih stabil di serverless
      client: 'WEB' 
    });
  }
  return ytInstance;
}

app.get('/api/search', async (req, res) => {
  try {
    const query = req.query.q || 'tulus';
    const yt = await getYT();
    
    // Ambil data mentah tanpa filter ribet dulu
    const result = await yt.music.search(query);

    res.json({
      success: true,
      raw_structure: result // Ini akan menampilkan isi asli dari YouTube Music
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = app;
