// importando mongoose
import mongoose from 'mongoose';
// Desestructurando la funcion Schema
const { Schema } = mongoose;

// Construcion de un Schema es un objeto vacio
const ProjectSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});
// copilando el schema
// genera el modelo
export default mongoose.model('project', ProjectSchema);
