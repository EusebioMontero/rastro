# Rastro

Juego de crafteo con el mundo real: haces una foto a un objeto, una IA lo identifica y te da materiales según su tamaño y rareza.

Jugar: https://eusebiomontero.github.io/rastro/

- Una sola página (`index.html`), sin build.
- IA a elegir en Ajustes, entrando con la cuenta del propio jugador (sin copiar claves):
  - **Puter**: `puter.auth.signIn()` y `puter.ai.chat()`; cada jugador paga con su cuenta de Puter.
  - **OpenRouter**: conexión OAuth PKCE (`openrouter.ai/auth` → `/api/v1/auth/keys`); lista de modelos con visión, los gratuitos primero.
  - Avanzado: clave propia de Gemini, Claude por API u OpenAI.
- Hay que tener cuenta para jugar: pantalla de acceso con Google o correo y contraseña (registro incluido). La partida y la conexión de IA se guardan en la cuenta (Firestore).

## Cuenta de Rastro con Firebase

Proyecto: `rastro-3fa4c`. Métodos de acceso que hay que tener activados en Authentication: **Google** y **Correo electrónico/contraseña**.

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
| `users/{uid}/rastro/save` | inventario (materiales, raros y piezas), monedas, diario, XP, planos, herramientas, fabricación y extracciones en curso |
| `mercado/{id}` | ofertas entre jugadores: vendedor, material, cantidad, precio y estado (`abierta`, `vendida`, `cancelada`) |

Las reglas de `firestore.rules` permiten que cada jugador solo toque su partida y que en el mercado solo se pueda publicar a tu nombre, comprar ofertas abiertas de otros, retirar las tuyas y cobrar una vez.

## Juego

- **Escanear**: la IA identifica el objeto, sus materiales y las piezas que lleva (tornillos, muelles, motor, cable, bisagras, neodimio, lentes, chips, LED).
- **Extraer**: tras escanear eliges herramientas y modo (rápida 20 % del tiempo y 30 % del material, media 50 %/60 %, completa). El tiempo depende de talla, complejidad y herramientas; sigue avanzando con la app cerrada; hasta 3 a la vez. Solo la extracción completa da planos (y la herramienta real, la primera vez). Las piezas solo salen con su herramienta (destornillador: tornillos, muelles y motores; pelacables: cable; palanca: bisagras; imán: neodimio; lupa: lentes; kit: chips y LED).
- **Taller**: herramientas que dan más material o materiales raros (Cobre, Silicio, Resina, Cristal óptico); se gastan con el uso. Planos por fragmentos al escanear, comprándolos en la tienda, o escaneando la herramienta real (la primera vez te la llevas con su plano). El catálogo está en `catalogo.js`.
- **Tienda**: vender materiales por monedas y comprar planos.
- **Mercado**: un jugador publica una cantidad de material por un precio; otro la compra y el intercambio es inmediato. El vendedor cobra al abrir Rastro.

## Hoja de ruta
1. Cámara, identificación, tamaño y materiales (hecho)
2. Herramientas, planos, tienda y mercado entre jugadores (hecho)
3. Aceleradores, automatización y progreso offline
4. Coleccionable, logros y prestigio
