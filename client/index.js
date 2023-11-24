// cargando estilos
// eslint-disable-next-line no-console
import './styles/style.css';
// Mensaje en la Consola
/* eslint-diable */
// importando estilos de materialize
import 'materialize-css/dist/css/materialize.css';
// importando estilos de de materialize
import 'materialize-css/dist/js/materialize';
// Script para borrar proyecto
import deleteProject from './domains/project.dashboard';
/* eslint-enable */
// inicia scripts de materialize para interactividad
M.AutoInit();
// Cargando script en caso de que la URL sea '/project/dashboard'
if (window.location.pathname === '/project/showDashboard') {
  window.deleteProject = deleteProject;
}
console.log('🎉Estilos cargado Correctamente🎉');
