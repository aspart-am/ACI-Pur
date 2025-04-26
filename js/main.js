document.addEventListener('DOMContentLoaded', function() {
    // Initialisation de la date
    const currentYear = new Date().getFullYear();
    document.querySelectorAll('.year-label').forEach(element => {
        if (element.textContent.includes('Année')) {
            element.textContent = `Année ${currentYear}`;
        }
    });

    // Initialisation des menus actifs
    initActiveMenu();

    // Initialisation des graphiques si nous sommes sur la page d'accueil
    if (document.getElementById('profession-chart')) {
        initProfessionChart();
    }

    // Initialisation des modales
    initModals();
});

// Fonction pour initialiser le menu actif
function initActiveMenu() {
    const currentPage = window.location.pathname;
    document.querySelectorAll('nav ul li').forEach(item => {
        const linkHref = item.querySelector('a').getAttribute('href');
        if (currentPage.includes(linkHref)) {
            item.classList.add('active');
        } else if (currentPage.endsWith('/') && linkHref === 'index.html') {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

// Fonction pour initialiser les graphiques
function initProfessionChart() {
    // Charge les données des professionnels s'ils sont disponibles
    if (typeof professionnels !== 'undefined') {
        // Compte le nombre de professionnels par profession
        const professions = {};
        professionnels.forEach(pro => {
            if (pro.Profession) {
                professions[pro.Profession] = (professions[pro.Profession] || 0) + 1;
            }
        });

        // Prépare les données pour le graphique
        const labels = Object.keys(professions);
        const data = Object.values(professions);
        const colors = generateColors(labels.length);

        // Crée le graphique
        const ctx = document.getElementById('profession-chart');
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: colors,
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                    }
                }
            }
        });
    } else {
        // Si les données des professionnels ne sont pas disponibles
        document.getElementById('profession-chart').innerHTML = '<p class="no-data">Aucune donnée disponible</p>';
    }
}

// Fonction pour générer des couleurs aléatoires
function generateColors(count) {
    const predefinedColors = [
        '#3498db', '#2ecc71', '#e74c3c', '#f39c12', '#9b59b6',
        '#1abc9c', '#d35400', '#34495e', '#16a085', '#c0392b'
    ];

    // Si nous avons assez de couleurs prédéfinies, utilise-les
    if (count <= predefinedColors.length) {
        return predefinedColors.slice(0, count);
    }

    // Sinon, génère des couleurs aléatoires
    const colors = [...predefinedColors];
    for (let i = predefinedColors.length; i < count; i++) {
        const r = Math.floor(Math.random() * 200);
        const g = Math.floor(Math.random() * 200);
        const b = Math.floor(Math.random() * 200);
        colors.push(`rgb(${r}, ${g}, ${b})`);
    }
    return colors;
}

// Gestion des modales
function initModals() {
    // Ouvrir les modales
    document.querySelectorAll('[data-toggle="modal"]').forEach(button => {
        button.addEventListener('click', function() {
            const target = document.querySelector(this.getAttribute('data-target'));
            if (target) {
                target.classList.add('show');
            }
        });
    });

    // Fermer les modales
    document.querySelectorAll('.modal-close').forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                modal.classList.remove('show');
            }
        });
    });

    // Fermer les modales en cliquant en dehors
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('show');
            }
        });
    });
}

// Fonctions utilitaires pour le formatage des données
function formatMontant(montant) {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(montant);
}

function formatDate(date) {
    return new Date(date).toLocaleDateString('fr-FR');
}

// Fonction de sauvegarde des données dans le stockage local
function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

// Fonction de récupération des données depuis le stockage local
function getData(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
}

// Fonction pour afficher les alertes
function showAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;

    // Ajoute l'alerte au début du contenu principal
    const mainContent = document.querySelector('.main-content');
    mainContent.insertBefore(alertDiv, mainContent.firstChild);

    // Supprime l'alerte après 3 secondes
    setTimeout(() => {
        alertDiv.remove();
    }, 3000);
}

// Fonction pour confirmer une action
function confirmAction(message, callback) {
    if (confirm(message)) {
        callback();
    }
} 