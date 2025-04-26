import { CONFIG } from '../config/config.js';
import associeService from '../services/AssocieService.js';
import dataService from '../services/DataService.js';

class MigrationService {
    constructor() {
        this.logs = [];
    }

    log(message, type = 'info') {
        const log = `[${new Date().toISOString()}] ${type.toUpperCase()}: ${message}`;
        this.logs.push(log);
        console.log(log);
    }

    async migrerProfessionnels() {
        try {
            this.log('Début de la migration des professionnels');
            
            // Charger les données existantes
            const response = await fetch(CONFIG.API.ENDPOINTS.LOAD_PROFESSIONNELS);
            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }
            
            const professionnels = await response.json();
            this.log(`${professionnels.length} professionnels trouvés`);

            // Statistiques de migration
            const stats = {
                total: professionnels.length,
                succes: 0,
                echecs: 0,
                parProfession: {}
            };

            // Migrer chaque professionnel
            for (const professionnel of professionnels) {
                try {
                    this.log(`Migration de ${professionnel.Nom}...`);
                    
                    const nouvelAssocie = {
                        nom: professionnel.Nom,
                        profession: professionnel.Profession,
                        email: professionnel.Email,
                        telephone: professionnel.Téléphone,
                        statut: professionnel.Statut,
                        date_adhesion: "2020-01-01"
                    };

                    const associeAjoute = await associeService.ajouterAssocie(nouvelAssocie);
                    
                    // Mettre à jour les statistiques
                    stats.succes++;
                    if (!stats.parProfession[professionnel.Profession]) {
                        stats.parProfession[professionnel.Profession] = 0;
                    }
                    stats.parProfession[professionnel.Profession]++;

                    this.log(`✓ ${professionnel.Nom} migré avec succès (ID: ${associeAjoute.id})`);

                } catch (error) {
                    stats.echecs++;
                    this.log(`Erreur lors de la migration de ${professionnel.Nom}: ${error.message}`, 'error');
                }
            }

            // Rapport final
            this.log('Migration terminée. Rapport:');
            this.log(`Total traité: ${stats.total}`);
            this.log(`Succès: ${stats.succes}`);
            this.log(`Échecs: ${stats.echecs}`);
            this.log('Répartition par profession:');
            for (const [profession, nombre] of Object.entries(stats.parProfession)) {
                this.log(`  - ${profession}: ${nombre}`);
            }

            return {
                success: stats.echecs === 0,
                stats,
                logs: this.logs
            };

        } catch (error) {
            this.log(`Erreur critique lors de la migration: ${error.message}`, 'error');
            throw error;
        }
    }

    async verifierDonnees() {
        try {
            const data = await dataService.loadData(true);
            
            this.log('Vérification des données migrées:');
            this.log(`Nombre total d'associés: ${data.associes.liste.length}`);
            
            // Vérifier la cohérence des listes par profession
            for (const [profession, membres] of Object.entries(data.associes.par_profession)) {
                const nombreListePrincipale = data.associes.liste.filter(
                    a => this.getProfessionKey(a.profession) === profession
                ).length;
                
                if (membres.length !== nombreListePrincipale) {
                    this.log(`Incohérence détectée pour ${profession}:`, 'warning');
                    this.log(`  Liste principale: ${nombreListePrincipale}`, 'warning');
                    this.log(`  Liste par profession: ${membres.length}`, 'warning');
                }
            }

            // Vérifier l'initialisation des statistiques
            for (const associe of data.associes.liste) {
                if (!data.statistiques.temps_reunion.par_associe[associe.id]) {
                    this.log(`Statistiques de temps manquantes pour ${associe.nom}`, 'warning');
                }
                if (!data.statistiques.implication_projets.par_associe[associe.id]) {
                    this.log(`Statistiques d'implication manquantes pour ${associe.nom}`, 'warning');
                }
            }

        } catch (error) {
            this.log(`Erreur lors de la vérification: ${error.message}`, 'error');
            throw error;
        }
    }

    getProfessionKey(profession) {
        return Object.entries(CONFIG.PROFESSIONS)
            .find(([_, value]) => value === profession)?.[0]?.toLowerCase() + 's' || 'autres';
    }
}

export default new MigrationService(); 