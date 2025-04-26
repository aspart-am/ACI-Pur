import { CONFIG } from '../config/config.js';

class DataService {
    constructor() {
        this.data = null;
        this.lastFetch = null;
        this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
    }

    async loadData(forceRefresh = false) {
        try {
            // Vérifier le cache
            if (!forceRefresh && this.data && this.lastFetch && 
                (Date.now() - this.lastFetch) < this.cacheTimeout) {
                return this.data;
            }

            const response = await fetch(CONFIG.API.ENDPOINTS.LOAD_DATA);
            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }

            this.data = await response.json();
            this.lastFetch = Date.now();
            return this.data;

        } catch (error) {
            console.error('Erreur lors du chargement des données:', error);
            throw new Error('Impossible de charger les données');
        }
    }

    async saveData() {
        if (!this.data) {
            throw new Error('Aucune donnée à sauvegarder');
        }

        try {
            const response = await fetch(CONFIG.API.ENDPOINTS.SAVE_DATA, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.data)
            });

            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }

            const result = await response.json();
            if (!result.success) {
                throw new Error('Échec de la sauvegarde');
            }

            return result;

        } catch (error) {
            console.error('Erreur lors de la sauvegarde:', error);
            throw new Error('Impossible de sauvegarder les données');
        }
    }

    async updateData(path, value) {
        if (!this.data) {
            await this.loadData();
        }

        try {
            // Mettre à jour la donnée spécifique
            let target = this.data;
            const parts = path.split('.');
            const lastPart = parts.pop();

            for (const part of parts) {
                if (!(part in target)) {
                    target[part] = {};
                }
                target = target[part];
            }

            target[lastPart] = value;

            // Sauvegarder les modifications
            await this.saveData();

        } catch (error) {
            console.error(`Erreur lors de la mise à jour de ${path}:`, error);
            throw new Error('Impossible de mettre à jour les données');
        }
    }

    getData() {
        if (!this.data) {
            throw new Error('Les données ne sont pas chargées');
        }
        return this.data;
    }

    clearCache() {
        this.data = null;
        this.lastFetch = null;
    }
}

export default new DataService(); 