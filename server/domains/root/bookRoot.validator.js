// Importando biblioteca de validacion
import * as Yup from 'yup';

// Creando un esquema de validación para el proyecto
const bookRootSchema = Yup.object().shape({
  bookTitle: Yup.string().required('Se requiere un nombre de libro'),
  bookAuthor: Yup.string().required('Se requiere un autor del libro'),
  bookCategory: Yup.string().required('Se requiere una categoria del libro'),
  bookISBN: Yup.string().required('Se requiere un ISBN del libro'),
  bookQuantity: Yup.number().required('Se requiere una cantidad del libro'),
});

// middleware de extraccion
const getBook = (req) => {
  // extrayendo datos de la peticion
  const { bookTitle, bookAuthor, bookCategory, bookISBN, bookQuantity } =
    req.body;
  return {
    bookTitle,
    bookAuthor,
    bookCategory,
    bookISBN,
    bookQuantity,
  };
};

const submitBook = {
  schema: bookRootSchema,
  getObject: getBook,
};

export default {
  submitBook,
};
