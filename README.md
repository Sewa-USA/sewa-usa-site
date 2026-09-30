# SEWA USA — site web et application

Site de l'Association des Centrafricains et Amis de la Centrafrique aux États-Unis.
Français uniquement pour l'instant. Installable sur l'écran d'accueil (PWA).

## Pour les éditeurs (sans code)

Aujourd'hui (version de démonstration), le contenu est dans `src/data/*.json`.
Prochaine étape prévue : un espace d'édition (Sanity) avec des formulaires
« Nouvel événement », « Nouvel article », etc., sans jamais toucher au code.
Les éléments marqués **Exemple** sur le site sont des contenus fictifs à remplacer.

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
| Événements / articles / équipe / ressources | `src/data/*.json` |
| Logo et icônes de l'app | `public/logo.png`, `public/icons/` |
| Menu | `src/components/Header.astro` et `src/layouts/Base.astro` (barre mobile) |
| Source unique du contenu | `src/lib/content.ts` |

Brancher Sanity plus tard : seul `src/lib/content.ts` change. Les pages gardent
les mêmes fonctions et les mêmes types.

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
- [ ] Brancher l'espace d'édition (Sanity) et le formulaire de contact.
