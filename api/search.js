const YTMusic = require('ytmusic-api').default;
const ytmusic = new YTMusic();

// Inisialisasi API YouTube Music
let isInitialized = false;

module.exports = async (req, res) => {
    // Header CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');

    const query = req.query.q;

    if (!query) {
        return res.status(400).json({ error: 'Parameter pencarian (q) wajib diisi!' });
    }

    try {
        // Pastikan inisialisasi dijalankan sekali
        if (!isInitialized) {
            await ytmusic.initialize();
            isInitialized = true;
        }

        // Pencarian khusus lagu (Songs) langsung dari database YouTube Music (Release Topic)
        const songs = await ytmusic.searchSongs(query);

        // Format hasil data agar bersih dan menyertakan Cover HD
        const formattedSongs = songs.slice(0, 10).map(song => {
            const videoId = song.videoId;
            const hdThumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

            return {
                id: videoId,
                title: song.name,
                artist: song.artist ? song.artist.name : 'Unknown Artist',
                album: song.album ? song.album.name : 'Single',
                duration: song.duration,
                url: `https://www.youtube.com/watch?v=${videoId}`,
                thumbnail: hdThumbnail
            };
        });

        return res.status(200).json({
            status: 'success',
            data: formattedSongs
        });
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
};
