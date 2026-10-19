const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'YouTube Music API (YTMusic Style) Aktif!' });
});

app.get('/api/search', async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) {
      return res.status(400).json({ error: 'Parameter "q" wajib diisi' });
    }

    // Menggunakan endpoint internal YouTube Music (mirip cara kerja ytmusicapi)
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
      params: 'EgWKAQIIAWoKEAkQBRAKEAMQBA==' // Filter khusus SONGS/Lagu resmi dari YouTube Music
    }, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Origin': 'https://music.youtube.com',
        'Referer': 'https://music.youtube.com/'
      }
    });

    // Parsing struktur data YouTube Music
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
        
        // Judul Lagu
        const title = renderer.flexColumns[0]?.musicResponsiveListItemFlexColumnRenderer?.text?.runs[0]?.text || 'Unknown Title';

        // Artist & Album (Biasanya ada di kolom fleksibel kedua)
        const secondaryRuns = renderer.flexColumns[1]?.musicResponsiveListItemFlexColumnRenderer?.text?.runs || [];
        let artist = 'Unknown Artist';
        let album = null;

        if (secondaryRuns.length > 0) {
          artist = secondaryRuns[0].text;
          if (secondaryRuns.length > 2) {
            album = secondaryRuns[2].text;
          }
        }

        // Thumbnail / Cover
        const thumbnails = renderer.thumbnail?.musicThumbnailRenderer?.thumbnail?.thumbnails || [];

        // Durasi
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

module.exports = app;
