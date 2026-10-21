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

    // Daftar server publik Piped cadangan
    const pipedInstances = [
        'https://pipedapi.kavin.rocks',
        'https://pipedapi.privacy.com.de',
        'https://pipedapi.tokhmi.xyz'
    ];

    let searchData = null;
    let successInstance = null;

    // 1. Cari lagu khusus kategori "music_songs" (Rilis Resmi / Topic Channel)
    for (const instance of pipedInstances) {
        try {
            // Filter 'music_songs' memastikan hanya mengambil lagu resmi YouTube Music
            const searchRes = await fetch(`${instance}/search?q=${encodeURIComponent(query)}&filter=music_songs`);
            const text = await searchRes.text();
            
            if (searchRes.ok && text) {
                const json = JSON.parse(text);
                if (json.items && json.items.length > 0) {
                    // Filter tambahan: Utamakan hasil yang berupa musik resmi (type === 'music_song' atau 'stream')
                    const officialItems = json.items.filter(item => 
                        item.type === 'music_song' || item.uploaderUrl?.includes('-Topic') || item.uploaderVerified
                    );

                    searchData = officialItems.length > 0 ? officialItems : json.items;
                    successInstance = instance;
                    break;
                }
            }
        } catch (e) {
            continue;
        }
    }

    if (!searchData || !successInstance) {
        return res.status(502).json({ 
            status: 'error', 
            message: 'Semua server Piped publik sedang sibuk atau lagu tidak ditemukan. Coba lagi.' 
        });
    }

    try {
        // Ambil hasil teratas dari lagu resmi
        const firstItem = searchData[0];
        const videoId = firstItem.url.replace('/watch?v=', '');

        // 2. Ambil detail stream & metadata resmi dari Piped
        const streamRes = await fetch(`${successInstance}/streams/${videoId}`);
        const streamText = await streamRes.text();

        if (!streamRes.ok || !streamText) {
            return res.status(502).json({ 
                status: 'error', 
                message: 'Gagal mengambil detail lagu dari server.' 
            });
        }

        const streamData = JSON.parse(streamText);

        // Cari format audio m4a / opus dengan kualitas terbaik
        const audioUrl = streamData.audioStreams?.find(s => s.mimeType?.includes('audio/mp4'))?.url 
                         || streamData.audioStreams?.[0]?.url;

        if (!audioUrl) {
            return res.status(500).json({ 
                status: 'error', 
                message: 'Link audio mentah tidak ditemukan.' 
            });
        }

        // Bersihkan nama artist jika ada akhiran " - Topic"
        let rawArtist = streamData.uploader || firstItem.uploaderName || "Unknown Artist";
        let cleanArtist = rawArtist.replace(/\s*-\s*Topic$/i, '').trim();

        // Ambil cover album dengan resolusi terbaik
        let albumCover = streamData.thumbnailUrl || firstItem.thumbnail;

        // 3. Kirim respon lengkap untuk UI ExoPlayer (Cover, Artist, Title, Stream)
        return res.status(200).json({
            status: 'success',
            data: {
                title: streamData.title,          // Nama Lagu / Judul
                artist: cleanArtist,               // Nama Artist / Penyanyi (Bersih tanpa "- Topic")
                cover: albumCover,                 // URL Gambar Cover Album
                duration: streamData.duration,     // Durasi Lagu (detik)
                audioUrl: audioUrl                 // Direct URL Stream M4A/Opus untuk ExoPlayer
            }
        });

    } catch (error) {
        return res.status(500).json({ 
            status: 'error', 
            message: error.message 
        });
    }
};
