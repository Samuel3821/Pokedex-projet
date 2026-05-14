# Projet Client Riche

Ce projet a été réalisé dans le cadre du cours **Client Riche** à la HEG.

## Technologies utilisées
- React
- Vite
- Firebase (Firestore)

## Structure du projet

### Composants
Contient les différentes pages permettant de naviguer dans l’application.

### Assets
Contient les différentes images utilisées dans le projet.

### firebase.js
Charger la configuration Firebase depuis des variables d'environnement locales.

## Configuration Firebase

Ne pas mettre la configuration Firebase directement dans le code pour éviter de compromettre la sécurité du projet.

Créer un fichier `.env.local` à la racine du projet avec les variables d'environnement :

```env
VITE_FIREBASE_API_KEY=api_key
VITE_FIREBASE_AUTH_DOMAIN=projet.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=projet
VITE_FIREBASE_STORAGE_BUCKET=projet.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=projet_messaging_sender_id
VITE_FIREBASE_APP_ID=projet_app_id
VITE_FIREBASE_MEASUREMENT_ID=projet_measurement_id
```


1. Créer un projet sur Firebase
2. Activer Firestore et Auth Google si nécessaire
3. Copier les valeurs de configuration Web dans `.env.local`
4. Lancer le projet avec `npm install` puis `npm run dev`

Le fichier `.env.local` n'est pas versionné sur GitHub.
## Installation

1. Cloner le projet
```bash
git clone <url-du-repo>

npm install

npm run dev

```

