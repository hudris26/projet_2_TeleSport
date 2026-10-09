# Notes de qualité et d’architecture

J’ai identifié plusieurs défauts d’architecture et pratiques Angular à améliorer. Ils peuvent compliquer la maintenance et la lisibilité du projet.

## Analyse

### 1. Récupération des données répétée

Les données sont stockées dans le fichier JSON `olympic.json`. L’URL de ce fichier et la requête HTTP sont définies directement dans `HomeComponent` et `CountryComponent`, au lieu d’être centralisées dans un service.

- `home.component.ts`, ligne 12 : URL du fichier JSON
- `country.component.ts`, ligne 13 : même URL
- `home.component.ts`, ligne 22 : requête HTTP
- `country.component.ts`, ligne 27 : même requête

**Risque :** si la source change ou si une autre page doit utiliser ces données, il faudra modifier ou répéter cette logique. Cela complique la maintenance et s’éloigne du principe DRY (« Don’t Repeat Yourself »).

### 2. Manque de typage

Les réponses HTTP et plusieurs valeurs sont typées avec `any`.

**Risque :** l’un des intérêts de TypeScript est de décrire les données et de détecter certaines erreurs avant l’exécution. L’usage de `any` réduit ces vérifications et rend le code plus fragile et plus difficile à comprendre.

**Exemples :**

- `home.component.ts`, ligne 22 : la réponse HTTP est typée `any[]`.
- `home.component.ts`, lignes 26 à 30 : les éléments des calculs sont aussi typés `any`.
- `country.component.ts`, lignes 27 et 30 à 38 : `any` est utilisé pour la réponse et plusieurs valeurs manipulées.

### 3. Trop de responsabilités dans les composants

Les composants chargent les données, calculent les statistiques et les transforment pour l’affichage. Ils construisent également les graphiques.

**Risque :** les composants cumulent plusieurs rôles, ce qui les rend plus difficiles à lire et à tester. Les deux pages ont aussi une structure proche pour présenter leurs statistiques.

**Exemples :**

- `home.component.ts`, lignes 22 à 31 : chargement des données, calcul des statistiques et préparation des données du graphique.
- `home.component.ts`, lignes 41 à 42 : création directe du graphique Chart.js.
- `country.component.ts`, lignes 27 à 39 : chargement des données, recherche du pays et calcul des statistiques.
- `country.component.ts`, lignes 48 à 49 : création directe du graphique Chart.js.

### 4. Gestion des observables à clarifier

Une requête HTTP demande les données et `subscribe()` dit quoi faire quand elles arrivent. `pipe()` sert à transformer les données avant de les recevoir, mais ici il est vide, donc il ne sert à rien.

**Exemples :**

- `home.component.ts`, ligne 22 : `pipe()` est appelé sans opérateur avant `subscribe()`.
- `country.component.ts`, ligne 27 : même appel vide sur la requête HTTP.

### 5. États d’interface et cas limites

Aucun état de chargement n’est affiché pendant la récupération des données. De plus, si le pays indiqué dans l’URL n’existe pas, aucun comportement adapté n’est prévu.

**Exemples :**

- `country.component.ts`, ligne 30 : `find()` peut ne trouver aucun pays.
- `country.component.ts`, ligne 31 : `selectedCountry.country` est utilisé sans vérifier que le pays a été trouvé.
- `home.component.html`, lignes 1 à 17, et `country.component.html`, lignes 1 à 26 : les templates affichent les statistiques et les graphiques, mais ne contiennent pas d’affichage conditionnel de chargement ou d’erreur.
- `app-routing.module.ts`, lignes 12 à 14 : la route accepte un `countryName`, mais la validation de ce nom doit être faite par la page ou le service.

### 6. Lisibilité et nettoyage

- Certains noms de variables, comme `i`, `f` ou `data`, ne décrivent pas assez précisément leur contenu.
- La page d’accueil contient des `console.log` de diagnostic.
- Les composants regroupent plusieurs responsabilités, ce qui rend leur lecture plus difficile.
- La commande `ng lint` signale 26 erreurs dans le projet, notamment des usages de `any` et des annotations de type explicites alors que TypeScript peut les déduire.

**Exemples :**

- `home.component.ts`, lignes 26 à 30 : noms courts comme `i` et `f` dans des transformations imbriquées.
- `home.component.ts`, lignes 24 et 35 : traces `console.log`.
- `home.component.ts`, ligne 14, et `country.component.ts`, ligne 16 : types explicites que le lint indique comme inférables à partir de la valeur initiale.

### 7. Structure HTML et accessibilité

Les templates utilisent des `div` génériques pour plusieurs éléments. Des balises sémantiques adaptées, notamment pour les titres, rendraient la structure plus claire et amélioreraient l’accessibilité.

**Exemples :**

- `home.component.html`, ligne 6 : le titre dynamique `titlePage` est placé dans une `div`.
- `country.component.html`, ligne 4 : même cas pour le titre du pays.
- `home.component.html`, lignes 8 à 16, et `country.component.html`, lignes 6 à 18 : les statistiques sont structurées avec des `div` et des paragraphes génériques.

### 8. Organisation Angular

Le projet utilise des `NgModule`. Avec les composants standalone, chaque composant déclare plus directement ce dont il a besoin.

**Exemples :**

- `app.module.ts`, ligne 8 : déclaration du module racine avec `@NgModule`.
- `app-routing.module.ts`, ligne 18 : configuration du routage dans un module Angular.

### 9. Présentation réutilisable

Les deux pages affichent un titre et des statistiques avec une structure similaire, mais aucun composant partagé n’est utilisé pour cette présentation. Un composant réutilisable pourrait être envisagé si cela simplifie réellement les pages.

**Exemples :**

- `home.component.html`, ligne 8 : conteneur des statistiques avec `class="split"`.
- `country.component.html`, ligne 6 : structure similaire pour les statistiques du pays.
- La structure actuelle de `src/app` ne contient pas de dossier `components/` ni de composant `HeaderComponent`.

## Plan d’action

1. **Créer des interfaces** pour les pays et leurs participations, puis remplacer les `any`.
2. **Centraliser la récupération des données** dans un `OlympicService`, afin que les pages n’appellent plus directement `HttpClient` et que l’URL soit définie à un seul endroit.
3. **Alléger les composants.** Déplacer les calculs réutilisables dans un service et préparer les données destinées aux graphiques. Garder dans les pages la coordination de l’affichage. Créer des composants partagés pour les statistiques ou les graphiques si cela évite réellement de répéter la présentation.
4. **Clarifier la gestion des observables.** Retirer les `pipe()` vides, rendre les abonnements explicites et gérer la durée de vie de l’abonnement aux paramètres de route.
5. **Gérer les états et les cas limites.** Afficher le chargement et les erreurs, et prévoir un comportement adapté lorsqu’un pays n’existe pas.
6. **Améliorer la lisibilité et vérifier le lint.** Choisir des noms explicites, supprimer les traces de diagnostic et traiter les erreurs signalées par `ng lint`.
7. **Structurer les templates avec du HTML sémantique**, notamment des balises de titre adaptées.
8. **Envisager les composants standalone** comme une modernisation facultative du projet.

## Conclusion

Les priorités sont de mieux typer les données, de centraliser leur récupération et de séparer les responsabilités. Ces changements rendront les pages plus lisibles et faciliteront les évolutions sans répéter la logique dans les composants.

## Arborescence envisagée

- `components/` : composants d’interface réutilisables.
- `pages/` : pages associées aux routes de l’application.
- `services/` : récupération des données et logique partagée.
- `models/` : modèles et interfaces des données.
- `assets/` : Fichiers statiques et données de simulation (mock).

```text
src/app/
├── app-routing.module.ts
├── app.module.ts
├── components/
│   ├── header/
│   ├── error/
│   └── loading/
├── pages/
│   ├── country/
│   ├── home/
│   └── not-found/
├── services/
│   └── DataService.ts
└── models/
│   ├── olympic.model.ts
│   └── participation.ts
└── assets/
    ├── olympic.json
    └── images/
```
