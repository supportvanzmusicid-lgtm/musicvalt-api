import express from 'express';
import axios from 'axios';
import { Innertube } from 'youtubei.js';

const app = express();
app.use(express.json());

let ytInstance = null;

// Helper untuk inisialisasi client YouTube Music
async function getYouTubeClient() {
  if (!ytInstance) {
    ytInstance = await Innertube.create({
      retrieve_player: false, // Hemat memori di Vercel
      generate_session_locality: true
    });
  }
  return ytInstance;
}

// Helper untuk mendapatkan gambar/cover resolusi tinggi (HD)
function getHDCoverUrl(thumbnails) {
  if (!thumbnails || thumbnails.length === 0) return null;
  // Mengambil thumbnail dengan resolusi tertinggi dari array
  const lastThumb = thumbnails[thumbnails.length - 1];
  let url = lastThumb.url;

  // Mengubah parameter ukuran pada URL YouTube agar menghasilkan kualitas HD/Maxres
  if (url.includes('lh3.googleusercontent.com') || url.includes('yt3.ggpht.com')) {
    url = url.replace(/=w\d+-h\d+/, '=w1080-h1080');
  } else if (url.includes('i.ytimg.com')) {
    url = url.replace(/hqdefault|mqdefault|default/, 'maxresdefault');
  }

  return url;
}

// 1. Endpoint YouTube Music Search (Termasuk Cover HD, Title, Artist, & ID)
app.get('/api/youtube/search', async (req, res) => {
  try {
    const query = req.query.q || 'Official Release Topic';
    const yt = await getYouTubeClient();
    
    // Melakukan pencarian khusus katalog lagu YouTube Music
    const searchResults = await yt.music.search(query, { type: 'song' });

    // Format output data agar rapi dan lengkap
    const formattedSongs = (searchResults.songs?.contents || searchResults.contents || []).map(song => {
      // Pembacaan nama artist dari properti artists atau authors
      const artistName = song.artists 
        ? song.artists.map(a => a.name).join(', ') 
        : (song.author?.name || 'Unknown Artist');

      // Ambil Thumbnail & ubah ke HD
      const thumbnails = song.thumbnails || song.thumbnail || [];
      const hdCover = getHDCoverUrl(thumbnails);

      return {
        id: song.id || song.videoId,
        title: song.title || song.name,
        artist: artistName,
        album: song.album?.name || null,
        duration: song.duration?.text || null,
        cover_hd: hdCover,
        thumbnails: thumbnails // Menyimpan array thumbnail asli sebagai cadangan
      };
    });

    return res.status(200).json({
      success: true,
      query: query,
      total_results: formattedSongs.length,
      results: formattedSongs
    });
  } catch (error) {
    console.error('YouTube API Error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// 2. Endpoint GitHub Releases
app.get('/api/github/releases', async (req, res) => {
  try {
    const owner = req.query.owner || 'octocat';
    const repo = req.query.repo || 'Hello-World';
    
    const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}/releases`, {
      headers: { 'User-Agent': 'MusicValt-API' }
    });

    return res.status(200).json({
      success: true,
      releases: response.data
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Root Endpoint
app.get('/', (req, res) => {
  res.json({ status: 'Online', message: 'MusicValt API Running' });
});

export default app;

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}
