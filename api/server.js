module.exports = async (req, res) => {
    // Pengaturan CORS agar bisa diakses dari aplikasi Android
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    // Tangani preflight request
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const query = req.query.q;
    
    if (!query) {
        return res.status(400).json({ 
            status: 'error', 
            message: 'Parameter pencarian (q) wajib diisi! Contoh: ?q=raden rakha' 
        });
    }

    try {
        // 1. Cari lagu ke Public Piped API
        const searchRes = await fetch(`https://pipedapi.kavin.rocks/search?q=${encodeURIComponent(query)}&filter=music_songs`);
        const searchData = await searchRes.json();

        if (!searchData.items || searchData.items.length === 0) {
            return res.status(404).json({ 
                status: 'error', 
                message: 'Lagu tidak ditemukan' 
            });
        }

        // Ambil hasil teratas
        const firstItem = searchData.items[0];
        const videoId = firstItem.url.replace('/watch?v=', '');

        // 2. Minta Stream Link (Audio Mentah) dari Piped API
        const streamRes = await fetch(`https://pipedapi.kavin.rocks/streams/${videoId}`);
        const streamData = await streamRes.json();

        // Cari format audio m4a / opus
        const audioUrl = streamData.audioStreams?.find(s => s.mimeType?.includes('audio/mp4'))?.url 
                         || streamData.audioStreams?.[0]?.url;

        if (!audioUrl) {
            return res.status(500).json({ 
                status: 'error', 
                message: 'Gagal mengekstrak link audio' 
            });
        }

        // 3. Kirim data bersih ke aplikasi Android (ExoPlayer)
        return res.status(200).json({
            status: 'success',
            data: {
                title: streamData.title,
                artist: streamData.uploader,
                thumbnail: streamData.thumbnailUrl,
                duration: streamData.duration,
                audioUrl: audioUrl // Link ini yang dimasukkan ke ExoPlayer
            }
        });

    } catch (error) {
        return res.status(500).json({ 
            status: 'error', 
            message: error.message 
        });
    }
};
