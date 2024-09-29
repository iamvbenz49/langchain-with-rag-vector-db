import Document from '../models/DocumentModel.js';
import generateEmbedding from './generateEmbeddings.js';

export default async function insertDocument(title, content) {
    const text = 'This is a sample document for RAG implementation.';
  
    try {
      const embeddings = await generateEmbedding(content);
  
      const doc = new Document({
        title: title,
        content: content,
        embedding: embeddings, // Store the embedding as an array
      });
  
      await doc.save();
      console.log('Document inserted:', doc);
    } catch (error) {
      console.error('Error inserting document:', error.message);
    }
}