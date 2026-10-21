const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();

app.use(cors());
app.use(express.json());

const CLOUDFLARE_TUNNEL_URL = process.env.TUNNEL_URL;

app.get('/api/songs', (req, res) => {
    try {
        // 1. Baca file songs.json yang isinya jutaan baris itu
        const filePath = path.join(process.cwd(), 'songs.json');
        let rawData = fs.readFileSync(filePath, 'utf-8');

        // 2. Trik Ajaib: Hapus teks "const songs =" di bagian depan secara otomatis lewat program
        rawData = rawData.replace(/^\s*const\s+songs\s*=\s*/, '');
        
        // Hapus titik koma (;) di paling akhir jika ada
        rawData = rawData.trim().replace(/;\$/, '');

        // 3. Ubah teksnya menjadi data JSON resmi
        const songs = JSON.parse(rawData);

        if (!CLOUDFLARE_TUNNEL_URL) {
            return res.status(500).json({ error: "Variabel TUNNEL_URL di Vercel belum diisi!" });
        }

        // 4. Trik Ajaib Kedua: Otomatis potong link lama yang mati dan ganti dengan link Cloudflare baru Anda
        const updatedSongs = songs.map(song => {
            let finalUrl = song.url;
            
            if (song.url && song.url.includes('://')) {
                // Mengambil nama file .mp3 nya saja dari link lama
                const parts = song.url.split('://');
                const fileName = parts[1]; 
                
                // Gabungkan dengan link Cloudflare Tunnel baru Anda yang sedang aktif
                finalUrl = `${CLOUDFLARE_TUNNEL_URL}/${fileName}`;
            }

            return {
                id: song.id,
                title: song.title,
                artist: song.artist,
                url: finalUrl
            };
        });

        res.json(updatedSongs);
    } catch (error) {
        res.status(500).json({ error: "Gagal memproses data jutaan baris", details: error.message });
    }
});

module.exports = app;
