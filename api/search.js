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
        // Melakukan pencarian dengan prioritas musik resmi
        const results = await YouTube.search(`${query} audio topic`, { limit: 15, type: 'video' });

        // Filter ketat: Hanya ambil yang benar-benar dari channel "- Topic" atau yang berlabel Official
        const officialSongs = results.filter(video => {
            const channelName = video.channel ? video.channel.name : '';
            // Pastikan berasal dari auto-generated topic channel atau official artist channel
            return channelName.includes('- Topic') || channelName.toLowerCase().includes('vevo') || video.title.toLowerCase().includes('official audio');
        });

        // Jika filter terlalu ketat dan kosong, fallback ke hasil teratas agar tidak kosong
        const finalResults = officialSongs.length > 0 ? officialSongs : results.slice(0, 5);

        const songs = finalResults.map(video => {
            const videoId = video.id;
            const hdThumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

            return {
                id: videoId,
                title: video.title.replace(/official audio|official video|lyrics/gi, '').trim(), // Bersihkan judul dari kata-kata tambahan
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
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};
