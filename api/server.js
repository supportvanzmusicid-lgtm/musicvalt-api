const express = require('express');
const cors = require('cors');
const YouTube = require('youtube-sr').default;

const app = express();

app.use(cors());
app.use(express.json());

// Endpoint Tes Utama
app.get('/', (req, res) => {
    res.json({
        status: 'online',
        message: 'API YouTube Music Vercel Berjalan dengan server.js!'
    });
});

// Endpoint Pencarian Lagu & Cover HD Resmi
app.get('/api/search', async (req, res) => {
    const query = req.query.q;

    if (!query) {
        return res.status(400).json({ error: 'Parameter pencarian (q) wajib diisi!' });
    }

    try {
        const results = await YouTube.search(query, { limit: 10, type: 'video' });

        const songs = results.map(video => {
            const videoId = video.id;
            const hdThumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
            const fallbackThumbnail = video.thumbnail ? video.thumbnail.url : null;

            return {
                id: videoId,
                title: video.title,
                channel: video.channel ? video.channel.name : 'Unknown Artist',
                url: video.url,
                duration: video.durationFormatted,
                thumbnail: hdThumbnail,
                fallbackThumbnail: fallbackThumbnail
            };
        });

        return res.json({
            status: 'success',
            data: songs
        });
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

module.exports = app;

if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Server lokal berjalan di port ${PORT}`));
}
