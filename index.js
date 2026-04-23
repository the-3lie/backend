const express = require('express');
const cors = require('cors');
const pool = require('./config/db');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// --- 1. ROUTE DE TEST (Pour éviter l'erreur 404 sur https://backend-q4gx.onrender.com/) ---
app.get('/', (req, res) => {
    res.send("🚀 Serveur SmartTrash en ligne et opérationnel !");
});

// --- 2. ROUTES POUR L'ARDUINO (ESP32) ---

// Route pour recevoir le niveau de la poubelle (Ultrason)
app.post('/api/poubelle/niveau', async (req, res) => {
    const { id_poubelle, niveau } = req.body;

    // Vérification simple des données reçues
    if (!id_poubelle || niveau === undefined) {
        return res.status(400).json({ error: "Données manquantes (id_poubelle ou niveau)" });
    }

    try {
        const query = `
            INSERT INTO mesures (id_poubelle, niveau, date_mesure) 
            VALUES ($1, $2, NOW()) 
            RETURNING *`;
        const values = [id_poubelle, niveau];
        const result = await pool.query(query, values);
        
        console.log(`Donnée reçue de la poubelle ${id_poubelle}: ${niveau}%`);
        res.status(201).json({ message: "Donnée enregistrée", data: result.rows[0] });
    } catch (err) {
        console.error("Erreur d'insertion:", err.message);
        res.status(500).send("Erreur serveur lors de l'ajout");
    }
});

// --- 3. ROUTES POUR LE FRONTEND (REACT) ---

// Récupérer toutes les poubelles
app.get('/api/poubelles', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM poubelles ORDER BY id ASC');
        res.json(result.rows);
    } catch (err) {
        console.error("Erreur de récupération:", err.message);
        res.status(500).send("Erreur serveur lors de la récupération");
    }
});

// --- LANCEMENT DU SERVEUR ---
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`✅ Serveur en ligne sur le port ${PORT}`);
});