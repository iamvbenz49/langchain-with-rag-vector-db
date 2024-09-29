import Document from '../models/DocumentModel.js';
import generateEmbedding from './generateEmbeddings.js';


export default async function retrieveDocumentsByVector(queryText) {
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
      
  
      const result = documents.map(doc => ({
        title: doc.title,
        description: doc.content
      }));
  
      return result;
    } catch (error) {
      console.error('Error retrieving documents by vector:', error.message);
      throw error;
    }
  }