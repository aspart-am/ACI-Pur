import migrationService from './migrationService.js';

async function executerMigration() {
    try {
        // Exécuter la migration
        const resultatMigration = await migrationService.migrerProfessionnels();
        
        if (resultatMigration.success) {
            // Vérifier la cohérence des données
            await migrationService.verifierDonnees();
        }

        // Afficher un résumé dans la console
        console.log('\n=== Résumé de la migration ===');
        console.log(`Total traité: ${resultatMigration.stats.total}`);
        console.log(`Succès: ${resultatMigration.stats.succes}`);
        console.log(`Échecs: ${resultatMigration.stats.echecs}`);
        
        // Sauvegarder les logs dans un fichier si nécessaire
        // TODO: Implémenter la sauvegarde des logs

    } catch (error) {
        console.error('Erreur lors de la migration:', error);
    }
}

// Exécuter la migration au chargement
document.addEventListener('DOMContentLoaded', executerMigration); 