import * as Yup from 'yup';

// Crear un esquema de validación
const signUpSchema = Yup.object().shape({
  firstName: Yup.string().required('Se requiere ingresar nombre'),
  lastname: Yup.string().required('Se requiere ingresar apellido'),
  studentId: Yup.string().required('Se requiere ingresar matricula'),
  major: Yup.string().required('Se requiere ingresar carrera'),
  mail: Yup.string().email().required('Se requiere ingresar un correo valido'),
  password: Yup.string()
    .min(6)
    .required('Se requiere ingresar password de al menos 6 caracteres'),
  cpassword: Yup.string().oneOf(
    [Yup.ref('password')],
    'El password de confirmación no coincide'
  ),
});

// Middleware de extracción
const getSignUp = (req) => {
  // Desestructuramos la informacion
  const { firstName, lastname, studentId, major, mail, password, cpassword } =
    req.body; // Se regresa el objeto signup
  return {
    firstName,
    lastname,
    studentId,
    major,
    mail,
    password,
    cpassword,
  };
};

const signUp = {
  schema: signUpSchema,
  getObject: getSignUp,
};

// Modify Schema
const modifySchema = Yup.object().shape({
  firstName: Yup.string().required('Se requiere ingresar nombre'),
  lastname: Yup.string().required('Se requiere ingresar apellido'),
  studentId: Yup.string().required('Se requiere ingresar matricula'),
  major: Yup.string().required('Se requiere ingresar carrera'),
  mail: Yup.string().email().required('Se requiere ingresar un correo valido'),
});

// Middleware de extracción
const getModify = (req) => {
  // Desestructuramos la informacion
  const { firstName, lastname, studentId, major, mail } = req.body; // Se regresa el objeto signup
  return {
    firstName,
    lastname,
    studentId,
    major,
    mail,
  };
};

const modify = {
  schema: modifySchema,
  getObject: getModify,
};

// Login schema
const loginSchema = Yup.object().shape({
  mail: Yup.string().email().required('Se requiere ingresar un correo valido'),
  password: Yup.string()
    .min(6)
    .required('Se requiere ingresar password de al menos 6 caracteres'),
});

// Middleware de extracción
const getLogin = (req) => {
  // Desestructuramos la informacion
  const { mail, password } = req.body; // Se regresa el objeto signup
  return {
    mail,
    password,
  };
};

const login = {
  schema: loginSchema,
  getObject: getLogin,
};

export default { signUp, login, modify };
