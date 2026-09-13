# Coquille native Thòt Note (Play Store + App Store)

Les apps store sont une **coquille Capacitor** : icône, écran de lancement, barre de statut. Elles affichent le site **https://thotnote.org** (sans `www` : l’autre adresse redirige et vidait la WebView). Un `firebase deploy --only hosting` met donc à jour le site **et** les apps déjà installées, sans nouveau passage store.

Android est le plus simple à publier en premier (compte Play 25 $, pas besoin de Mac). iOS demande un Mac, Xcode et un compte Apple Developer (99 $/an).

## Prérequis

- Compte [Google Play Console](https://play.google.com/console) (25 $ une fois)
- Compte [Apple Developer](https://developer.apple.com) (99 $/an) pour iOS
- [Android Studio](https://developer.android.com/studio) (Ladybug ou plus récent, JDK 21)
- Mac + Xcode 16+ pour iOS
- Page de confidentialité déjà sur le site : https://www.thotnote.org/confidentialite.html

**Avant de soumettre aux stores :** Play et App Store veulent un lien de confidentialité (`https://thotnote.org/confidentialite.html`) et une suppression de compte dans l’app (Paramètres → Supprimer le compte).

## Premier build Android (sur ta machine)

```bash
git checkout master && git pull
npm install
cd native && npm install && npx cap sync && cd ..
npm run native:android
```

`npx cap sync` (depuis `native/`) est obligatoire avant le premier Gradle : il crée `android/capacitor-cordova-android-plugins/`. Sans ça, Android Studio affiche *Could not read script cordova.variables.gradle*.

Dans Android Studio : laisser Gradle finir, brancher un téléphone ou lancer un émulateur API 24+, Run.

## Publier sur le Play Store

Textes, Data safety et captures : **`native/play/FICHE.md`**. Bannière : `native/play/feature-graphic.png`.

### 1. Compte et identifiants

1. [Play Console](https://play.google.com/console) (25 $ une fois) → Créer une application **Thòt Note**.
2. Crée un compte démo (ex. `demo.thotnote@gmail.com`) avec une petite classe, pour la relecture Google.

### 2. Keystore (une fois, à garder à vie)

Dans le Terminal, **hors du repo** :

```bash
keytool -genkeypair -v \
  -keystore "$HOME/Documents/thotnote-upload.jks" \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias thotnote \
  -dname "CN=Thot Note, O=Thot Note, L=France, C=FR"
```

Note les deux mots de passe. Perdre ce fichier = impossible de mettre l’app à jour.

```bash
cd native/android
cp keystore.properties.example keystore.properties
```

Édite `keystore.properties` : chemin du `.jks` et les mots de passe. Ce fichier est gitignoré.

### 3. Bundle (.aab)

```bash
cd ~/Github/Classroom
git checkout master && git pull
cd native && npx cap sync android
cd android && ./gradlew bundleRelease
```

Le fichier : `native/android/app/build/outputs/bundle/release/app-release.aab`

Play Console → Production (ou test interne d’abord, recommandé) → Créer une version → importer l’AAB.

### 4. Fiche

Copie `native/play/FICHE.md`. Confidentialité : `https://thotnote.org/confidentialite.html`. Suppression : `https://thotnote.org/supprimer-compte.html`.

Déploie le site **avant** d’envoyer la fiche, pour que ces pages existent :

```bash
cd ~/Github/Classroom
git checkout master && git pull
npm run build
firebase deploy --only hosting
```

`applicationId` : `org.thotnote.app`

## Premier build iOS (sur un Mac)

```bash
cd native && npm install && cd ..
npm run native:sync
npm run native:ios
```

Dans Xcode : équipe de développement, bundle id `org.thotnote.app`, écran de lancement déjà coloré `#0F3A2A`. Archive → App Store Connect.

Apple peut refuser une app « qui n’est qu’un site ». La coquille (icône, splash, encoches, SMS natif) aide ; si ça arrive, on pourra empaqueter le `build` dans l’app (commenter `server.url` dans `capacitor.config.json`) et publier une mise à jour store à chaque gros changement.

Dans `ios/App/App/Info.plist`, `ITSAppUsesNonExemptEncryption` est à `false` (HTTPS uniquement) pour accélérer TestFlight.

## Commandes

| Commande | Rôle |
| --- | --- |
| `npm run native:sync` | `npm run build` puis copie vers Android/iOS |
| `npm run native:android` | Ouvre Android Studio |
| `npm run native:ios` | Ouvre Xcode |

Changer `server.url` dans `capacitor.config.json` vers `http://10.0.2.2:3000` (émulateur Android) ou l’IP locale pour tester le `npm start` dans la coquille. Remettre `https://thotnote.org` avant de publier.
