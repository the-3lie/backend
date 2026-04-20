const express = require('express');
const route = require('./route/route');
require('dotenv').config();

const app = express();

// Middleware pour lire le JSON envoyé par l'ESP32
app.use(express.json());

// Utilisation des routes
app.use('/api/bins', route);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});