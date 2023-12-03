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
  borrowedBy: {
    type: String,
    ref: 'User',
  },
  startDate: {
    type: Date,
    default: Date.now,
  },
  returnDate: {
    type: Date,
    default: () => {
      // Utiliza una función para calcular la fecha de devolución
      const date = new Date();
      date.setMinutes(date.getMinutes() + 30); // Añade 30 minutos a la fecha actual
      return date;
    },
  },
});

// copilando el schema
// genera el modelo
export default mongoose.model('book', BookSchema);
