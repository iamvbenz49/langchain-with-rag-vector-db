// Usage: node index.js
import dotenv from 'dotenv';
dotenv.config();
// Import the required libraries
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HarmBlockThreshold, HarmCategory } from "@google/generative-ai";

// Create a new instance of the ChatGoogleGenerativeAI model

// Define the function to load the documents


// Define the function to generate the response
export default async function generateResponse(query) {
  try {
    
    const model = new ChatGoogleGenerativeAI({
      model: "gemini-pro",
      maxOutputTokens: 2048,
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
        },
      ],
    });
    
    // Augment the query with the retrieved data
    const augmentedQuery = "hello bro";
    // Generate the response using the model
    const responses = await model.invoke([
      [
        "human",
        augmentedQuery
      ],
    ]);

    return responses;
  } catch (error) {
    console.error("Error during data retrieval or generation:", error);
    return "An error occurred while generating the response.";
  }
}



