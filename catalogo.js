// Catálogo de Rastro: materiales, reglas y la única herramienta fija (los Guantes de trabajo).
// Todos los demás planos los genera la IA para cada jugador y se guardan en su partida.
// Se puede ajustar libremente: el juego lee todo de aquí.
//
// Herramientas:
//   frags   fragmentos de plano necesarios (0 = se conoce desde el principio)
//   receta  materiales que cuesta fabricarla
//   tiempo  segundos de fabricación
//   usos    extracciones en las que se puede usar antes de romperse
//   afin    materiales de los objetos que sueltan fragmentos de este plano
//   claves  palabras (sin tildes): si el objeto escaneado las contiene, su primera extracción completa da el plano
//           (solo si la herramienta es básica; las avanzadas hay que entenderlas con su tecnología)
//   basica  true si se puede aprender fotografiando una de verdad
//   tech    tecnología que hay que estudiar antes de poder conseguir el plano (fragmentos o tienda)
//   pista   texto para el jugador sobre qué fotografiar
//   efecto  descripción del efecto (el efecto en sí está programado en index.html)
//   precio  monedas que cuesta el plano en la tienda (cada fragmento que tengas lo abarata)
//   g       género del nombre para el nivel: f, m, fp, mp ("Sierra fina", "Destornillador fino", "Guantes finos")
//
// Niveles de herramienta (nivelesHerr): Tosca, Fina, Precisa, Perfecta.
//   fuerza  multiplicador de todos los efectos de la herramienta
//   usos    multiplicador de usos al fabricarla o mejorarla
//   coste   multiplicador de la receta para mejorar a ese nivel
//   tiempo  multiplicador del tiempo de taller para mejorar a ese nivel
//   precio  multiplicador del precio del plano de ese nivel en la tienda
//   frags   fragmentos necesarios para completar el plano de ese nivel
//   porUso  usos de la herramienta del nivel anterior para aprender el plano de este nivel
//
// raros: origen = de dónde sale (se ve al pulsar el material en el Inventario).
//
// venta: monedas que paga la tienda por cada unidad de material o pieza.
//
// Extracción:
//   tiempoTalla  segundos base de una extracción completa según la talla del objeto
//                (se multiplica por 1 + 0,3 por cada nivel de complejidad por encima de 1)
//   modos        tiempo y cantidad de cada modo (solo el completo da planos)
//   maxExtr      extracciones a la vez
//
// Piezas: productos ya hechos que solo salen si llevas la herramienta indicada.
//
// Tecnologías (árbol):
//   req     tecnologías que hay que haber aprendido antes
//   coste   materiales o piezas para DESBLOQUEARLA (abrirla); sin coste ni monedas se abre sola
//   monedas monedas para desbloquearla
//   campo   campo de conocimiento que la hace crecer ('*' = cualquiera)
//   puntos  conocimiento necesario para aprenderla. Una vez abierta, solo crece con la primera
//           extracción completa de objetos nuevos de su campo (tantos puntos como su complejidad)
//   planos  planos de herramientas que regala al aprenderla
//   mejoras planos de nivel superior que regala al aprenderla ({ herramienta: nivel })
//
// Estados del objeto (los detecta la IA): multiplicadores de material, piezas y tiempo, y rareza extra.
//   efecto  descripción (el efecto en sí está programado en index.html)
//
// Objetos singulares (los detecta la IA): 0 corriente, 1 curioso, 2 antigüedad, 3 pieza de museo.
//   rareza   niveles de rareza extra (solo la pieza de museo puede llegar a Legendario)
//   epicos   materiales épicos en la primera extracción de ese objeto (se multiplica por el modo; +1 si es L o XL)
//   pEpico   probabilidad de sacarlos (1 = siempre)
//   fragSup  la primera extracción completa da seguro un fragmento, a ser posible de un plano de nivel superior
//   invento  probabilidad de que la IA invente un plano épico a partir de él (primera extracción completa)
//   xp       experiencia extra
//
// inventos: planos únicos que dibuja la IA (el maestro del taller).
//   calidad   grados de potencia: k multiplica el valor máximo de cada efecto, efectos = cuántos como mucho, usos = usos máximos
//   encargos  pedir un plano al maestro: el tiempo que le das decide la calidad; nivel = nivel del jugador (y del maestro) para poder encargarlo
//   objeto    calidad de los que inventa solo al desmontar objetos nuevos
//   subirNivel calidad del plano que descubre el maestro cada vez que subes de nivel
//   epico     calidad de los que inspiran las antigüedades y piezas de museo
//
// epicos: materiales épicos. de = materiales del objeto de los que sale (se elige el que más pese).
window.RASTRO_CAT = {
  inventos: {
    calidad: [
      { n: 'Básico',    k: 0.5,  efectos: 1, usos: 10 },
      { n: 'Sencillo',  k: 0.75, efectos: 1, usos: 12 },
      { n: 'Bueno',     k: 1,    efectos: 2, usos: 15 },
      { n: 'Excelente', k: 1.25, efectos: 2, usos: 20 },
      { n: 'Épico',     k: 1.5,  efectos: 3, usos: 25 }
    ],
    encargos: [
      { n: 'Un rato',  tiempo: 900,   calidad: 0, nivel: 1 },
      { n: '1 hora',   tiempo: 3600,  calidad: 1, nivel: 1 },
      { n: '4 horas',  tiempo: 14400, calidad: 2, nivel: 3 },
      { n: '12 horas', tiempo: 43200, calidad: 3, nivel: 6 }
    ],
    objeto: 2, subirNivel: 0, epico: 4,
    // Planos misteriosos: el primer fragmento abre uno inspirado en el objeto; al juntar 'frags' la IA lo dibuja.
    //   calidad según la rareza más alta de los objetos que dieron sus fragmentos (Común … Legendario)
    misterio: { frags: 3, calidad: [1, 1, 2, 3, 3] },
    // Desmontar por completo una herramienta de verdad: la IA dibuja su plano con esta calidad
    herramientaReal: 2,
    // Planos que vende la tienda (la IA los dibuja al comprarlos)
    tienda: [ { calidad: 1, precio: 80 }, { calidad: 2, precio: 200 }, { calidad: 3, precio: 450 } ],
    // Cuántos planos de la IA puedes tener a la vez
    max: 40
  },
  tiempoTalla: { XS: 15, S: 30, M: 60, L: 120, XL: 240 },
  modos: [
    { id: 'rapida',   n: 'Rápida',   tiempo: 0.2, cant: 0.3, planos: false },
    { id: 'media',    n: 'Media',    tiempo: 0.5, cant: 0.6, planos: false },
    { id: 'completa', n: 'Completa', tiempo: 1,   cant: 1,   planos: true }
  ],
  maxExtr: 3,
  // Fragmentos de plano al escanear (extracción completa): probabilidad según la rareza del objeto
  //   prob      Común, Poco común, Raro, Épico, Legendario
  //   repetido  multiplicador si ese objeto ya lo habías desmontado antes
  fragmentos: { prob: [0.1, 0.18, 0.28, 0.42, 0.6], repetido: 0.5 },
  nivelesHerr: [
    { n: 'Tosca',    fuerza: 1,   usos: 1,   coste: 1, tiempo: 1, precio: 1 },
    { n: 'Fina',     fuerza: 1.5, usos: 1.5, coste: 2, tiempo: 2, precio: 2, frags: 3, porUso: 8 },
    { n: 'Precisa',  fuerza: 2,   usos: 2,   coste: 3, tiempo: 3, precio: 4, frags: 4, porUso: 15 },
    { n: 'Perfecta', fuerza: 3,   usos: 3,   coste: 4, tiempo: 4, precio: 8, frags: 5, porUso: 25 }
  ],
  campos: { mecanica: 'Mecánica', electricidad: 'Electricidad', optica: 'Óptica', materiales: 'Materiales', quimica: 'Química' },
  estados: {
    nuevo:      { n: 'Nuevo',      mat: 1,    piezas: 1,   tiempo: 1.1, rareza: 0, desc: 'Intacto: cuesta algo más desmontarlo.' },
    usado:      { n: 'Usado',      mat: 1,    piezas: 1,   tiempo: 1,   rareza: 0, desc: '' },
    desgastado: { n: 'Desgastado', mat: 0.85, piezas: 1,   tiempo: 0.9, rareza: 0, desc: 'Algo menos de material.' },
    roto:       { n: 'Roto',       mat: 0.7,  piezas: 1.3, tiempo: 0.7, rareza: 0, desc: 'Menos material, pero las piezas salen solas y más rápido.' },
    antiguo:    { n: 'Antiguo',    mat: 1,    piezas: 1,   tiempo: 1.2, rareza: 1, desc: '+1 de rareza.' }
  },
  tecnologias: [
    { id: 'obs', n: 'Observación', nivel: 1, req: [], campo: '*', puntos: 3, coste: {}, monedas: 0,
      efecto: 'Te fijas en cómo están hechas las cosas: +10 % de todos los materiales.' },
    { id: 'carp', n: 'Carpintería', nivel: 2, req: ['obs'], campo: 'materiales', puntos: 4, coste: { madera: 6 }, monedas: 30,
      inventa: 2, efecto: '+25 % de madera. La IA te dibuja un plano de carpintería.' },
    { id: 'metal', n: 'Metalurgia', nivel: 2, req: ['obs'], campo: 'materiales', puntos: 5, coste: { metal: 6 }, monedas: 40,
      inventa: 2, efecto: '+25 % de metal. La IA te dibuja un plano de metalurgia.' },
    { id: 'elec', n: 'Electricidad', nivel: 2, req: ['obs'], campo: 'electricidad', puntos: 5, coste: { cable: 2, electronica: 3 }, monedas: 50,
      inventa: 2, efecto: '+1 de electrónica en aparatos y el doble de cobre cuando lo sacas. La IA te dibuja un plano eléctrico.' },
    { id: 'opt', n: 'Óptica', nivel: 2, req: ['obs'], campo: 'optica', puntos: 4, coste: { vidrio: 6, plastico: 2 }, monedas: 50,
      inventa: 2, efecto: '+25 % de vidrio. La IA te dibuja un plano de óptica.' },
    { id: 'mec', n: 'Mecánica', nivel: 3, req: ['metal'], campo: 'mecanica', puntos: 6, coste: { tornillos: 6, muelle: 2 }, monedas: 60,
      inventa: 2, efecto: '+50 % de piezas mecánicas (tornillos, muelles, motores, bisagras) y −15 % de tiempo en aparatos complejos. La IA te dibuja un plano mecánico.' },
    { id: 'quim', n: 'Química', nivel: 3, req: ['carp'], campo: 'quimica', puntos: 4, coste: { organico: 6, resina: 1 }, monedas: 60,
      inventa: 2, efecto: '+25 % de orgánico y los planos que sacan resina la sacan siempre. La IA te dibuja un plano de química.' },
    { id: 'recic', n: 'Reciclaje', nivel: 3, req: ['metal', 'carp'], campo: 'materiales', puntos: 8, coste: { papel: 6, plastico: 6 }, monedas: 80,
      mejoras: { guantes: 2 },
      efecto: 'Repetir un objeto rinde menos despacio: −15 % por repetición en vez de −25 %. Plano de Guantes de trabajo finos.' },
    { id: 'micro', n: 'Microelectrónica', nivel: 4, req: ['elec', 'opt'], campo: 'electricidad', puntos: 8, coste: { cobre: 4, cable: 4, electronica: 6 }, monedas: 120,
      inventa: 3, efecto: '+50 % de chips y LED. La IA te dibuja un plano excelente de microelectrónica.' }
  ],
  piezas: [
    { id: 'tornillos', n: 'Tornillos' },
    { id: 'muelle',    n: 'Muelles' },
    { id: 'motor',     n: 'Motor pequeño' },
    { id: 'cable',     n: 'Cable' },
    { id: 'bisagra',   n: 'Bisagras' },
    { id: 'neodimio',  n: 'Imán de neodimio' },
    { id: 'lente',     n: 'Lente' },
    { id: 'chip',      n: 'Chip' },
    { id: 'led',       n: 'LED' }
  ],
  venta: {
    madera: 2, metal: 3, plastico: 1, vidrio: 2, tela: 2, papel: 1, piedra: 1, goma: 2,
    ceramica: 2, electronica: 5, organico: 1, cuero: 3,
    cobre: 12, silicio: 20, resina: 10, cristal: 15,
    bronce: 40, madnoble: 35, esmalte: 35, baquelita: 30,
    tornillos: 2, muelle: 3, motor: 25, cable: 5, bisagra: 6, neodimio: 12, lente: 10, chip: 25, led: 6
  },
  raros: [
    { id: 'cobre',   n: 'Cobre',          origen: 'Sale de la electrónica con planos que saquen cobre.' },
    { id: 'silicio', n: 'Silicio',        origen: 'Sale de la electrónica con planos que saquen silicio.' },
    { id: 'resina',  n: 'Resina',         origen: 'Sale de la madera o lo orgánico con planos que saquen resina.' },
    { id: 'cristal', n: 'Cristal óptico', origen: 'Sale del vidrio con planos que saquen cristal óptico.' }
  ],
  epicos: [
    { id: 'bronce',    n: 'Bronce antiguo', de: ['metal', 'electronica'],
      origen: 'Épico. Sale del metal de objetos singulares: antigüedades y piezas de museo.' },
    { id: 'madnoble',  n: 'Madera noble',   de: ['madera', 'organico', 'cuero', 'papel', 'tela'],
      origen: 'Épico. Sale de la madera y las fibras naturales de objetos singulares.' },
    { id: 'esmalte',   n: 'Esmalte',        de: ['ceramica', 'vidrio', 'piedra'],
      origen: 'Épico. Sale de la cerámica, el vidrio o la piedra de objetos singulares.' },
    { id: 'baquelita', n: 'Baquelita',      de: ['plastico', 'goma'],
      origen: 'Épico. El plástico de los objetos de época: sale de objetos singulares.' }
  ],
  singular: [
    { n: 'Corriente' },
    { n: 'Objeto curioso', rareza: 1, epicos: 1, pEpico: 0.35, fragSup: false, invento: 0,   xp: 5,
      desc: 'Objeto poco frecuente o de colección: +1 de rareza y a veces un material épico la primera vez.' },
    { n: 'Antigüedad',  rareza: 2, epicos: 1, pEpico: 1,    fragSup: true,  invento: 0.5, xp: 10,
      desc: 'Antigüedad de verdad: +2 de rareza, un material épico la primera vez, un fragmento de plano seguro y la mitad de las veces un plano épico.' },
    { n: 'Pieza de museo', rareza: 3, epicos: 3, pEpico: 1,    fragSup: true,  invento: 1,   xp: 20,
      desc: 'Pieza de museo: puede ser Legendaria, da varios materiales épicos la primera vez, un fragmento de plano seguro y siempre un plano épico.' }
  ],
  herramientas: [
    { id: 'guantes', g: 'mp', basica: true, n: 'Guantes de trabajo', precio: 0, efecto: '+20 % de todos los materiales y −10 % de tiempo.',
      frags: 0, receta: { tela: 4, cuero: 1 }, tiempo: 60, usos: 15,
      afin: ['tela', 'cuero'] }
  ]
};
