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

    // Daftar instance Invidious cadangan yang lebih banyak
    const invidiousInstances = [
        'https://inv.nadeko.net',
        'https://invidious.projectsegfau.lt',
        'https://in.projectsegfau.lt',
        'https://vid.puffyan.us',
        'https://invidious.no-mad.net'
    ];

    let streamData = null;

    // Coba tembus server satu per satu sampai ada yang merespon link audio
    for (const instance of invidiousInstances) {
        try {
            // 1. Cari lagu
            const searchRes = await fetch(`${instance}/api/v1/search?q=${encodeURIComponent(query)}&type=video`);
            const text = await searchRes.text();
            
            if (!searchRes.ok || !text) continue;
            
            const json = JSON.parse(text);
            if (!Array.isArray(json) || json.length === 0) continue;

            // Prioritaskan yang dari Channel Topic (Resmi)
            const officialItem = json.find(item => item.author && item.author.includes('Topic')) || json[0];
            const videoId = officialItem.videoId;

            // 2. Ambil detail stream lagu langsung dari instance yang sama
            const streamRes = await fetch(`${instance}/api/v1/videos/${videoId}`);
            const streamText = await streamRes.text();
            
            if (!streamRes.ok || !streamText) continue;

            const streamJson = JSON.parse(streamText);
            const adaptiveFormats = streamJson.adaptiveFormats || [];
            
            // Cari format audio m4a atau webm terbaik
            const audioFormat = adaptiveFormats.find(f => f.type?.includes('audio/mp4')) 
                                || adaptiveFormats.find(f => f.type?.includes('audio/webm'));

            if (audioFormat && audioFormat.url) {
                // Jika sukses mendapatkan link audio, simpan datanya dan hentikan perulangan
                let rawArtist = officialItem.author || "Unknown Artist";
                let cleanArtist = rawArtist.replace(/\s*-\s*Topic$/i, '').trim();
                let albumCover = officialItem.videoThumbnails?.find(v => v.quality === 'maxres')?.url 
                                 || officialItem.videoThumbnails?.[0]?.url;

                streamData = {
                    title: officialItem.title,
                    artist: cleanArtist,
                    cover: albumCover,
                    duration: officialItem.lengthSeconds,
                    audioUrl: audioFormat.url
                };
                break;
            }
        } catch (e) {
            continue; // Coba instance berikutnya jika error/timeout
        }
    }

    if (!streamData) {
        return res.status(502).json({ 
            status: 'error', 
            message: 'Semua server publik sedang sibuk. Coba beberapa saat lagi atau ganti kata kunci.' 
        });
    }

    // 3. Kirim hasil sukses ke aplikasi ExoPlayer Android
    return res.status(200).json({
        status: 'success',
        data: streamData
    });
};
