const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  title: String,
  content: String,
  embedding: [Number], // To store the text embeddings
});

const Document = mongoose.model('Document', documentSchema);

module.exports = Document;