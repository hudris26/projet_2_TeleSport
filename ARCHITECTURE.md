# Architecture front-end

## Vue d'ensemble

L'application est construite avec Angular 18. Elle présente un tableau de bord des médailles olympiques et une page de détail par pays. Les données sont actuellement simulées par un fichier JSON, récupéré au moyen d'un service Angular.

## Arborescence

```text
src/
├── app/
│   ├── app-routing.module.ts
│   ├── app.module.ts
│   ├── components/
│   │   ├── error/
│   │   ├── header/
│   │   └── loading/
│   ├── models/
│   │   ├── kpi.ts
│   │   ├── olympic.ts
│   │   └── participation.ts
│   ├── pages/
│   │   ├── country/
│   │   ├── home/
│   │   └── not-found/
│   └── services/
│       └── data.service.ts
└── assets/
    └── mock/
        └── olympic.json
```

## Responsabilités

- `app-routing.module.ts` associe `/` au tableau de bord, `/country/:id` à la page de détail, et les URL inconnues à la page introuvable.
- `app.module.ts` configure le routeur et `HttpClient`, déclare les pages et importe les composants d'interface standalone.
- `pages/home` récupère les données via `DataService`, calcule les indicateurs du tableau de bord, prépare le graphique circulaire et navigue vers `/country/:id` lors d'un clic sur un pays.
- `pages/country` lit l'ID dans la route, récupère les pays via `DataService`, sélectionne le pays correspondant, calcule ses indicateurs et prépare le graphique d'évolution. Si l'ID ne correspond à aucun pays, la page redirige vers `/not-found`.
- `components/header` affiche un titre et une liste d'indicateurs reçus par inputs. `components/loading` présente l'état de chargement et `components/error` présente un message avec un lien de retour.
- `pages/not-found` affiche la page de repli pour les URL inconnues et réutilise `ErrorComponent`.
- `services/data.service.ts` centralise l'accès aux données et retourne un `Observable<Olympic[]>`.
- `models` définit les formes TypeScript des pays, participations et indicateurs.

## Flux des données

Les pages appellent `DataService.getOlympics()`. Le service utilise `HttpClient` pour récupérer `assets/mock/olympic.json` et expose une réponse typée `Olympic[]`. Chaque page prépare ensuite les valeurs nécessaires à ses KPI et à son graphique. Le header partagé ne récupère pas les données : il affiche uniquement les valeurs fournies par la page.

Les requêtes HTTP sont ponctuelles et se terminent après la réponse. La page détail lit l'ID avec le snapshot de `ActivatedRoute`, sans abonnement permanent aux paramètres.

## Évolution vers une API

Le JSON est une source de démonstration. Le remplacement par une API REST pourra être concentré dans `DataService`, en conservant les interfaces `Olympic` et `Participation`. Les pages continueront à dépendre du service plutôt que de connaître directement l'URL ou le mécanisme de récupération.

## Limites actuelles

Les pages réalisent encore les calculs d'agrégation et construisent directement les graphiques Chart.js. Ce choix garde la coordination de l'affichage dans les pages; une évolution ultérieure pourrait extraire ces éléments si une nouvelle duplication apparaît. Les données ne sont pas modifiables et aucune persistance serveur n'est prévue dans ce périmètre.
