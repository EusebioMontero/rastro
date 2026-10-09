# Rastro

Juego de crafteo con el mundo real: haces una foto a un objeto, una IA lo identifica y te da materiales según su tamaño y rareza.

Jugar: https://eusebiomontero.github.io/rastro/

- Una sola página (`index.html`), sin build.
- IA a elegir en Ajustes: Gemini (con nivel gratuito), Claude por API u OpenAI, con tu propia clave.
- Inicio de sesión con Google (Firebase). Con sesión, la clave y la partida se guardan en Firestore y solo las lee su dueño. Sin sesión, todo queda en el navegador.

## Configurar el inicio de sesión

1. Crea un proyecto en https://console.firebase.google.com (no hace falta Google Analytics).
2. **Authentication → Comenzar → Google**: actívalo.
3. **Authentication → Settings → Authorized domains**: añade `eusebiomontero.github.io`.
4. **Firestore Database → Crear base de datos** (modo producción, región `eur3` o la que prefieras).
5. **Firestore → Reglas**: pega el contenido de `firestore.rules` y publica.
6. **Configuración del proyecto → Tus apps → Web (`</>`)**: registra la app y copia el objeto `firebaseConfig` en `config.js`.

## Datos guardados

| Ruta | Contenido |
|---|---|
| `users/{uid}/rastro/config` | proveedor de IA, claves y modelos |
| `users/{uid}/rastro/save` | inventario, diario, XP y escaneos del día |

## Hoja de ruta
1. Cámara, identificación, tamaño y materiales (hecho)
2. Recetas, planos por fragmentos y cola de fabricación
3. Aceleradores, automatización y progreso offline
4. Coleccionable, logros y prestigio
