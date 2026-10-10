# Rastro

Juego de crafteo con el mundo real: haces una foto a un objeto, una IA lo identifica y te da materiales según su tamaño y rareza.

Jugar: https://eusebiomontero.github.io/rastro/

- Una sola página (`index.html`), sin build.
- IA a elegir en Ajustes, entrando con la cuenta del propio jugador (sin copiar claves):
  - **Puter**: `puter.auth.signIn()` y `puter.ai.chat()`; cada jugador paga con su cuenta de Puter.
  - **OpenRouter**: conexión OAuth PKCE (`openrouter.ai/auth` → `/api/v1/auth/keys`); lista de modelos con visión, los gratuitos primero.
  - Avanzado: clave propia de Gemini, Claude por API u OpenAI.
- Sin cuenta de Rastro, la partida y el acceso a la IA se guardan en el navegador.

## Opcional: cuenta de Rastro con Firebase

Sirve para guardar la partida en la nube y llevarla a otros dispositivos. Si `config.js` vale `null`, la tarjeta de cuenta no aparece.

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
