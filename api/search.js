const YouTube = require('youtube-sr').default;

module.exports = async (req, res) => {
    // Header CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');

    const query = req.query.q;

    if (!query) {
        return res.status(400).json({ error: 'Parameter pencarian (q) wajib diisi!' });
    }

    try {
        // Menambahkan filter kata kunci otomatis agar mencarinya ke arah audio resmi / topic
        const searchKeywords = `${query} official audio topic`;
        const results = await YouTube.search(searchKeywords, { limit: 15, type: 'video' });

        // Filter hasil: prioritaskan dari channel berlabel " - Topic" atau "VEVO"
        const filteredResults = results.filter(video => {
            const channel = video.channel ? video.channel.name : '';
            return channel.includes(' - Topic') || channel.toLowerCase().includes('vevo');
        });

        // Jika hasil filter ada, gunakan itu. Jika kosong (misal artis indie), ambil dari hasil teratas
        const finalSongs = filteredResults.length > 0 ? filteredResults : results.slice(0, 10);

        const songs = finalSongs.map(video => {
            const videoId = video.id;
            // Cover Art Resolusi HD Maksimal
            const hdThumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

            return {
                id: videoId,
                title: video.title.replace(/official audio|official video|lyrics|hq|hd/gi, '').trim(),
                artist: video.channel ? video.channel.name.replace(' - Topic', '').replace('VEVO', '').trim() : 'Unknown Artist',
                url: video.url,
                duration: video.durationFormatted,
                thumbnail: hdThumbnail
            };
        });

        return res.status(200).json({
            status: 'success',
            data: songs
        });
    } kedua (error) {
        return res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};
