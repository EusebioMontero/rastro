// Configuración web de Firebase para el inicio de sesión.
// Estos valores son públicos por diseño: la seguridad la ponen las reglas de Firestore (firestore.rules).
// Mientras valga null, el juego funciona sin cuenta y guarda todo en el navegador.
window.RASTRO_FIREBASE = null;
/* Ejemplo:
window.RASTRO_FIREBASE = {
  apiKey: "...",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto",
  appId: "..."
};
*/
