// Metodos
// actions methods

// get 'project/projects'
const showDashboard = (req, res) => {
  res.render('project/addView');
};
// get 'project/add'

const addForm = (req, res) => {
  res.render('project/addView');
};

const addPost = (req, res) => {
  // Extrayendo la informacion
  // del formulario
  const { name, description } = req.body;
  // Regresando al cliente la información recabada
  res.status(200).json({
    name,
    description,
  });
};

// Controlador Home
export default {
  showDashboard,
  addForm,
  addPost,
};
