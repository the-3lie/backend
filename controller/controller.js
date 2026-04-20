const db = require ('../config/db');

exports.collectData = async (req, res) => {
    const { rfid, distance } = req.body;

    // Validation des données reçues de l'ESP32
    if (!rfid || distance === undefined) {
        return res.status(400).json({ error: "Données invalides" });
    }

    try {
        // 1. On cherche la capacité max de cette poubelle (ex: 100cm)
        const [bin] = await db.query("SELECT capacite_max_cm FROM bins WHERE rfid_tag = ?", [rfid]);

        if (bin.length === 0) {
            return res.status(404).json({ error: "Poubelle non enregistrée" });
        }

        const maxDist = bin[0].capacite_max_cm;
        
        // 2. Calcul du pourcentage de remplissage
        // Plus la distance est petite, plus la poubelle est pleine
        let pourcentage = Math.round(((maxDist - distance) / maxDist) * 100);
        if (pourcentage < 0) pourcentage = 0;
        if (pourcentage > 100) pourcentage = 100;

        // 3. Sauvegarde dans l'historique (bin_logs)
        await db.query(
            "INSERT INTO bin_logs (rfid_tag, niveau_pourcentage) VALUES (?, ?)", 
            [rfid, pourcentage]
        );

        console.log(`Poubelle ${rfid} : ${pourcentage}% plein`);
        
        res.status(201).json({ 
            success: true, 
            niveau: pourcentage 
        });

    } catch (err) {
    console.error("Détail de l'erreur SQL :", err); // AJOUTE CETTE LIGNE
    res.status(500).json({ error: "Erreur base de données", message: err.message });
    }
};