const songs = require('./api/songs.js');

module.exports = (req, res) => {
    // Header CORS supaya bisa diakses aplikasi Android
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    
    res.status(200).json(songs);
};
