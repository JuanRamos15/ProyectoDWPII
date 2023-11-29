// Metodos
// GET "/"
// GET "/index"
const home = (req, res) => {
  res.render('home/homeView');
};
// GET "/about"
const about = (req, res) => {
  res.render('home/aboutView', { appVersion: '1.0.0' });
};

// Controlador Home
export default {
  home,
  about,
};
