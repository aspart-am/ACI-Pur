// Service de gestion des professionnels
let professionnels = [];

// Charger les données des professionnels depuis le localStorage ou le fichier JSON
async function chargerProfessionnels() {
    try {
        // D'abord essayer de charger depuis le localStorage
        const dataFromStorage = getData('professionnels');
        if (dataFromStorage) {
            professionnels = dataFromStorage;
            return professionnels;
        }

        // Si pas de données dans le localStorage, charger depuis le fichier JSON
        const response = await fetch('../professionnels_sante.json');
        if (!response.ok) {
            throw new Error('Erreur lors du chargement des professionnels');
        }
        professionnels = await response.json();
        
        // Sauvegarder dans le localStorage
        saveData('professionnels', professionnels);
        return professionnels;
    } catch (error) {
        console.error('Erreur:', error);
        return [];
    }
}

// Obtenir la liste complète des professionnels
function getProfessionnels() {
    return professionnels;
}

// Rechercher un professionnel par son nom
function rechercherProfessionnel(nom) {
    return professionnels.find(p => p.Nom === nom);
}

// Filtrer les professionnels par profession
function filtrerParProfession(profession) {
    return professionnels.filter(p => p.Profession === profession);
}

// Obtenir la liste des professions uniques
function getProfessions() {
    return [...new Set(professionnels.map(p => p.Profession))];
}

// Initialisation au chargement
document.addEventListener('DOMContentLoaded', async () => {
    await chargerProfessionnels();
    // Déclencher un événement personnalisé pour indiquer que les données sont chargées
    document.dispatchEvent(new Event('professionnelsLoaded'));
});

// Exporter les fonctions nécessaires
window.professionnels = professionnels;
window.getProfessionnels = getProfessionnels;
window.rechercherProfessionnel = rechercherProfessionnel;
window.filtrerParProfession = filtrerParProfession;
window.getProfessions = getProfessions; 