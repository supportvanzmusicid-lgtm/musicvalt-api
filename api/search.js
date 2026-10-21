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
        // Otomatis tambahkan kata kunci "- Topic" ke kueri pencarian
        const searchKeywords = `${query} - Topic`;
        
        // Ambil lebih banyak hasil awal (limit: 25) untuk disaring secara ketat
        const results = await YouTube.search(searchKeywords, { limit: 25, type: 'video' });

        // STRICT FILTER: HANYA ambil video yang berasal dari channel "- Topic"
        const topicSongsOnly = results.filter(video => {
            const channelName = video.channel ? video.channel.name : '';
            return channelName.endsWith('- Topic') || channelName.includes('- Topic');
        });

        // Ambil maksimal 10 lagu resmi hasil saringan
        const finalSongs = topicSongsOnly.slice(0, 10);

        const songs = finalSongs.map(video => {
            const videoId = video.id;
            const hdThumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

            return {
                id: videoId,
                title: video.title,
                // Membersihkan tulisan " - Topic" agar nama artis di UI aplikasi tetap rapi
                artist: video.channel ? video.channel.name.replace(/\s*-\s*Topic/gi, '').trim() : 'Unknown Artist',
                url: video.url,
                duration: video.durationFormatted,
                thumbnail: hdThumbnail,
                isOfficialTopic: true
            };
        });

        return res.status(200).json({
            status: 'success',
            total: songs.length,
            data: songs
        });
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};
