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

// Route YouTube Music
app.get('/api/youtube/search', async (req, res) => {
  try {
    const query = req.query.q || 'Official Release Topic';
    const yt = await getYouTubeClient();
    const searchResults = await yt.music.search(query);
    
    return res.status(200).json({
      success: true,
      query: query,
      results: searchResults
    });
  } catch (error) {
    console.error('YouTube API Error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Route GitHub
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

// Route Principale
app.get('/', (req, res) => {
  res.json({ status: 'Online', message: 'API MusicValt opérationnelle !' });
});

export default app;

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
  });
}
