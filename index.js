dotenv.config();
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import express from 'express';
import insertDocument from './utils/insertDocs.js';
import retrieveDocumentsByVector from './utils/retrieveDocs.js';
import bodyParser from 'body-parser';
import generateResponse from './utils/geminiLangchain.js';
const app = express();

const hf_token = process.env.HF_TOKEN;
const embedding_url = 'https://api-inference.huggingface.co/pipeline/feature-extraction/sentence-transformers/all-MiniLM-L6-v2';

app.use(bodyParser.json());

app.post('/insert', async (req, res) => {
  const {title, description} = req.body;
  await insertDocument(title, description);
  console.log("hello")
  return res.status(200).json({message: "Done" })
})


app.post('/retrieve', async (req, res) => {
  const { query } = req.body;

  try {
    const docs = await retrieveDocumentsByVector(query);
    
    const docsString = docs.map(doc => `Title: ${doc.title}, Description: ${doc.description}`).join('\n');
    
    const combinedQuery = `Here is the list of documents:\n${docsString}\n\nAnswer based on this:\nQUERY: ${query}`;
    console.log(docsString); 

    const response = await generateResponse(combinedQuery);
 
    return res.status(200).json({ message: response });
  } catch (error) {
    console.error('Error retrieving documents:', error.message);
    return res.status(500).json({ error: 'Failed to retrieve documents.' });
  }
});



mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB connected.');
  })
  .catch((err) => console.error('MongoDB connection error:', err));

app.listen(3000)
