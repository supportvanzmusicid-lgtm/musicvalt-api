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

// Helper parsing durasi detik ke format "MM:SS"
function formatSecondsToDuration(seconds) {
  if (!seconds) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// Helper untuk mengubah text durasi "3:45" ke detik
function parseDurationToSeconds(durationText) {
  if (!durationText) return 0;
  const parts = durationText.split(':').map(Number);
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  return 0;
}

// 1. Endpoint Search Unlimited (Scraper Mobile YouTube InnerTube - Tanpa API Key & Tanpa Limit)
app.get('/api/youtube/search', async (req, res) => {
  try {
    const query = req.query.q || 'Official Release';

    // Direct Request ke InnerTube Mobile Search API milik YouTube
    const response = await axios.post(
      'https://www.youtube.com/youtubei/v1/search?prettyPrint=false',
      {
        context: {
          client: {
            clientName: 'MWEB',
            clientVersion: '2.20231201.00.00',
            hl: 'id',
            gl: 'ID'
          }
        },
        query: query
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1'
        },
        timeout: 5000
      }
    );

    const contents = response.data?.contents?.tabbedSearchResultsRenderer?.tabs?.[0]?.tabRenderer?.content?.sectionListRenderer?.contents || [];
    
    let rawVideos = [];
    for (const section of contents) {
      const items = section?.itemSectionRenderer?.contents || [];
      for (const item of items) {
        if (item.compactVideoRenderer) {
          rawVideos.push(item.compactVideoRenderer);
        } else if (item.videoRenderer) {
          rawVideos.push(item.videoRenderer);
        }
      }
    }

    const formattedSongs = rawVideos
      .map(video => {
        const videoId = video.videoId;
        const title = video.title?.runs?.[0]?.text || video.title?.simpleText || 'Unknown Title';
        const artist = video.longBylineText?.runs?.[0]?.text || video.shortBylineText?.runs?.[0]?.text || 'Unknown Artist';
        const durationText = video.lengthText?.runs?.[0]?.text || video.lengthText?.simpleText || '0:00';
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
      .filter(song => song.id && song.duration_seconds > 45); // Filter shorts / preview < 45s

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
  return res.json({ status: 'Online', message: 'MusicValt API Unlimited Engine Running' });
});

export default app;

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}
