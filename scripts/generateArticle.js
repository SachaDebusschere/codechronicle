const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { OpenAI } = require('openai');

// Initialiser OpenAI avec la clé API
console.log("Version du package OpenAI:", require('openai/package.json').version);
console.log("Initialisation du client OpenAI...");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * Extrait les informations du nom de fichier pour créer un prompt
 */
function extractInfoFromFilename(filename) {
  const filenameWithoutExt = path.basename(filename, '.md');
  const parts = filenameWithoutExt.split('-');
  
  const dateStr = `${parts[0]}-${parts[1]}-${parts[2]}`;
  
  const titleWords = parts.slice(3);
  const titleFromFilename = titleWords.join(' ').replace(/-/g, ' ');
  
  return {
    date: dateStr,
    titleFromFilename
  };
}

/**
 * Génère un article en utilisant l'API d'IA
 */
async function generateArticleContent(filename) {
  try {
    const fileInfo = extractInfoFromFilename(path.basename(filename));
    
    console.log(`Génération de contenu pour: ${fileInfo.titleFromFilename}`);
    
    const prompt = `Écris un article de blog technique détaillé sur "${fileInfo.titleFromFilename}". 
    L'article doit être structuré avec une introduction, plusieurs sous-parties avec des titres, et une conclusion. 
    Inclus également 3 à 5 tags pertinents pour cet article.`;
    
    try {
      console.log("Tentative d'appel à l'API OpenAI...");
      
      // Affichage de la clé API (masquée) pour vérifier qu'elle est bien présente
      if (!process.env.OPENAI_API_KEY) {
        console.error("ERREUR: Clé API OpenAI non définie!");
      } else {
        console.log("Clé API OpenAI présente: " + process.env.OPENAI_API_KEY.substring(0, 3) + "..." + process.env.OPENAI_API_KEY.substring(process.env.OPENAI_API_KEY.length - 4));
      }
      
      // Utilisation de l'API OpenAI avec le SDK officiel
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo", // Modèle stable, certainement disponible
        messages: [
          { role: "system", content: "Tu es un expert en technologies qui écrit des articles techniques de haute qualité pour un blog spécialisé." },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 2000
      });
      
      console.log("Réponse reçue de l'API OpenAI");
      
      // Extraire le contenu généré
      const generatedContent = completion.choices[0].message.content.trim();
      
      // Extraction du titre, résumé et tags à partir du contenu généré
      const lines = generatedContent.split('\n');
      const title = lines[0].replace(/^#\s+/, '').trim();
      
      // Génère un résumé (premières phrases)
      const firstParagraph = lines.find(line => line.length > 100) || '';
      const summary = firstParagraph.substring(0, 150) + '...';
      
      // Extraire les tags
      const tagsLine = generatedContent.match(/tags:.*|Tags:.*|#tags:.*|#Tags:.*/i);
      let tags = ['développement', 'tech', 'programmation'];
      
      if (tagsLine) {
        const extractedTags = tagsLine[0].replace(/tags:|Tags:|#tags:|#Tags:/i, '').split(',').map(tag => tag.trim());
        if (extractedTags.length > 0) {
          tags = extractedTags;
        }
      }
      
      // Formate le contenu avec frontmatter YAML
      const frontmatter = {
        title,
        date: fileInfo.date,
        summary,
        tags
      };
      
      const contentWithFrontmatter = matter.stringify(generatedContent, frontmatter);
      
      // Écriture du fichier
      fs.writeFileSync(filename, contentWithFrontmatter);
      console.log(`Article généré avec succès: ${filename}`);
      
      return {
        title,
        summary,
        tags
      };
    } catch (error) {
      console.error("Erreur OpenAI détaillée:", JSON.stringify(error, null, 2));
      if (error.status) {
        console.error(`Status: ${error.status}, Message: ${error.message}`);
      }
      throw new Error(`Erreur API OpenAI: ${error.message}`);
    }
  } catch (error) {
    console.error("Erreur lors de la génération de l'article:", error);
    throw error;
  }
}

/**
 * Fonction principale
 */
async function main() {
  try {
    const targetFile = process.argv[2];
    
    if (!targetFile) {
      console.error('Veuillez spécifier un fichier cible');
      process.exit(1);
    }
    
    const filePath = path.resolve(targetFile);
    
    if (!fs.existsSync(filePath)) {
      console.error(`Le fichier ${filePath} n'existe pas`);
      process.exit(1);
    }
    
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    if (fileContent.trim() !== '') {
      console.log('Le fichier contient déjà du contenu. Génération ignorée.');
      process.exit(0);
    }
    
    const result = await generateArticleContent(filePath);
    
    // GitHub Actions - nouvelle syntaxe
    if (process.env.GITHUB_OUTPUT) {
      fs.appendFileSync(process.env.GITHUB_OUTPUT, `title=${result.title}\n`);
      fs.appendFileSync(process.env.GITHUB_OUTPUT, `summary=${result.summary}\n`);
      fs.appendFileSync(process.env.GITHUB_OUTPUT, `tags=${result.tags.join(',')}\n`);
    } else {
      // Ancienne syntaxe pour les environnements sans GITHUB_OUTPUT
      console.log(`::set-output name=title::${result.title}`);
      console.log(`::set-output name=summary::${result.summary}`);
      console.log(`::set-output name=tags::${result.tags.join(',')}`);
    }
    
  } catch (error) {
    console.error('Erreur:', error);
    process.exit(1);
  }
}

main(); 