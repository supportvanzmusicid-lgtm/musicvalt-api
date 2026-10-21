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

    // Daftar server publik Piped cadangan (Multi-instance fallback)
    const pipedInstances = [
        'https://pipedapi.kavin.rocks',
        'https://pipedapi.privacy.com.de',
        'https://pipedapi.tokhmi.xyz'
    ];

    let searchData = null;
    let successInstance = null;

    // 1. Coba cari lagu ke server-server Piped satu per satu sampai ada yang tembus
    for (const instance of pipedInstances) {
        try {
            const searchRes = await fetch(`${instance}/search?q=${encodeURIComponent(query)}&filter=music_songs`);
            const text = await searchRes.text();
            
            if (searchRes.ok && text) {
                const json = JSON.parse(text);
                if (json.items && json.items.length > 0) {
                    searchData = json;
                    successInstance = instance;
                    break; // Kalau berhasil, hentikan perulangan
                }
            }
        } catch (e) {
            // Lanjut coba instance berikutnya kalau yang ini error
            continue;
        }
    }

    if (!searchData || !successInstance) {
        return res.status(502).json({ 
            status: 'error', 
            message: 'Semua server Piped publik sedang sibuk atau down. Coba beberapa saat lagi.' 
        });
    }

    try {
        const firstItem = searchData.items[0];
        const videoId = firstItem.url.replace('/watch?v=', '');

        // 2. Ambil Stream Link dari server Piped yang sama yang sukses tadi
        const streamRes = await fetch(`${successInstance}/streams/${videoId}`);
        const streamText = await streamRes.text();

        if (!streamRes.ok || !streamText) {
            return res.status(502).json({ 
                status: 'error', 
                message: 'Gagal mengambil stream audio dari server Piped.' 
            });
        }

        const streamData = JSON.parse(streamText);

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
