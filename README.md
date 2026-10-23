# TeleSport - Jeux olympiques

Application front-end Angular permettant de consulter les médailles des pays aux Jeux olympiques et les statistiques d'un pays sélectionné.

## Fonctionnalités

- Un tableau de bord présente le nombre de pays et d'éditions des Jeux olympiques, ainsi qu'un graphique circulaire des médailles par pays.
- Un clic sur un pays ouvre sa page de détail avec ses participations, ses médailles, ses athlètes et l'évolution de ses médailles par édition.
- Une page introuvable est affichée pour les URL inconnues ou les identifiants de pays invalides.
- Des composants partagés affichent le titre et les indicateurs, le chargement et les erreurs.

## Technologies

- Angular 18 et TypeScript
- Chart.js pour les graphiques
- RxJS et `HttpClient` pour la récupération asynchrone des données
- Données de démonstration dans `src/assets/mock/olympic.json`

## Installation et démarrage

```bash
npm install
npm start
```

Ouvrir ensuite `http://localhost:4200/`.

## Commandes

```bash
npm run build
npm run lint
npm test -- --watch=false
```

## Structure du projet

```text
src/
├── app/
│   ├── components/   # Header, chargement et erreur partagés
│   ├── models/       # Interfaces Olympic, Participation et Kpi
│   ├── pages/        # Tableau de bord, détail pays et page introuvable
│   └── services/     # Accès centralisé aux données
└── assets/mock/      # Données JSON simulées
```

## Organisation des données

`DataService` centralise la lecture du fichier JSON et retourne des données typées avec l'interface `Olympic`. Les pages utilisent ce service, calculent les indicateurs propres à leur affichage et configurent leurs graphiques. Le composant `HeaderComponent` est partagé entre le tableau de bord et la page de détail.

Les données sont actuellement simulées par un fichier JSON. Pour connecter une future API, la source de données pourra être remplacée dans `DataService` sans déplacer les appels HTTP dans les pages.
