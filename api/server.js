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

    // Daftar server publik Invidious alternatif
    const invidiousInstances = [
        'https://invidious.projectsegfau.lt',
        'https://vid.puffyan.us',
        'https://invidious.no-mad.net',
        'https://inv.nadeko.net'
    ];

    let searchData = null;
    let successInstance = null;

    // 1. Cari lagu via Invidious API
    for (const instance of invidiousInstances) {
        try {
            const searchRes = await fetch(`${instance}/api/v1/search?q=${encodeURIComponent(query)}&type=video`);
            const text = await searchRes.text();
            
            if (searchRes.ok && text) {
                const json = JSON.parse(text);
                if (Array.isArray(json) && json.length > 0) {
                    // Filter ambil video musik resmi / topic
                    const officialItems = json.filter(item => 
                        item.author.includes('Topic') || item.type === 'video'
                    );
                    searchData = officialItems.length > 0 ? officialItems : json;
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
            message: 'Server Invidious sedang sibuk. Coba beberapa saat lagi.' 
        });
    }

    try {
        const firstItem = searchData[0];
        const videoId = firstItem.videoId;

        // 2. Ambil detail stream audio langsung dari Invidious
        const streamRes = await fetch(`${successInstance}/api/v1/videos/${videoId}`);
        const streamText = await streamRes.text();

        if (!streamRes.ok || !streamText) {
            return res.status(502).json({ 
                status: 'error', 
                message: 'Gagal mengambil detail stream lagu.' 
            });
        }

        const streamData = JSON.parse(streamText);

        // Ambil link audio adaptif (m4a / webm)
        const adaptiveFormats = streamData.adaptiveFormats || [];
        const audioFormat = adaptiveFormats.find(f => f.type?.includes('audio/mp4')) 
                            || adaptiveFormats.find(f => f.type?.includes('audio/webm'));

        const audioUrl = audioFormat?.url;

        if (!audioUrl) {
            return res.status(500).json({ 
                status: 'error', 
                message: 'Link audio mentah tidak ditemukan.' 
            });
        }

        // Bersihkan nama artis dari akhiran " - Topic"
        let rawArtist = firstItem.author || "Unknown Artist";
        let cleanArtist = rawArtist.replace(/\s*-\s*Topic$/i, '').trim();

        // Ambil thumbnail kualitas terbaik
        let albumCover = firstItem.videoThumbnails?.find(v => v.quality === 'maxres')?.url 
                         || firstItem.videoThumbnails?.[0]?.url;

        // 3. Kirim hasil sukses ke ExoPlayer Android
        return res.status(200).json({
            status: 'success',
            data: {
                title: firstItem.title,
                artist: cleanArtist,
                cover: albumCover,
                duration: firstItem.lengthSeconds,
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
