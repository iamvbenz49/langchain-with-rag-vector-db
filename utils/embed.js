const axios = require('axios');


const hf_token = "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";
const embedding_url = "https://api-inference.huggingface.co/pipeline/feature-extraction/sentence-transformers/all-MiniLM-L6-v2";
const Document = require("../models/DocumentModel")

async function generateEmbedding(text) {
  try {
    const response = await axios.post(
      embedding_url,
      { inputs: text },
      {
        headers: {
          Authorization: `Bearer ${hf_token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.status !== 200) {
      throw new Error(`Request failed with status code ${response.status}: ${response.data}`);
    }


    return response.data;
  } catch (error) {
    console.error('Error generating embedding:', error.message);
    throw error;
  }
}

async function saveEmbeddings() {
    const documents = await Document.find({});
    for (let doc of documents) {
      const embedding = await generateEmbedding(doc.content);
      doc.embedding = embedding;
      await doc.save();
    }
  }

generateEmbedding('This is a sample text for embedding.')
  .then((embedding) => {
    console.log('Embedding:', embedding);
    saveEmbeddings()
  })
  .catch((err) => {
    console.error(err);
  });





