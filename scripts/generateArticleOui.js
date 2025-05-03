require('dotenv').config({path: '../.env'});
const fs = require('fs');
const path = require('path');
const { OpenAI } = require('openai');

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generate article content using OpenAI
 * @param {string} prompt - The prompt for content generation
 * @returns {Promise<string>} - The generated content
 */
async function generateContent(prompt) {
  const response = await openai.chat.completions.create({
    model: "gpt-4.1",
    messages: [
      {
        role: "system",
        content: `Create a well-structured article about "${prompt}" with YAML frontmatter. Include:
        - title: A catchy title
        - summary: A brief summary (1-2 sentences)
        - tags: 3-5 relevant tags`
      },
      {
        role: "user",
        content: `Write an article about "${prompt}".`
      }
    ],
    temperature: 0.7,
    max_tokens: 1500
  });

  return response.choices[0].message.content.trim();
}

/**
 * Extract title and summary from content
 * @param {string} content - The markdown content with frontmatter
 * @returns {Object} - Object containing title and summary
 */
function extractMetadata(content) {
  const titleMatch = content.match(/title:\s*["']?(.*?)["']?\n/);
  const summaryMatch = content.match(/summary:\s*["']?(.*?)["']?(\n|$)/);
  
  return {
    title: titleMatch ? titleMatch[1].trim() : "Article sans titre",
    summary: summaryMatch ? summaryMatch[1].trim() : "Pas de résumé disponible"
  };
}

/**
 * Save content to file
 * @param {string} filePath - Path to save the file
 * @param {string} content - Content to write
 */
function saveToFile(filePath, content) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Saved to ${filePath}`);
}

/**
 * Process a markdown file
 * @param {string} filePath - Path to the markdown file
 * @returns {Promise<Object|null>} - Metadata object or null if failed
 */
async function processFile(filePath) {
  try {
    // Extract prompt from filename
    const filename = path.basename(filePath, '.md');
    const prompt = filename.replace(/-/g, ' ');

    console.log(`Processing ${filePath} with prompt: "${prompt}"`);

    // Generate content
    const content = await generateContent(prompt);
    
    // Extract metadata
    const metadata = extractMetadata(content);
    
    // Save to file
    saveToFile(filePath, content);
    
    // Return metadata with filename for identification
    return {
      file: filename,
      ...metadata
    };
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    return null;
  }
}

/**
 * Main function
 */
async function main() {
  try {
    // Check if a specific file was provided as an argument
    const specificFile = process.argv[2];
    const blogDir = path.join(__dirname, '../blog');
    let files = [];
    let results = [];

    if (specificFile) {
      // Process only the specific file
      files = [specificFile];
    } else {
      // Read all files in the blog directory
      files = fs.readdirSync(blogDir)
        .filter(file => file.endsWith('.md'))
        .map(file => path.join(blogDir, file));
    }

    if (files.length === 0) {
      console.error('No markdown files found to process.');
      process.exit(1);
    }

    console.log(`Starting to process ${files.length} file(s)`);

    // Process each file
    for (const file of files) {
      const result = await processFile(file);
      if (result) results.push(result);
    }

    // Write metadata to file for GitHub Action
    if (results.length > 0) {
      const metadataPath = path.join(__dirname, '../article-metadata.json');
      fs.writeFileSync(metadataPath, JSON.stringify(results, null, 2));
      console.log(`Article metadata saved to ${metadataPath}`);
    }

    console.log('Processing complete');
  } catch (error) {
    console.error('Unexpected error:', error);
    process.exit(1);
  }
}

// If this script is run directly
if (require.main === module) {
  main().then(() => console.log('Done')).catch(e => console.error(e));
} else {
  // Export for use in other scripts
  module.exports = { processFile, extractMetadata };
}