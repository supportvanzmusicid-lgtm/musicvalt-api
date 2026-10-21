// File: api/search.js di Vercel
module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const query = req.query.q;

    if (!query) return res.status(400).json({ error: 'Query wajib diisi' });

    try {
        // 1. Cari ke Piped API
        const searchRes = await fetch(`https://pipedapi.kavin.rocks/search?q=${encodeURIComponent(query)}&filter=music_songs`);
        const searchData = await searchRes.json();

        if (!searchData.items || searchData.items.length === 0) {
            return res.status(404).json({ message: 'Lagu tidak ditemukan' });
        }

        const firstItem = searchData.items[0];
        const videoId = firstItem.url.replace('/watch?v=', '');

        // 2. Minta Stream Link dari Piped API
        const streamRes = await fetch(`https://pipedapi.kavin.rocks/streams/${videoId}`);
        const streamData = await streamRes.json();

        // 3. Ambil URL audio M4A kualitas tinggi
        const audioUrl = streamData.audioStreams.find(s => s.mimeType.includes('audio/mp4'))?.url || streamData.audioStreams[0]?.url;

        return res.status(200).json({
            status: 'success',
            title: streamData.title,
            artist: streamData.uploader,
            thumbnail: streamData.thumbnailUrl,
            audioUrl: audioUrl // <-- Link ini yang dimasukkan ke ExoPlayer!
        });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};
