# SEWA USA — site web et application

Site de l'Association des Centrafricains et Amis de la Centrafrique aux États-Unis.
Français uniquement pour l'instant. Installable sur l'écran d'accueil (PWA).

## Pour les éditeurs (sans code)

Le contenu se gère dans **l'espace d'édition : https://sewa-usa.sanity.studio**
(connexion par invitation). Quatre listes : Événement, Article, Membre de l'équipe, Ressource.
Remplir le formulaire, puis **Publish**. Le site se met à jour en environ une minute.
Les éléments cochés « Contenu d'exemple » affichent l'étiquette **Exemple** : à remplacer ou supprimer.

## Pour le développeur qui reprend

Stack : Astro (pages statiques), CSS simple, aucune dépendance d'interface.

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # génère dist/
```

| Ce que vous voulez changer | Où |
|---|---|
| Couleurs, polices, espacements | `src/styles/global.css` (variables en haut) |
| Coordonnées, slogan, nom | `src/data/site.json` |
| Événements / articles / équipe / ressources | Sanity (`studio/schemaTypes/*` pour les champs) |
| Logo et icônes de l'app | `public/logo.png`, `public/icons/` |
| Carte du pied de page | `public/africa-map.svg`, générée par `scripts/build-map.mjs` (voir l'en-tête du script) |
| Menu | `src/components/Header.astro` et `src/layouts/Base.astro` (barre mobile) |
| Source unique du contenu | `src/lib/content.ts` |

Le site lit Sanity à la publication via `src/lib/content.ts` (projet `oy6psniq`, jeu de données `production`).
L'espace d'édition (`studio/`) se déploie avec `cd studio && npm install && npx sanity deploy`.
Le contenu de départ est dans `studio/seed/seed.ndjson`.

### Événements passés / à venir
La page Événements sépare les deux listes avec l'horloge du visiteur : un événement
passe dans « Événements passés » tout seul. La page d'accueil, elle, est calculée à la
publication : prévoir une republication quotidienne (hook de déploiement) une fois en ligne.

### Formulaire de contact
Désactivé tant que `formEndpoint` (dans `site.json`) est vide. Brancher un service de
formulaire gratuit (Formspree, Web3Forms) puis coller son adresse. Le champ piège `website`
filtre les robots.

### Application (PWA)
`public/manifest.webmanifest` + `public/sw.js`. Les pages déjà visitées restent lisibles
hors connexion. Si la structure du site change, incrémenter `VERSION` dans `sw.js`.

## À faire avant la mise en ligne
- [ ] Remplacer le logo quand le nouveau est prêt (`public/logo.png`, `public/icons/*`).
- [ ] Remplacer les contenus « Exemple » et l'équipe (noms, rôles, photos).
- [ ] Valider les textes de la page d'accueil avec le président.
- [ ] Ajouter l'adresse de la page Facebook dans `site.json` (`facebookHref`).
- [ ] Choisir et brancher le nom de domaine.
- [ ] Inviter le président comme Administrateur dans Sanity (sanity.io/manage), puis transférer la propriété.
- [ ] Brancher le formulaire de contact.
- [ ] Relier Sanity à Vercel (webhook de publication) pour la mise à jour automatique.
