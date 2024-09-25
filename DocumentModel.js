const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  title: String,
  content: String,
  embedding: {
    type: [Number], // Store embeddings as an array of numbers (the vector)
    index: '2dsphere', // Ensures MongoDB can efficiently query vectors
  },
});

module.exports = mongoose.model('Document', documentSchema);
