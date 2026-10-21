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

    // Daftar server publik Piped yang lebih banyak & aktif
    const pipedInstances = [
        'https://pipedapi.kavin.rocks',
        'https://pipedapi.drgns.space',
        'https://api.piped.projectsegfau.lt',
        'https://pipedapi.privacy.com.de'
    ];

    // Header penyamaran agar request dari Vercel tidak diblokir sebagai bot
    const headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
    };

    let searchData = null;
    let successInstance = null;

    // 1. Coba cari lagu ke instance Piped satu per satu
    for (const instance of pipedInstances) {
        try {
            const searchRes = await fetch(`${instance}/search?q=${encodeURIComponent(query)}&filter=music_songs`, { headers });
            const text = await searchRes.text();
            
            if (searchRes.ok && text) {
                const json = JSON.parse(text);
                if (json.items && json.items.length > 0) {
                    // Prioritaskan lagu resmi (Topic / Verified)
                    const officialItems = json.items.filter(item => 
                        item.type === 'music_song' || item.uploaderUrl?.includes('-Topic') || item.uploaderVerified
                    );

                    searchData = officialItems.length > 0 ? officialItems : json.items;
                    successInstance = instance;
                    break; 
                }
            }
        } catch (e) {
            continue; // Lanjut ke server berikutnya jika gagal
        }
    }

    if (!searchData || !successInstance) {
        return res.status(502).json({ 
            status: 'error', 
            message: 'Semua server Piped publik menolak koneksi atau sibuk. Coba gunakan kata kunci lain.' 
        });
    }

    try {
        const firstItem = searchData[0];
        const videoId = firstItem.url.replace('/watch?v=', '');

        // 2. Ambil detail stream & metadata resmi dari server yang sama
        const streamRes = await fetch(`${successInstance}/streams/${videoId}`, { headers });
        const streamText = await streamRes.text();

        if (!streamRes.ok || !streamText) {
            return res.status(502).json({ 
                status: 'error', 
                message: 'Gagal mengambil detail lagu dari server.' 
            });
        }

        const streamData = JSON.parse(streamText);

        // Cari format audio m4a / opus terbaik
        const audioUrl = streamData.audioStreams?.find(s => s.mimeType?.includes('audio/mp4'))?.url 
                         || streamData.audioStreams?.[0]?.url;

        if (!audioUrl) {
            return res.status(500).json({ 
                status: 'error', 
                message: 'Link audio mentah tidak ditemukan.' 
            });
        }

        // Bersihkan nama artist dari akhiran " - Topic"
        let rawArtist = streamData.uploader || firstItem.uploaderName || "Unknown Artist";
        let cleanArtist = rawArtist.replace(/\s*-\s*Topic$/i, '').trim();

        // Ambil cover album
        let albumCover = streamData.thumbnailUrl || firstItem.thumbnail;

        // 3. Kirim hasil sukses
        return res.status(200).json({
            status: 'success',
            data: {
                title: streamData.title,
                artist: cleanArtist,
                cover: albumCover,
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
