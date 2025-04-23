import {OpenAI} from 'openai';

const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const matter = require('gray-matter');

// Initialiser OpenAI avec la clé API
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || ''
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
    
        const response = await openai.chat.completions.create({
            model: "gpt-4.1",
            messages: [
                { role: "system", content: "Tu es un expert en technologies qui écrit des articles techniques de haute qualité pour un blog spécialisé." },
                { role: "user", content: prompt }
            ],
            temperature: 0.7,
            max_tokens: 3000
        });
    
        if (!response.ok) {
          const errText = await response.text();
          throw new Error(`Erreur API: ${response.status} ${response.statusText} — ${errText}`);
        }

        const data = await response.json();
        const generatedContent = data.choices[0].message.content.trim();
    
        const lines = generatedContent.split('\n');
        const title = lines[0].replace(/^#\s+/, '').trim();
    
        const firstParagraph = lines.find(line => line.length > 100) || '';
        const summary = firstParagraph.substring(0, 150) + '...';
    
        const tagsLine = generatedContent.match(/tags:.*|Tags:.*|#tags:.*|#Tags:.*/i);
        let tags = ['développement', 'tech', 'programmation'];
    
        if (tagsLine) {
            const extractedTags = tagsLine[0].replace(/tags:|Tags:|#tags:|#Tags:/i, '').split(',').map(tag => tag.trim());
            if (extractedTags.length > 0) {
                tags = extractedTags;
            }
        }
    
        const frontmatter = {
            title,
            date: fileInfo.date,
            summary,
            tags
        };
    
        const contentWithFrontmatter = matter.stringify(generatedContent, frontmatter);
    
        fs.writeFileSync(filename, contentWithFrontmatter);
        console.log(`Article généré avec succès: ${filename}`);
    
        return {
            title,
            summary,
            tags
        };
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
    
    console.log(`::set-output name=title::${result.title}`);
    console.log(`::set-output name=summary::${result.summary}`);
    console.log(`::set-output name=tags::${result.tags.join(',')}`);
    
  } catch (error) {
    console.error('Erreur:', error);
    process.exit(1);
  }
}

main(); 