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
| `users/{uid}/rastro/save` | inventario (materiales, raros y piezas), monedas, diario, XP, planos y su nivel, fragmentos y uso hacia el siguiente nivel, herramientas y su nivel, fabricación y extracciones en curso |
| `mercado/{id}` | ofertas entre jugadores: vendedor, tipo (`mat` o `plano`), material o plano (`sierra` o, con nivel, `sierra@3`), cantidad, precio, plano pedido a cambio y estado (`abierta`, `vendida`, `cancelada`) |

Las reglas de `firestore.rules` permiten que cada jugador solo toque su partida y que en el mercado solo se pueda publicar a tu nombre, comprar ofertas abiertas de otros, retirar las tuyas y cobrar una vez.

## Juego

- **Escanear**: la IA identifica el objeto, sus materiales, las piezas que lleva (tornillos, muelles, motor, cable, bisagras, neodimio, lentes, chips, LED), su estado (nuevo, usado, desgastado, roto, antiguo) y cómo funciona. El estado cambia material, piezas, tiempo y rareza.
- **Cómo funciona**: al desmontar por completo un objeto nuevo, la IA explica cómo funciona y ganas conocimiento de su campo (queda en el Diario).
- **El maestro del taller**: consejero de IA que ve tu partida y te dice qué hacer a continuación o responde a tu pregunta.
- **Extraer**: tras escanear eliges herramientas y modo (rápida 20 % del tiempo y 30 % del material, media 50 %/60 %, completa). El tiempo depende de talla, complejidad y herramientas; sigue avanzando con la app cerrada; hasta 3 a la vez. Solo la extracción completa da planos; si el objeto es una herramienta básica de verdad, su primera extracción completa te da su plano (nunca la herramienta). Las piezas solo salen con su herramienta (destornillador: tornillos, muelles y motores; pelacables: cable; palanca: bisagras; imán: neodimio; lupa: lentes; kit: chips y LED).
- **Taller**: fabricar herramientas que dan más material, piezas o materiales raros (Cobre, Silicio, Resina, Cristal óptico); se gastan con el uso. Planos por fragmentos en extracciones completas, en la Tienda o extrayendo la herramienta real (solo las básicas). Las avanzadas (Lupa, Kit de precisión) se entienden estudiando su tecnología.
- **Niveles de herramienta**: Tosca, Fina, Precisa y Perfecta (fuerza ×1, ×1,5, ×2, ×3 en todos sus efectos: más material, más piezas, más probabilidad de raros y menos tiempo). Se fabrica tosca y se mejora en el Taller con el plano del nivel siguiente, pagando la receta ×2, ×3 o ×4; la mejorada sale con todos sus usos. Si se rompe, pierdes la herramienta y su nivel, pero los planos se quedan. Los planos superiores salen con fragmentos en extracciones completas (más en objetos complejos), en la Tienda, en el Mercado, con algunas tecnologías y con el uso: usar la herramienta de tu nivel enseña solo el plano del siguiente.
- **Taller, Inventario y Tienda agrupados**: herramientas (tuyas, para fabricar, por conseguir, avanzadas), materiales (materiales, raros, piezas) y planos (nuevos, mejoras). La descripción de cada uno se ve al pulsarlo.
- **Al instante** (Ajustes → Prototipo): extracciones, fabricación y mejoras terminan en el acto, para probar. Solo en ese dispositivo.
- **Tecnología**: árbol de 9 tecnologías en 4 niveles. Una tecnología abierta solo crece con conocimiento: la primera extracción completa de cada objeto nuevo suma su complejidad al campo que dice la IA (Mecánica, Electricidad, Óptica, Materiales, Química). Al llenarse se aprende (efectos y planos: Óptica → Lupa, Microelectrónica → Kit). Desbloquear las siguientes cuesta monedas y materiales. Observación viene abierta y crece con cualquier campo.
- **Tienda**: vender materiales, piezas y planos (la tienda paga la mitad; vendes tu plano de nivel más alto y te quedas con el anterior), comprar planos y el **Mercado** entre jugadores: se publica material o un plano por monedas, a cambio de otro plano o ambas cosas; otro jugador lo compra o cambia al momento; el vendedor cobra al abrir Rastro. Lo ofrecido queda apartado hasta que se vende o se retira.
- Todo el equilibrio (tiempos, modos, piezas, herramientas, tecnologías, precios) está en `catalogo.js`.

## Hoja de ruta
1. Cámara, identificación, tamaño y materiales (hecho)
2. Herramientas, planos, tienda y mercado entre jugadores (hecho)
3. Aceleradores, automatización y progreso offline
4. Coleccionable, logros y prestigio
