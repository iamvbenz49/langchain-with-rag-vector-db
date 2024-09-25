const mongoose = require('mongoose');
const axios = require('axios');
require('dotenv').config();
const generateResponse  = require('./geminiLangchain.mjs');
const Document = require('./DocumentModel');

const hf_token = process.env.HF_TOKEN;
const embedding_url = 'https://api-inference.huggingface.co/pipeline/feature-extraction/sentence-transformers/all-MiniLM-L6-v2';

// Function to generate embedding for a given text
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

    // Ensure response is an array of embeddings
    const embeddings = response.data;
    
    // Log response for debugging purposes
    console.log("Embedding Response:", embeddings);
      return embeddings; 
    } catch (error) {
      console.error('Error generating embedding:', error.message);
      throw error;
    }
}

// Function to insert a document with embedding into the MongoDB collection
async function insertDocument() {
  const text = 'This is a sample document for RAG implementation.';

  try {
    const embeddings = await generateEmbedding(text);

    const doc = new Document({
      title: 'Sample Document',
      content: text,
      embedding: embeddings, // Store the embedding as an array
    });

    await doc.save();
    console.log('Document inserted:', doc);
  } catch (error) {
    console.error('Error inserting document:', error.message);
  }
}

// Function to retrieve similar documents using vector search
async function retrieveDocumentsByVector(queryText) {
  try {
    const queryEmbedding = await generateEmbedding(queryText);

    // Log the embedding to ensure it's an array of numbers
    console.log("Generated Embedding for Query:", queryEmbedding);

    // Ensure the embedding is an array before proceeding
    if (!Array.isArray(queryEmbedding) || queryEmbedding.length === 0) {
      throw new Error("Invalid embedding returned.");
    }

    // Perform the vector-based search
    const documents = await Document.aggregate([
      {
        $vectorSearch: {
          index: "vector_index", // specify your vector index name
          path: "embedding",     // path to the embedding field in the documents
          queryVector: queryEmbedding, // the embedding vector you're searching with
          numCandidates: 10,     // number of candidate results to consider (you can adjust this)
          limit: 5               // number of results to return (set this based on your requirement)
        }
      }
    ]);
    

    console.log('Similar documents:', documents);
    return documents;
  } catch (error) {
    console.error('Error retrieving documents by vector:', error.message);
    throw error;
  }
}

// MongoDB connection setup and example usage
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log('MongoDB connected.');

    await retrieveDocumentsByVector('This is a sample document for RAG implementation.')
    .then(
      response => console.log(content)
    )
    // generateResponse(similarDocs)
    // .then(response => console.log("Generated Response:", response.content))
    // .catch(error => console.error(error));
    // console.log('Similar documents:', similarDocs);
  })
  .catch((err) => console.error('MongoDB connection error:', err));
