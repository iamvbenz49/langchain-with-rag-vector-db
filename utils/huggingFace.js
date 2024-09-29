const { HuggingFaceInference } = require("langchain/llms");
const { HfInference } = require("@huggingface/inference");

// Initialize the Hugging Face Inference
const hf = new HfInference(process.env.HF_TOKEN);

// Create a model instance
const model = new HuggingFaceInference(hf, {
    model: "google/gemma-2-2b-it",
});

// Define the input data
const inputData = { inputs: "Can you please let us know more details about your " };

// Query the model
async function query(data) {
    try {
        const response = await model.call(data);
        console.log(JSON.stringify(response));
    } catch (error) {
        console.error("Error querying the model:", error);
    }
}

// Call the query function
query(inputData);
