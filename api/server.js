const express = require('express');
const cors = require('cors');
const YouTube = require('youtube-sr').default;

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/search', async (req, res) => {
    const query = req.query.q;

    if (!query) {
        return res.status(400).json({ error: 'Parameter pencarian (q) wajib diisi!' });
    }

    try {
        // Cari lagu di YouTube (utamakan dari channel Topic/Resmi)
        const results = await YouTube.search(query, { limit: 10, type: 'video' });

        const songs = results.map(video => {
            const videoId = video.id;
            
            // Trik URL YouTube untuk mendapatkan thumbnail kualitas HD (Max Resolution)
            // Ukuran asli maxresdefault memberikan resolusi 1280x720 (jika tersedia dari artisnya)
            const hdThumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
            const fallbackThumbnail = video.thumbnail ? video.thumbnail.url : null;

            return {
                id: videoId,
                title: video.title, // Judul lagu asli dari video
                channel: video.channel ? video.channel.name : 'Unknown Artist', // Nama Artist / Release Topic
                url: video.url,
                duration: video.durationFormatted,
                // Menggunakan HD thumbnail, jika tidak ada fallback ke standar
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
