const express = require('express');
const fs = require('fs').promises;
const app = express();
const port = 3000;
const os = require('os');

// Fonction pour obtenir l'adresse IP locale
function getLocalIP() {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            // Ignorer les interfaces non IPv4 et les interfaces loopback
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return '0.0.0.0';
}

// Middleware pour parser le JSON
app.use(express.json());

// Middleware de logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Servir les fichiers statiques
app.use(express.static('.'));

// Middleware pour gérer les modules ES6
app.use((req, res, next) => {
    if (req.url.endsWith('.js')) {
        res.setHeader('Content-Type', 'application/javascript');
    }
    next();
});

// Route pour sauvegarder les données
app.post('/api/saveData', async (req, res) => {
    console.log('Réception d\'une requête de sauvegarde');
    try {
        const data = JSON.stringify(req.body, null, 4);
        console.log('Sauvegarde des données:', data);
        await fs.writeFile('data.json', data);
        console.log('Données sauvegardées avec succès');
        res.json({ success: true });
    } catch (error) {
        console.error('Erreur lors de la sauvegarde:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Démarrer le serveur sur toutes les interfaces
const localIP = getLocalIP();
app.listen(port, '0.0.0.0', () => {
    console.log(`Serveur démarré sur:`);
    console.log(`- Local: http://localhost:${port}`);
    console.log(`- Réseau: http://${localIP}:${port}`);
    console.log('\nPour accéder depuis un autre ordinateur, utilisez l\'adresse Réseau');
}); 