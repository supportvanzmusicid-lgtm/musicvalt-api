const express = require('express');
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();
app.use(express.json());

// Inisialisasi Spotify API Client dengan kredensial dari Developer Dashboard
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

// Middleware untuk mendapatkan Access Token secara otomatis
async function getSpotifyToken(req, res, next) {
  try {
    const data = await spotifyApi.clientCredentialsGrant();
    spotifyApi.setAccessToken(data.body['access_token']);
    next();
  } catch (err) {
    res.status(500).json({ error: 'Gagal melakukan autentikasi dengan Spotify API', details: err.message });
  }
}

// Endpoint untuk mencari lagu dan mendapatkan detail serta preview-nya
app.get('/api/song', getSpotifyToken, async (req, res) => {
  const query = req.query.q;
  if (!query) {
    return res.status(400).json({ error: 'Parameter query "q" wajib diisi.' });
  }

  try {
    const searchResult = await spotifyApi.searchTracks(query, { limit: 1 });
    const tracks = searchResult.body.tracks.items;

    if (tracks.length === 0) {
      return res.status(404).json({ error: 'Lagu tidak ditemukan.' });
    }

    const track = tracks[0];

    res.json({
      name: track.name,
      artist: track.artists.map(artist => artist.name).join(', '),
      album: track.album.name,
      release_date: track.album.release_date,
      duration_ms: track.duration_ms,
      preview_url: track.preview_url, // URL preview 30 detik (bisa null jika tidak tersedia)
      external_url: track.external_urls.spotify, // Link resmi untuk memutar full track di aplikasi Spotify
      album_art: track.album.images[0]?.url || null
    });
  } catch (err) {
    res.status(500).json({ error: 'Terjadi kesalahan saat mengambil data', details: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});
