// Importando mongoose
import mongoose from 'mongoose';
// Desestructurando la funcion Schema
const { Schema } = mongoose;

// Construcion de un Schema es un objeto vacio
const BookSchema = new Schema({
  bookTitle: {
    type: String,
    required: true,
  },
  bookAuthor: {
    type: String,
    required: true,
  },
  bookCategory: {
    type: String,
    required: true,
  },
  bookISBN: {
    type: String,
    required: true,
  },
  bookQuantity: {
    type: Number,
    required: true,
  },
});

// copilando el schema
// genera el modelo
export default mongoose.model('book', BookSchema);
