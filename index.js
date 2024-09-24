const mongoose = require('mongoose');
const axios = require('axios');
require("dotenv").config();


const Document = require("./DocumentModel");


const hf_token = process.env.HF_TOKEN; 
const embedding_url = "https://api-inference.huggingface.co/pipeline/feature-extraction/sentence-transformers/all-MiniLM-L6-v2";

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

async function insertDocument() {
  const text = 'This is a sample document for RAG implementation.';
  
  try {

    const embeddings = await generateEmbedding(text);

   
    const doc = new Document({
      title: 'Sample Document',
      content: text,
      embedding: embeddings, // Store the generated embeddings
    });

    await doc.save();
    console.log('Document inserted:', doc);
  } catch (error) {
    console.error('Error inserting document:', error.message);
  }
}

async function retrieveDocuments(query) {
  const documents = await Document.find({
    content: { $regex: query, $options: 'i' },
  });
  return documents;
}

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB connected.");
    insertDocument();
  })
  .catch((err) => console.error("MongoDB connection error:", err));
