# Application Planning Poker

## Description

Cette application permet de gérer une partie de Planning Poker en respectant les règles classiques tout en ajoutant des fonctionnalités pour améliorer l'expérience utilisateur. Elle propose des modes de jeu variés et permet de sauvegarder l'état de la partie pour une reprise ultérieure.

---

## Fonctionnalités principales

- **Gestion des joueurs** : Ajout et personnalisation des pseudos.
- **Chargement et sauvegarde du backlog** : Import/export du fichier `backlog.json` depuis le dossier `data`.
- **Modes de jeu** :
    - Unanimité (règle stricte).
    - Moyenne.
    - Médiane.
    - Majorité absolue.
- **Chronomètre** : Suivi de la durée de chaque partie.
- **Reprise de partie** : Chargement d'une sauvegarde au format JSON.

---

## Technologies utilisées

- **Frontend** : HTML, CSS, JavaScript.
- **Tests unitaires** : Jest.
- **Documentation** : JSDoc.
- **Automatisation CI/CD** : GitHub Actions.

---

## Installation et configuration

### Prérequis

- **Node.js** (version recommandée : 16 ou supérieure).
- **Gestionnaire de paquets** : npm.

### Étapes

1. Cloner le dépôt Git :
    
    ```bash
    git clone <https://github.com/Zzzyad/Projet-CAPI.git>
    cd Projet-CAPI
    ```
    
2. Installer les dépendances :
    
    ```bash
    npm install
    
    ```
    
3. Lancer l'application :
    - Ouvrir le fichier `index.html` dans un navigateur web.
    - Ou utiliser un serveur local comme `Live Server` dans VS Code.

---

## Lancer les tests

Pour exécuter les tests unitaires :

```bash
npm run test

```

---

## Documentation

La documentation est générée automatiquement avec **JSDoc**.
Pour générer la documentation :

```bash
jsdoc app.js

```

La documentation sera disponible dans le dossier `out`.

---

## Structure du projet

```
.github/workflows/      # Fichiers pour GitHub Actions
  Documentation_javascript.yml  # Workflow pour la documentation
  TU_javascript.yml            # Workflow pour les tests unitaires

assets/                 # Ressources graphiques
  cartes_0.svg, cartes_cafe.svg, etc.

data/                   # Données JSON
  backlog.json          # Données du backlog

node_modules/           # Modules Node.js pour les dépendances

out/                    # Fichiers générés pour la documentation
  fonts/                # Polices
  scripts/              # Scripts compilés
  styles/               # Styles CSS

app.js                  # Logique principale du jeu
index.html              # Interface utilisateur
style.css               # Feuille de style

jest.config.js          # Configuration des tests unitaires
package.json            # Gestion des dépendances
package-lock.json       # Verrouillage des versions des dépendances
testunitaire.test.js    # Tests unitaires

```

---

## Workflows GitHub Actions

### Tests unitaires : `TU_javascript.yml`

Ce workflow automatise l'exécution des tests unitaires :

```yaml
name: Tests unitaires JavaScript
on:
  push:
    branches:
      - dev1.0
  pull_request:
    branches:
      - dev1.0
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
    - name: Set up Node.js
      uses: actions/setup-node@v4
    - name: Install dependencies
      run: npm install
    - name: Run tests
      run: npm run test

```

### Documentation : `Documentation_javascript.yml`

Ce workflow automatise la génération et le déploiement de la documentation :

```yaml
name: Générer la documentation JSDoc
on:
  push:
    branches:
      - dev1.0
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - name: Checkout repository
      uses: actions/checkout@v4
    - name: Setup Node.js
      uses: actions/setup-node@v4
    - name: Installer JSDoc
      run: npm install -g jsdoc
    - name: Générer la documentation
      run: jsdoc app.js
    - name: Deploy Documentation
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./out

```

---

## Push des modifications

Pour enregistrer et pousser vos modifications dans le dépôt Git :

1. Initialiser le dépôt et ajouter une branche distante (uniquement lors du premier push) :
    
    ```
    git init
    git remote add origin https://github.com/Zzzyad/Projet-CAPI.git
    ```
    
2. Ajouter tous les fichiers au suivi :
    
    ```
    git add .
    ```
    
3. Créer un commit avec un message descriptif :
    
    ```
    git commit -m "Ajout de la fonctionnalité"
    ```
    
4. Configurer la branche principale (si ce n'est pas encore fait) :
    
    ```
    git branch -M dev1.0
    ```
    
5. Pousser les modifications vers la branche distante :
    
    ```
    git push -u origin dev1.0
    ```
    

---

##
