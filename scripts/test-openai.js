const { OpenAI } = require('openai');

// Affiche des informations sur la clé API
console.log('Vérification de la clé API OpenAI:');
if (!process.env.OPENAI_API_KEY) {
  console.error("❌ ERREUR: Variable d'environnement OPENAI_API_KEY non définie!");
  process.exit(1);
}

console.log(`✅ Clé API trouvée. Commence par: ${process.env.OPENAI_API_KEY.substring(0, 3)}... et se termine par: ...${process.env.OPENAI_API_KEY.substring(process.env.OPENAI_API_KEY.length - 4)}`);

// Initialiser le client OpenAI
console.log('Initialisation du client OpenAI...');
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Test simple
async function testOpenAI() {
  try {
    console.log('Test de communication avec OpenAI...');
    
    // Test avec un modèle simple et une requête courte
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "user", content: "Dis bonjour en français" }
      ],
      max_tokens: 50
    });
    
    console.log('Réponse de l\'API:');
    console.log(JSON.stringify(completion, null, 2));
    console.log('✅ Test réussi! L\'API OpenAI fonctionne correctement.');
    return true;
  } catch (error) {
    console.error('❌ ERREUR lors de la communication avec OpenAI:');
    console.error(`Type d'erreur: ${error.constructor.name}`);
    console.error(`Message: ${error.message}`);
    
    // Affiche plus de détails si disponibles
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error(`Headers: ${JSON.stringify(error.response.headers, null, 2)}`);
      console.error(`Body: ${JSON.stringify(error.response.data, null, 2)}`);
    }
    
    return false;
  }
}

// Exécuter le test
testOpenAI()
  .then(success => {
    if (success) {
      process.exit(0);
    } else {
      process.exit(1);
    }
  })
  .catch(err => {
    console.error('Erreur inattendue:', err);
    process.exit(1);
  }); 