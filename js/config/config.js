export const CONFIG = {
    VERSION: '1.0',
    API: {
        BASE_URL: '',
        ENDPOINTS: {
            SAVE_DATA: '/api/saveData',
            LOAD_DATA: '/data.json',
            LOAD_PROFESSIONNELS: '/professionnels_sante.json'
        }
    },
    PROFESSIONS: {
        MEDECIN: 'Médecin',
        PHARMACIEN: 'Pharmacien',
        INFIRMIERE: 'Infirmière',
        KINESITHERAPEUTE: 'Kinésithérapeute',
        DENTISTE: 'Dentiste',
        PODOLOGUE: 'Pédicure podologue'
    },
    PREFIXES: {
        MEDECIN: 'med',
        PHARMACIEN: 'pha',
        INFIRMIERE: 'inf',
        KINESITHERAPEUTE: 'kin',
        DENTISTE: 'den',
        PODOLOGUE: 'pod',
        AUTRE: 'aut'
    },
    POIDS_PROJETS: {
        STANDARD: 1,
        PRIORITAIRE: 2,
        STRATEGIQUE: 3
    },
    STATUTS: {
        ASSOCIE: 'Associé',
        COGERANT: 'Cogérant'
    }
}; 