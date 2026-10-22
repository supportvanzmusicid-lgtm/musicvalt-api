import express from 'express';
import axios from 'axios';
import { Innertube } from 'youtubei.js';

const app = express();
app.use(express.json());

let ytInstance = null;

async function getYouTubeClient() {
  if (!ytInstance) {
    ytInstance = await Innertube.create({
      retrieve_player: false,
      generate_session_locality: true
    });
  }
  return ytInstance;
}

// Helper untuk memaksa cover album/lagu ke resolusi HD (1080p)
function getHDCoverUrl(thumbnails) {
  if (!thumbnails || thumbnails.length === 0) return null;
  
  const lastThumb = thumbnails[thumbnails.length - 1];
  let url = lastThumb.url || lastThumb;

  if (typeof url !== 'string') return null;

  if (url.includes('googleusercontent.com') || url.includes('ggpht.com')) {
    url = url.split('=')[0] + '=w1080-h1080-l90-rj';
  } else if (url.includes('i.ytimg.com')) {
    url = url.replace(/\/vi\/([^\/]+)\/.*/, '/vi/$1/maxresdefault.jpg');
  }

  return url;
}

// Endpoint YouTube Music Search (Judul, Nama Artist, Album, Durasi, & Cover HD)
app.get('/api/youtube/search', async (req, res) => {
  try {
    const query = req.query.q || 'Official Release Topic';
    const yt = await getYouTubeClient();
    
    const searchResults = await yt.music.search(query, { type: 'song' });

    const formattedSongs = (searchResults.songs?.contents || searchResults.contents || []).map(song => {
      const artistName = song.artists 
        ? song.artists.map(a => a.name).join(', ') 
        : (song.author?.name || 'Unknown Artist');

      const thumbnails = song.thumbnails || song.thumbnail || [];
      const hdCover = getHDCoverUrl(thumbnails);

      return {
        id: song.id || song.videoId,
        title: song.title || song.name,
        artist: artistName,
        album: song.album?.name || null,
        duration: song.duration?.text || null,
        cover_hd: hdCover,
        thumbnails: thumbnails
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

// Endpoint GitHub Releases
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
  return res.json({ status: 'Online', message: 'MusicValt Backend API Running Smoothly!' });
});

export default app;

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}
