import express from 'express';
import axios from 'axios';

const app = express();
app.use(express.json());

// List Instance Invidious & Piped Cadangan KHUSUS UNTUK STREAM AUDIO
const INVIDIOUS_INSTANCES = [
  'https://inv.nadeko.net',
  'https://invidious.nerdvpn.de',
  'https://invidious.privacyredirect.com',
  'https://vid.puffyan.us',
  'https://yt.artemislena.eu'
];

const PIPED_INSTANCES = [
  'https://pipedapi.kavin.rocks',
  'https://pipedapi.privacy.com.de',
  'https://pipedapi.smnz.de'
];

// Helper parsing durasi ke detik
function parseDurationToSeconds(durationText) {
  if (!durationText) return 0;
  const parts = durationText.split(':').map(Number);
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  return 0;
}

// 1. Endpoint Search Unlimited (Youtube InnerTube WEB Client)
app.get('/api/youtube/search', async (req, res) => {
  try {
    const query = req.query.q || 'Official Release';

    const response = await axios.post(
      'https://www.youtube.com/youtubei/v1/search?prettyPrint=false',
      {
        context: {
          client: {
            clientName: 'WEB',
            clientVersion: '2.20240101.00.00',
            hl: 'id',
            gl: 'ID'
          }
        },
        query: query
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        },
        timeout: 6000
      }
    );

    const sectionContents = response.data?.contents?.twoColumnSearchResultsRenderer?.primaryContents?.sectionListRenderer?.contents || [];
    
    let rawVideos = [];
    for (const section of sectionContents) {
      const items = section?.itemSectionRenderer?.contents || [];
      for (const item of items) {
        if (item.videoRenderer) {
          rawVideos.push(item.videoRenderer);
        }
      }
    }

    const formattedSongs = rawVideos
      .map(video => {
        const videoId = video.videoId;
        const title = video.title?.runs?.[0]?.text || 'Unknown Title';
        const artist = video.ownerText?.runs?.[0]?.text || video.longBylineText?.runs?.[0]?.text || 'Unknown Artist';
        const durationText = video.lengthText?.simpleText || video.lengthText?.runs?.[0]?.text || '0:00';
        const durationSec = parseDurationToSeconds(durationText);

        let coverUrl = video.thumbnail?.thumbnails?.[video.thumbnail.thumbnails.length - 1]?.url || '';
        if (coverUrl.includes('i.ytimg.com')) {
          coverUrl = coverUrl.replace(/\/vi\/([^\/]+)\/.*/, '/vi/$1/maxresdefault.jpg');
        }

        return {
          id: videoId,
          title: title,
          artist: artist,
          album: null,
          duration: durationText,
          duration_seconds: durationSec,
          cover_hd: coverUrl
        };
      })
      .filter(song => song.id && song.duration_seconds > 45); // Saring lagu di atas 45 detik

    return res.status(200).json({
      success: true,
      query: query,
      total_results: formattedSongs.length,
      results: formattedSongs
    });
  } catch (error) {
    console.error('Search Catch Error:', error.message);
    return res.status(200).json({ 
      success: false, 
      error: error.message, 
      results: [] 
    });
  }
});

// 2. Endpoint Stream Audio (Multi-Fallback Stream Engine)
app.get('/api/youtube/stream', async (req, res) => {
  try {
    const videoId = req.query.id;
    if (!videoId) {
      return res.status(400).json({ success: false, message: 'Parameter id wajib diisi!' });
    }

    let streamData = null;

    // A. Coba dari Invidious Instances
    for (const instance of INVIDIOUS_INSTANCES) {
      try {
        const response = await axios.get(`${instance}/api/v1/videos/${videoId}`, {
          headers: { 'User-Agent': 'Mozilla/5.0' },
          timeout: 4000
        });

        if (response.data && response.data.adaptiveFormats) {
          const audioStreams = response.data.adaptiveFormats.filter(stream => 
            stream.type && stream.type.includes('audio') && stream.url
          );
          const bestAudio = audioStreams.sort((a, b) => (Number(b.bitrate) || 0) - (Number(a.bitrate) || 0))[0];
          if (bestAudio && bestAudio.url) {
            streamData = {
              stream_url: bestAudio.url,
              mime_type: bestAudio.type || 'audio/webm',
              bitrate: Number(bestAudio.bitrate) || 128000
            };
            break;
          }
        }
      } catch (err) {
        continue;
      }
    }

    // B. Fallback ke Piped Instances
    if (!streamData) {
      for (const instance of PIPED_INSTANCES) {
        try {
          const response = await axios.get(`${instance}/streams/${videoId}`, {
            headers: { 'User-Agent': 'Mozilla/5.0' },
            timeout: 4000
          });

          if (response.data && response.data.audioStreams) {
            const audioStreams = response.data.audioStreams.filter(stream => stream.url);
            const bestAudio = audioStreams.sort((a, b) => (b.bitrate || 0) - (a.bitrate || 0))[0];
            if (bestAudio && bestAudio.url) {
              streamData = {
                stream_url: bestAudio.url,
                mime_type: bestAudio.mimeType || 'audio/webm',
                bitrate: bestAudio.bitrate || 128000
              };
              break;
            }
          }
        } catch (err) {
          continue;
        }
      }
    }

    if (!streamData) {
      return res.status(404).json({ 
        success: false, 
        message: 'Stream audio gagal ditarik, silakan coba beberapa saat lagi.' 
      });
    }

    return res.status(200).json({
      success: true,
      id: videoId,
      stream_url: streamData.stream_url,
      mime_type: streamData.mime_type,
      bitrate: streamData.bitrate
    });
  } catch (error) {
    console.error('Stream Error:', error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// 3. Endpoint GitHub Releases
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
  return res.json({ status: 'Online', message: 'MusicValt API Fixed & Running' });
});

export default app;

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}
