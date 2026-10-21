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
