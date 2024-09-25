// Usage: node index.js
import dotenv from 'dotenv';
dotenv.config();
// Import the required libraries
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HarmBlockThreshold, HarmCategory } from "@google/generative-ai";

// Create a new instance of the ChatGoogleGenerativeAI model
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

// Define the function to load the documents


// Define the function to generate the response
async function generateResponse(query) {
  try {
    
    
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
// Generate the response for the query
generateResponse("What is the estimated population of the Earth?")
  .then(response => console.log("Generated Response:", response.content))
  .catch(error => console.error(error));