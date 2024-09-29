dotenv.config();
import dotenv from 'dotenv';
dotenv.config();
import axios from 'axios';
export default async function generateEmbedding(text) {
    try {
      const response = await axios.post(
        process.env.EMBEDDING_URL,
        { inputs: text },
        {
          headers: {
            Authorization: `Bearer ${process.env.HF_TOKEN}`,
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