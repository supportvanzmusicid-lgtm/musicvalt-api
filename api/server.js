module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const query = req.query.q;
    
    if (!query) {
        return res.status(400).json({ 
            status: 'error', 
            message: 'Parameter pencarian (q) wajib diisi!' 
        });
    }

    try {
        // 1. Ambil data pencarian dari Piped API
        const searchRes = await fetch(`https://pipedapi.kavin.rocks/search?q=${encodeURIComponent(query)}&filter=music_songs`);
        const searchResText = await searchRes.text();

        // Cek apakah balasan dari server valid atau kosong
        if (!searchRes.ok || !searchResText) {
            return res.status(502).json({ 
                status: 'error', 
                message: 'Server Piped sedang sibuk atau down. Coba beberapa saat lagi.' 
            });
        }

        let searchData;
        try {
            searchData = JSON.parse(searchResText);
        } catch (e) {
            return res.status(502).json({ 
                status: 'error', 
                message: 'Gagal memproses data dari Piped API (Bukan format JSON).' 
            });
        }

        if (!searchData.items || searchData.items.length === 0) {
            return res.status(404).json({ 
                status: 'error', 
                message: 'Lagu tidak ditemukan' 
            });
        }

        const firstItem = searchData.items[0];
        const videoId = firstItem.url.replace('/watch?v=', '');

        // 2. Minta Stream Link dari Piped API
        const streamRes = await fetch(`https://pipedapi.kavin.rocks/streams/${videoId}`);
        const streamResText = await streamRes.text();

        if (!streamRes.ok || !streamResText) {
            return res.status(502).json({ 
                status: 'error', 
                message: 'Gagal mengambil stream audio dari Piped.' 
            });
        }

        let streamData;
        try {
            streamData = JSON.parse(streamResText);
        } catch (e) {
            return res.status(502).json({ 
                status: 'error', 
                message: 'Format stream audio tidak valid.' 
            });
        }

        // Cari format audio m4a / opus
        const audioUrl = streamData.audioStreams?.find(s => s.mimeType?.includes('audio/mp4'))?.url 
                         || streamData.audioStreams?.[0]?.url;

        if (!audioUrl) {
            return res.status(500).json({ 
                status: 'error', 
                message: 'Link audio mentah tidak ditemukan' 
            });
        }

        // 3. Kirim hasil sukses ke ExoPlayer
        return res.status(200).json({
            status: 'success',
            data: {
                title: streamData.title,
                artist: streamData.uploader,
                thumbnail: streamData.thumbnailUrl,
                duration: streamData.duration,
                audioUrl: audioUrl
            }
        });

    } catch (error) {
        return res.status(500).json({ 
            status: 'error', 
            message: error.message 
        });
    }
};
