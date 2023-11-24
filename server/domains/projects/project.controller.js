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

// Controlador Home
export default {
  showDashboard,
  addForm,
};
