# Coquille native Thòt Note (Play Store + App Store)

Les apps store sont une **coquille Capacitor** : icône, écran de lancement, barre de statut. Elles affichent le site **https://www.thotnote.org**. Un `firebase deploy --only hosting` met donc à jour le site **et** les apps déjà installées, sans nouveau passage store.

Android est le plus simple à publier en premier (compte Play 25 $, pas besoin de Mac). iOS demande un Mac, Xcode et un compte Apple Developer (99 $/an).

## Prérequis

- Compte [Google Play Console](https://play.google.com/console) (25 $ une fois)
- Compte [Apple Developer](https://developer.apple.com) (99 $/an) pour iOS
- [Android Studio](https://developer.android.com/studio) (Ladybug ou plus récent, JDK 21)
- Mac + Xcode 16+ pour iOS
- Page de confidentialité déjà sur le site : https://www.thotnote.org/confidentialite.html

**Avant de soumettre aux stores :** Play (et bientôt Apple) exigent une **suppression de compte dans l’app**. Ce n’est pas encore dans l’interface ; à faire avant d’envoyer la fiche Play.

## Premier build Android (sur ta machine)

```bash
git checkout master && git pull
npm install
cd native && npm install && cd ..
npm run native:sync
npm run native:android
```

Dans Android Studio : laisser Gradle finir, brancher un téléphone ou lancer un émulateur API 24+, Run.

Pour un **AAB** Play Store : Build → Generate Signed Bundle / APK.

1. Créer un keystore (`thotnote-upload.jks`) et le garder hors git, en lieu sûr.
2. `applicationId` : `org.thotnote.app`
3. Remplir la fiche Play : nom **Thòt Note**, captures téléphone, texte court, politique de confidentialité `https://www.thotnote.org/confidentialite.html`, catégorie Éducation.
4. Copier `native/assetlinks.example.json` vers `public/.well-known/assetlinks.json` avec l’empreinte SHA-256 du keystore (ou de l’App Signing Google), puis redéployer le site.

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

Changer `server.url` dans `capacitor.config.json` vers `http://10.0.2.2:3000` (émulateur Android) ou l’IP locale pour tester le `npm start` dans la coquille. Remettre `https://www.thotnote.org` avant de publier.
