// Importando biblioteca de validacion
import * as Yup from 'yup';

// Creando un esquema de validación para el proyecto
const projectSchema = Yup.object().shape({
  name: Yup.string().required('Se requiere un nombre de proyecto'),
  description: Yup.string()
    .max(500, 'No escribir mas de 500 caracteres')
    .required('Se requiere una descripción del proyecto'),
});

// middleware de extraccion
const getProject = (req) => {
  // extrayendo datos de la peticion
  const { name, description } = req.body;
  return {
    name,
    description,
  };
};
// exportamos
export default {
  projectSchema,
  getProject,
};
