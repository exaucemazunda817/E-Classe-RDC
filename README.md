# E-Classe RDC

Plateforme de formations en ligne (web + mobile) avec abonnements, catalogue de cours,
certificats vérifiables par QR code, et paiement mobile money (Orange Money, Airtel Money, M-Pesa).

## Étape 1 — Fondations (fait)
- Structure du projet Next.js 14 + TypeScript + Tailwind
- Schéma de base de données Prisma : Utilisateurs, Abonnements, Formations,
  Catégories, Inscriptions, Certificats, Paiements, Messages
- Palette de couleurs de la marque intégrée à Tailwind (bleu / orange du logo)

## ⚠️ IMPORTANT avant de lancer le projet
Le fichier `env.example.txt` doit être renommé en `.env` (avec un point, sans .txt)
avant de démarrer. Sur téléphone, le renommage avec un point ne fonctionne pas —
fais-le une fois sur un ordinateur (Mac, Windows, ou dans Replit/GitHub directement).

## Lancer le projet en local
```bash
npm install
cp env.example.txt .env
npx prisma db push      # crée la base SQLite locale (dev.db)
npm run dev
```
Le site sera disponible sur http://localhost:3000

## Étape 2 — Authentification (fait)
- Inscription (`/register`) et connexion (`/login`) avec NextAuth + mot de passe chiffré

## Étape 3 — Pages publiques (fait)
- Accueil, Catégories, Catalogue de formations (avec filtres)
- Design sobre et professionnel : icônes en traits fins, typographie Manrope/Inter,
  pas d'illustrations style dessin animé — cartes épurées et motifs géométriques discrets
- Données d'exemple : `npm run db:seed` (à faire après `npm run db:push`)

## Étape 4 — Espace membre (fait)
- `/account` : profil, carte d'abonnement actif (ou incitation à s'abonner), liens rapides
- `/account/courses` : mes formations avec barre de progression
- `/account/certificates` : mes certificats avec **QR code réel** de vérification
- `/verify/[code]` : page publique de vérification d'un certificat (scanne le QR code)
- `/account/purchases` : historique des paiements
- `/account/messages` : messages des formateurs
- `/account/profile` : modifier son nom
- `/account/subscription` : aperçu des plans (paiement branché à l'étape 6)
- Navigation basse fixe sur mobile (Accueil / Catégories / Certificats / Mon Espace),
  comme dans tes maquettes
- Toutes les pages `/account/*` sont protégées : redirection vers `/login` si non connecté

## Étape 5 — Certificats automatiques + PDF (fait)
- Page de détail d'une formation (`/courses/[id]`) : inscription, liste des leçons,
  progression interactive (marquer une leçon comme terminée)
- Dès que toutes les leçons d'une formation **certifiante** sont terminées, le certificat
  est **généré automatiquement** (aucune action manuelle requise)
- Téléchargement du certificat en **vrai PDF** (mise en page professionnelle avec cadre,
  nom de l'apprenant, formation, date, QR code de vérification) via `pdf-lib`
- Données d'exemple : chaque formation a maintenant 3 leçons (`npm run db:seed`)

## Étape 6 — Paiement CinetPay (fait)
- Intégration CinetPay : Orange Money, Airtel Money, M-Pesa et carte bancaire via une
  page de paiement hébergée (`/api/payments/initiate`)
- Webhook de confirmation (`/api/payments/webhook`) : ne fait jamais confiance à la
  notification brute — revérifie toujours le statut réel auprès de CinetPay avant de
  débloquer quoi que ce soit
- Abonnements payants : bouton "S'abonner" fonctionnel sur `/account/subscription`
- Formations payantes : bouton d'achat sur la page de la formation, accès débloqué
  automatiquement après paiement confirmé
- Page de retour (`/payment/return`) avec re-vérification de secours si le webhook
  n'est pas encore arrivé (utile en développement local sans URL publique)
- ⚠️ Pour tester en local, CinetPay doit pouvoir atteindre `notify_url` — utilise un
  tunnel comme `ngrok` et mets à jour `NEXTAUTH_URL` en conséquence, ou teste en
  environnement déployé (Vercel, Railway, etc.)

## Étape 7 — Polish responsive + déploiement (fait)
- Menu mobile (hamburger) sur les pages publiques — toutes les pages sont maintenant
  accessibles depuis un téléphone, pas seulement depuis l'espace membre connecté
- Ajustement des tailles de texte du hero et des espacements sur petits écrans
- Page 404 personnalisée, page d'erreur générique, état de chargement (squelette) sur
  le catalogue
- Favicon, `robots.txt` et `sitemap.xml` générés automatiquement (bon référencement)

## 🚀 Déployer le site en production

### 1. Base de données (PostgreSQL)
Le projet utilise SQLite en développement pour zéro configuration. En production, passe
à PostgreSQL — gratuit pour démarrer sur [Neon](https://neon.tech) ou
[Supabase](https://supabase.com) :
1. Crée un projet, copie l'URL de connexion (`postgresql://...`)
2. Dans `prisma/schema.prisma`, remplace `provider = "sqlite"` par `provider = "postgresql"`
3. Mets `DATABASE_URL` à jour avec cette URL dans les variables d'environnement (étape 3)

### 2. Compte marchand CinetPay
1. Crée un compte sur [cinetpay.com](https://cinetpay.com) (disponible pour la RDC)
2. Récupère ta clé API et ton Site ID dans le tableau de bord
3. Renseigne-les dans `CINETPAY_API_KEY` et `CINETPAY_SITE_ID`

### 3. Déploiement sur Vercel (recommandé, gratuit pour démarrer)
1. Pousse le projet sur GitHub (crée un dépôt, `git init` puis `git push`)
2. Sur [vercel.com](https://vercel.com), clique "New Project" et importe le dépôt
3. Dans les paramètres du projet, ajoute toutes les variables d'environnement
   (voir `env.example.txt`) :
   - `DATABASE_URL` (ton URL Postgres de l'étape 1)
   - `NEXTAUTH_SECRET` (génère une valeur aléatoire, ex: `openssl rand -base64 32`)
   - `NEXTAUTH_URL` → l'URL finale de ton site (ex: `https://e-classe-rdc-en69.vercel.app`)
   - `CINETPAY_API_KEY`, `CINETPAY_SITE_ID`
4. Déploie. Vercel exécute `npm run build` automatiquement
5. Une fois en ligne, connecte-toi à la base et lance :
   ```bash
   npx prisma db push
   npm run db:seed
   ```
   (depuis ton ordinateur, avec `DATABASE_URL` pointant vers la base de production)

### 4. Nom de domaine personnalisé
Dans Vercel → Settings → Domains, ajoute ton domaine (ex: `e-classerdc.cd`) et suis
les instructions DNS. Pense à mettre `NEXTAUTH_URL` à jour avec le domaine final.

### 5. Checklist avant mise en ligne
- [ ] `DATABASE_URL` pointe vers une vraie base Postgres (pas SQLite)
- [ ] `NEXTAUTH_SECRET` est une valeur aléatoire unique (jamais celle de l'exemple)
- [ ] `NEXTAUTH_URL` correspond exactement au domaine final (https, sans slash final)
- [ ] Compte CinetPay activé en mode production (pas seulement test)
- [ ] `npm run db:seed` a été exécuté une fois sur la base de production
- [ ] Un premier compte ADMIN a été créé pour gérer les formations (voir note ci-dessous)

## Étape 8 — Interface d'administration (fait)
- **`/admin`** : tableau de bord (apprenants, formations, certificats délivrés, revenus)
- **`/admin/courses`** : liste, création, édition et suppression des formations
- **`/admin/courses/[id]`** : édition d'une formation + ajout/suppression de leçons
- **`/admin/categories`** : gestion des catégories
- Accès strictement réservé au rôle `ADMIN` (redirection automatique sinon)
- Un lien "Accéder à l'interface d'administration" apparaît sur `/account` pour les
  utilisateurs admin
- **Compte admin par défaut** créé par `npm run db:seed` :
  - Email : `admin@eclasserdc.cd`
  - Mot de passe : `ChangeMoi123!`
  - ⚠️ **Change ce mot de passe immédiatement** après ta première connexion (pas encore
    d'écran dédié — modifie le `passwordHash` via `npm run db:studio`, ou attends un futur
    écran "changer le mot de passe" si tu veux que je l'ajoute)
- Pour promouvoir un autre utilisateur en admin : `npm run db:studio` → table `User` →
  change son `role` en `ADMIN`

## Étape 10 — Espace enseignant (fait)
- **`/teacher`** : tableau de bord d'un formateur — liste de ses propres formations
  uniquement (jamais celles des autres)
- **`/teacher/courses/[id]`** : suivi d'une formation — informations, leçons et
  liste des inscrits, en lecture seule (voir étape 13)
- **Liste des étudiants inscrits** par formation, avec leur progression en temps réel
- **`/admin/users`** : nouvelle page admin pour changer le rôle d'un utilisateur
  (Étudiant / Formateur / Admin) — c'est ici que tu transformes un compte en formateur
- Confirmation visuelle ("✓ Modifications enregistrées") ajoutée sur le formulaire de
  formation, admin et enseignant

### Comment donner accès à quelqu'un
1. Connecte-toi en admin → `/admin/users`
2. Trouve la personne dans la liste, change son rôle en **Formateur**
3. Elle verra alors un bandeau "Accéder à l'espace enseignant" sur sa page `/account`
## Étape 9 — Changement de mot de passe (fait)
- **`/account/password`** : formulaire sécurisé (mot de passe actuel requis, nouveau
  mot de passe confirmé deux fois), accessible depuis `/account/profile`
- Fonctionne aussi pour changer le mot de passe du compte admin par défaut créé au seed
- ✅ Après ta première connexion en tant qu'admin, va sur `/account/password` pour
  remplacer `ChangeMoi123!` par un mot de passe personnel

## Étape 11 — Messagerie apprenant ↔ formateur (fait)
Vraies conversations à double sens, rattachées à une formation (l'ancien modèle
`Message` ne permettait qu'un envoi à sens unique, sans expéditeur ni destinataire).

- **Côté étudiant** : bouton "Contacter le formateur" sur la page d'une formation,
  liste des conversations sur `/account/messages`, fil de discussion sur
  `/account/messages/[id]`
- **Côté formateur** : onglet "Messages" dans l'espace enseignant, bouton "Message"
  en face de chaque étudiant inscrit, fil sur `/teacher/messages/[id]`
- Messages marqués comme lus à l'ouverture du fil, badges de non-lus des deux côtés
- Une conversation est unique par couple (étudiant, formation) : rouvrir un fil
  existant ne crée pas de doublon

### ⚠️ Condition pour que le bouton apparaisse
Le bouton "Contacter le formateur" ne s'affiche que si **les trois** conditions
sont réunies :
1. L'étudiant est connecté
2. Il est **inscrit** à la formation
3. La formation a un **compte formateur lié** (voir étape 12) — un simple nom
   saisi à la main ne suffit pas, car il n'y a alors personne à qui écrire

## Étape 12 — Lier un vrai compte formateur à une formation (fait)
Le formulaire admin ne proposait qu'un champ texte libre pour le nom du formateur.
Un nouveau champ **"Compte formateur lié"** permet désormais de choisir un vrai
compte utilisateur — c'est ce lien qui rend la messagerie utilisable.

- Le sélecteur n'apparaît que dans l'espace **admin** : un formateur ne peut pas
  réattribuer sa propre formation à quelqu'un d'autre
- Le serveur refuse tout compte n'ayant pas le rôle Formateur (ou Admin)
- Les formations créées depuis `/teacher/courses/new` sont automatiquement liées
  à leur auteur — rien à faire dans ce cas

### Activer la messagerie sur une formation existante
1. Le formateur crée son compte sur le site (ou utilise un compte existant)
2. En admin → `/admin/users` → passe son rôle à **Formateur**
3. En admin → `/admin/courses/[la formation]` → champ **"Compte formateur lié"** →
   sélectionne-le → Enregistrer

## Étape 13 — Espace enseignant en lecture seule (fait)
Le modèle de droits est désormais : **l'admin gère tout le contenu, le formateur
accompagne ses étudiants.** Un formateur n'a plus besoin — ni le droit — de créer
sa propre formation pour être joignable par ses apprenants.

| Action | Admin | Formateur |
|---|---|---|
| Créer une formation | ✅ | ❌ |
| Modifier une formation (titre, prix, type…) | ✅ | ❌ |
| Supprimer une formation | ✅ | ❌ |
| Ajouter / retirer des leçons | ✅ | ❌ |
| Voir ses formations assignées | ✅ | ✅ |
| Voir les inscrits et leur progression | ✅ | ✅ |
| Répondre aux messages des étudiants | ✅ | ✅ |

La restriction est appliquée **côté serveur**, pas seulement en masquant des
boutons : les routes d'écriture de `/api/teacher/*` ont été retirées. Une requête
directe (POST, PATCH, DELETE) reçoit désormais un `405 Method Not Allowed`.

Concrètement :
- `/teacher/courses/new` et le bouton « Nouvelle formation » n'existent plus
- `/teacher/courses/[id]` affiche les informations et les leçons en lecture seule
- Un admin y voit un lien « Modifier depuis l'espace admin »

## 🔐 Bases de données : dev et production séparées
`DATABASE_URL` dans le `.env` local doit pointer vers une base de **développement**,
jamais vers la production — sinon le moindre test touche les données de vrais
utilisateurs. L'URL de production est définie **uniquement** dans les variables
d'environnement Vercel.

Les deux bases sont des projets Neon distincts. Pour repartir de zéro en local :
```bash
npx prisma db push
npm run db:seed
```
