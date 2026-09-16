# Fiche Play Store — Thòt Note

À copier-coller dans [Play Console](https://play.google.com/console). Langue par défaut : **français**.

## Créer l’app

1. Compte développeur (25 $ une fois) → **Créer une application**
2. Nom : `Thòt Note`
3. Type : **Application** (pas un jeu)
4. Gratuit
5. Déclarations : pas de pubs, pas d’accès aux pubs dans l’app

Identifiant : `org.thotnote.app`

## Textes

**Nom (30 car. max)**  
Thòt Note

**Description courte (80 car. max)**  
Carnet de classe : croix, élèves, plan et SMS aux parents.

**Description complète**

Thòt Note aide les enseignant·es à suivre une classe au quotidien, sans tableur.

• Croix et observations par élève  
• Compteur de séance dans l’en-tête  
• Plan de classe  
• Listes (devoirs, matériel, etc.)  
• SMS aux parents, composés sur le téléphone (rien n’est envoyé via nos serveurs)  
• Import Pronote (CSV)

Connexion par e-mail et mot de passe. Les données de classe restent sur ton compte.

Site : https://thotnote.org  
Confidentialité : https://thotnote.org/confidentialite.html  
Supprimer le compte : Paramètres → Supprimer le compte, ou https://thotnote.org/supprimer-compte.html

**Catégorie**  
Éducation

**Balises** (si demandées)  
enseignant, classe, collège, lycée, cahier, SMS

**E-mail de contact**  
lp.bendeks@gmail.com

**Site**  
https://thotnote.org

## Images

| Élément | Fichier | Taille |
| --- | --- | --- |
| Icône (fiche Play) | `native/play/icon-512.png` | 512×512, exigée par la Console |
| Icône source | `native/assets/icon.png` | 1024×1024 |
| Bannière (feature graphic) | `native/play/feature-graphic.png` | 1024×500, obligatoire |
| Captures téléphone | à faire dans l’émulateur | au moins 2, JPEG ou PNG, 16:9 ou 9:16 |

Captures utiles : connexion, liste d’élèves avec croix, plan de classe, paramètres.

Dans l’émulateur : icône appareil photo de la barre Android Studio. Recadre si Play refuse le format.

## Confidentialité et suppression

- Politique : https://thotnote.org/confidentialite.html
- Suppression (URL web, exigée par Play) : https://thotnote.org/supprimer-compte.html
- Dans l’app : Paramètres → Supprimer le compte (mot de passe)

## Data safety (Sécurité des données)

Pas de vente de données. Pas de pubs. Compte obligatoire.

| Donnée | Collectée | Partagée | Finalité |
| --- | --- | --- | --- |
| Adresse e-mail | Oui | Non | Compte |
| Nom / prénom du compte | Oui | Non | Compte |
| Noms d’élèves, croix, listes, plan | Oui | Non | Fonction de l’app |
| Mot de passe | Géré par Firebase Auth (pas lu en clair) | Non | Compte |

- Chiffrement en transit : **oui** (HTTPS)
- Suppression sur demande : **oui** (dans l’app + e-mail)
- Les SMS restent sur le téléphone, pas sur nos serveurs
- Analytics Firebase possible (audience) : si tu coches Analytics, dis « analytics » optionnel. Sinon « non »

## Questionnaire d’évaluation (content rating)

C’est une app **enseignants**, pas enfants.

- Public : **18 ans et plus** (outil pro)
- Pas de violence, sexe, drogue, localisation des enfants
- Cible : **enseignants**, pas les élèves
- « L’app s’adresse-t-elle aux enfants ? » → **Non**

## Accès à l’app (relecture Google)

L’app a un login. Crée un compte démo **avant** d’envoyer :

- e-mail : par ex. `demo.thotnote@gmail.com`
- mot de passe simple
- 1 classe factice, 2-3 élèves, quelques croix

Dans Play Console → Contenu de l’app → Accès à l’app : **Toutes les fonctionnalités sont accessibles** (avec identifiants), colle e-mail + mot de passe.

Ne mets pas ton vrai compte Léo.

## Permissions

Seule permission : **INTERNET**. Pas de caméra, contacts, localisation. Les SMS s’ouvrent dans Messages, sans permission SMS.
