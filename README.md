# CodeChronicle 📝
TEST DE L'ETAPE 2 !
![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/SachaDebusschere/codechronicle/generate-article.yml?label=G%C3%A9n%C3%A9ration%20d%27Articles)
![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/SachaDebusschere/codechronicle/pr-comment.yml?label=Commentaire%20PR)
![License](https://img.shields.io/badge/licence-MIT-blue)

## 🚀 Présentation

CodeChronicle est une solution DevOps complète qui automatise la création, la gestion et la publication d'un blog technique. Le contenu du blog est généré automatiquement grâce à l'intelligence artificielle, puis déployé en production sur un hébergeur web gratuit (InfinityFree).

## ✨ Fonctionnalités

- **Génération automatique d'articles**: Utilisation de l'API OpenAI pour générer du contenu de qualité
- **Workflows GitHub Actions**: Automatisation de la génération d'articles et notifications
- **Commentaires automatiques sur les PR**: Informations détaillées sur les articles générés
- **Notifications Discord**: Alertes en temps réel lors des merges
- **Site statique**: Transformation des fichiers markdown en HTML

## 🛠️ Architecture technique

Le projet utilise les technologies suivantes:

- **Node.js**: Pour les scripts de génération et transformation
- **GitHub Actions**: Pour l'automatisation des workflows
- **API OpenAI**: Pour la génération de contenu IA
- **Markdown**: Pour la structure des articles
- **HTML/CSS**: Pour le site statique

## 🔄 Workflow

1. Création d'un fichier markdown vide dans le dossier `blog/`
2. Ouverture d'une Pull Request
3. Génération automatique du contenu par l'IA
4. Commentaire automatique sur la PR
5. Merge de la PR vers `main`
6. Notification Discord envoyée
7. Déploiement manuel sur InfinityFree

## 📦 Installation

```bash
# Cloner le dépôt
git clone https://github.com/SachaDebusschere/codechronicle.git

# Installer les dépendances
cd codechronicle
npm install

# Ajouter votre clé API OpenAI en tant que GitHub Secrets
```

## 🚀 Utilisation

Pour créer un nouvel article:

1. Créez un fichier markdown vide dans le dossier `blog/` avec le format `YYYY-MM-DD-titre-article.md`
2. Poussez vers la branche main et ouvrez une PR
3. GitHub Actions générera automatiquement le contenu
4. Vérifiez le contenu généré et mergez la PR

## 🔗 Liens

- [Blog en ligne (pas encore up)]()
- [Documentation OpenAI](https://platform.openai.com/docs/introduction)
- [GitHub Actions](https://docs.github.com/fr/actions)