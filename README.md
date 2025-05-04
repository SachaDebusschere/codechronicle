# CodeChronicle 📝

![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/SachaDebusschere/codechronicle/generate-article.yml?label=G%C3%A9n%C3%A9ration%20d%27Articles)
![License](https://img.shields.io/badge/licence-MIT-blue)

## 🚀 Présentation

CodeChronicle est une solution DevOps complète qui automatise la création, la gestion et la publication d'un blog technique. Le contenu du blog est généré automatiquement grâce à l'intelligence artificielle, puis déployé en production sur un hébergeur web gratuit (InfinityFree).

## ✨ Fonctionnalités

- **Génération automatique d'articles**: Utilisation de l'API OpenAI pour générer du contenu de qualité
- **Workflows GitHub Actions**: Automatisation de la génération d'articles et notifications
- **Commentaires automatiques sur les PR**: Informations détaillées sur les articles générés
- **Notifications Discord**: Alertes en temps réel lors de la génération d'un article

## 🛠️ Architecture technique

Le projet utilise les technologies suivantes:

- **Node.js**: Pour les scripts de génération et transformation
- **GitHub Actions**: Pour l'automatisation des workflows
- **API OpenAI**: Pour la génération de contenu IA
- **Markdown**: Pour la structure des articles

## 🔄 Workflow

1. Création d'un fichier markdown vide dans le dossier `blog/`
À l'ouverture d'une Pull Request :
2. Génération automatique du contenu par l'IA
3. Commentaire automatique sur la PR
4. Notification Discord envoyée

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
5. Badge mis à jour sur le Readme

## 🔗 Liens

- [Documentation OpenAI](https://platform.openai.com/docs/introduction)
- [GitHub Actions](https://docs.github.com/fr/actions)

J'ai galéré de fou pour que ça fonctionne avec l'API et j'ai réussi hier mais j'ai pas la foi de finir l'exo, normalement j'ai tout jusque la notif discord au moins avec un git propre et sécurisé !