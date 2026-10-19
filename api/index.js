const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

// Endpoint utama untuk tes
app.get('/', (req, res) => {
  res.json({ message: 'YouTube Music API (Search + Play) Aktif!' });
});

// 1. ENDPOINT PENCARIAN LAGU (SEARCH)
app.get('/api/search', async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) {
      return res.status(400).json({ error: 'Parameter "q" wajib diisi' });
    }

    const response = await axios.post('https://music.youtube.com/youtubei/v1/search?prettyPrint=false', {
      context: {
        client: {
          clientName: 'WEB_REMIX',
          clientVersion: '1.20240405.01.00',
          hl: 'id',
          gl: 'ID'
        }
      },
      query: query,
      params: 'EgWKAQIIAWoKEAkQBRAKEAMQBA==' // Filter lagu resmi YouTube Music
    }, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Origin': 'https://music.youtube.com',
        'Referer': 'https://music.youtube.com/'
      }
    });

    const sections = response.data?.contents?.tabbedSearchResultsRenderer?.tabs?.[0]?.tabRenderer?.content?.sectionListRenderer?.contents || [];
    
    let rawSongs = [];
    for (const section of sections) {
      const musicShelf = section.musicShelfRenderer || section.musicCardShelfRenderer;
      if (musicShelf && musicShelf.contents) {
        rawSongs = musicShelf.contents;
        break;
      }
    }

    const formattedSongs = rawSongs.map(item => {
      const renderer = item.musicResponsiveListItemRenderer;
      if (!renderer) return null;

      try {
        const videoId = renderer.playlistItemData?.videoId || renderer.flexColumns[0]?.musicResponsiveListItemFlexColumnRenderer?.text?.runs[0]?.navigationEndpoint?.watchEndpoint?.videoId;
        
        const title = renderer.flexColumns[0]?.musicResponsiveListItemFlexColumnRenderer?.text?.runs[0]?.text || 'Unknown Title';

        const secondaryRuns = renderer.flexColumns[1]?.musicResponsiveListItemFlexColumnRenderer?.text?.runs || [];
        let artist = 'Unknown Artist';
        let album = null;

        if (secondaryRuns.length > 0) {
          artist = secondaryRuns[0].text;
          if (secondaryRuns.length > 2) {
            album = secondaryRuns[2].text;
          }
        }

        // Ambil & paksa Thumbnail ke resolusi HD (w1080-h1080)
        let thumbnails = renderer.thumbnail?.musicThumbnailRenderer?.thumbnail?.thumbnails || [];
        thumbnails = thumbnails.map(thumb => {
          if (thumb.url) {
            thumb.url = thumb.url.replace(/=w\d+.*?(-l\d+)?(-rj)?$/, '=w1080-h1080-l90-rj');
          }
          return thumb;
        });

        const duration = renderer.fixedColumns?.[0]?.musicResponsiveListItemFixedColumnRenderer?.text?.runs[0]?.text || '0:00';

        if (!videoId) return null;

        return {
          id: videoId,
          title: title,
          artist: artist,
          album: album,
          duration: duration,
          thumbnail: thumbnails
        };
      } catch (err) {
        return null;
      }
    }).filter(Boolean);

    res.json({
      success: true,
      total: formattedSongs.length,
      results: formattedSongs
    });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 2. ENDPOINT PEMUTAR LAGU (PLAY / STREAM)
app.get('/api/play', async (req, res) => {
  try {
    const videoId = req.query.id;
    if (!videoId) {
      return res.status(400).json({ error: 'Parameter "id" (videoId) wajib diisi' });
    }

    const response = await axios.post('https://youtubei.googleapis.com/youtubei/v1/player', {
      context: {
        client: {
          clientName: 'WEB_REMIX',
          clientVersion: '1.20240405.01.00',
          hl: 'id',
          gl: 'ID'
        }
      },
      videoId: videoId
    }, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Origin': 'https://music.youtube.com',
        'Referer': 'https://music.youtube.com/'
      }
    });

    const playerData = response.data;
    const details = playerData.videoDetails;
    const streamingData = playerData.streamingData;

    if (!streamingData) {
      return res.status(403).json({ 
        success: false, 
        error: 'Data stream tidak tersedia atau dibatasi.' 
      });
    }

    // Filter khusus format audio
    const audioFormats = streamingData.adaptiveFormats?.filter(f => f.mimeType && f.mimeType.includes('audio')) || [];
    const bestAudio = audioFormats[0] || {};

    res.json({
      success: true,
      id: details?.videoId || videoId,
      title: details?.title,
      artist: details?.author,
      durationSeconds: details?.lengthSeconds,
      audioUrl: bestAudio.url || streamingData.formats?.[0]?.url || null
    });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = app;
