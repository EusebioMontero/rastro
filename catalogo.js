// Catálogo de Rastro: materiales raros y herramientas (planos).
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
window.RASTRO_CAT = {
  tiempoTalla: { XS: 15, S: 30, M: 60, L: 120, XL: 240 },
  modos: [
    { id: 'rapida',   n: 'Rápida',   tiempo: 0.2, cant: 0.3, planos: false },
    { id: 'media',    n: 'Media',    tiempo: 0.5, cant: 0.6, planos: false },
    { id: 'completa', n: 'Completa', tiempo: 1,   cant: 1,   planos: true }
  ],
  maxExtr: 3,
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
      mejoras: { sierra: 2 },
      efecto: '+25 % de madera, y los fragmentos de planos de madera salen el doble. Plano de Sierra fina.' },
    { id: 'metal', n: 'Metalurgia', nivel: 2, req: ['obs'], campo: 'materiales', puntos: 5, coste: { metal: 6 }, monedas: 40,
      mejoras: { iman: 2, palanca: 2 },
      efecto: '+25 % de metal. Planos de Imán fino y Palanca fina.' },
    { id: 'elec', n: 'Electricidad', nivel: 2, req: ['obs'], campo: 'electricidad', puntos: 5, coste: { cable: 2, electronica: 3 }, monedas: 50,
      mejoras: { pelacables: 2 },
      efecto: '+1 de electrónica en aparatos y el Pelacables saca el doble de cobre. Plano de Pelacables fino.' },
    { id: 'opt', n: 'Óptica', nivel: 2, req: ['obs'], campo: 'optica', puntos: 4, coste: { vidrio: 6, plastico: 2 }, monedas: 50,
      efecto: '+25 % de vidrio. Entiendes cómo funciona una lupa: plano de la Lupa.', planos: ['lupa'] },
    { id: 'mec', n: 'Mecánica', nivel: 3, req: ['metal'], campo: 'mecanica', puntos: 6, coste: { tornillos: 6, muelle: 2 }, monedas: 60,
      mejoras: { destornillador: 2 },
      efecto: '+50 % de piezas mecánicas (tornillos, muelles, motores, bisagras) y −15 % de tiempo en aparatos complejos. Plano de Destornillador fino.' },
    { id: 'quim', n: 'Química', nivel: 3, req: ['carp'], campo: 'quimica', puntos: 4, coste: { organico: 6, resina: 1 }, monedas: 60,
      mejoras: { navaja: 2 },
      efecto: '+25 % de orgánico y la Navaja siempre saca resina. Plano de Navaja fina.' },
    { id: 'recic', n: 'Reciclaje', nivel: 3, req: ['metal', 'carp'], campo: 'materiales', puntos: 8, coste: { papel: 6, plastico: 6 }, monedas: 80,
      mejoras: { guantes: 2 },
      efecto: 'Repetir un objeto rinde menos despacio: −15 % por repetición en vez de −25 %. Plano de Guantes de trabajo finos.' },
    { id: 'micro', n: 'Microelectrónica', nivel: 4, req: ['elec', 'opt'], campo: 'electricidad', puntos: 8, coste: { cobre: 4, cable: 4, electronica: 6 }, monedas: 120,
      mejoras: { pelacables: 3 },
      efecto: '+50 % de chips y LED. Entiendes un circuito: plano del Kit de precisión y de Pelacables preciso.', planos: ['kit'] }
  ],
  piezas: [
    { id: 'tornillos', n: 'Tornillos',          herramienta: 'destornillador' },
    { id: 'muelle',    n: 'Muelles',            herramienta: 'destornillador' },
    { id: 'motor',     n: 'Motor pequeño',      herramienta: 'destornillador' },
    { id: 'cable',     n: 'Cable',              herramienta: 'pelacables' },
    { id: 'bisagra',   n: 'Bisagras',           herramienta: 'palanca' },
    { id: 'neodimio',  n: 'Imán de neodimio',   herramienta: 'iman' },
    { id: 'lente',     n: 'Lente',              herramienta: 'lupa' },
    { id: 'chip',      n: 'Chip',               herramienta: 'kit' },
    { id: 'led',       n: 'LED',                herramienta: 'kit' }
  ],
  venta: {
    madera: 2, metal: 3, plastico: 1, vidrio: 2, tela: 2, papel: 1, piedra: 1, goma: 2,
    ceramica: 2, electronica: 5, organico: 1, cuero: 3,
    cobre: 12, silicio: 20, resina: 10, cristal: 15,
    tornillos: 2, muelle: 3, motor: 25, cable: 5, bisagra: 6, neodimio: 12, lente: 10, chip: 25, led: 6
  },
  raros: [
    { id: 'cobre',   n: 'Cobre',          origen: 'Sale de la electrónica si extraes con el Pelacables.' },
    { id: 'silicio', n: 'Silicio',        origen: 'Sale de la electrónica si extraes con el Kit de precisión.' },
    { id: 'resina',  n: 'Resina',         origen: 'A veces sale de la madera o lo orgánico si extraes con la Navaja.' },
    { id: 'cristal', n: 'Cristal óptico', origen: 'A veces sale del vidrio si extraes con la Lupa.' }
  ],
  herramientas: [
    { id: 'guantes', g: 'mp', basica: true, n: 'Guantes de trabajo', precio: 0, efecto: '+20 % de todos los materiales y −10 % de tiempo.',
      frags: 0, receta: { tela: 4, cuero: 1 }, tiempo: 60, usos: 15,
      afin: ['tela', 'cuero'], claves: ['guante'], pista: 'unos guantes' },
    { id: 'sierra', g: 'f', basica: true, n: 'Sierra', precio: 40, efecto: '+50 % de madera y −20 % de tiempo en objetos de madera.',
      frags: 3, receta: { metal: 3, madera: 2 }, tiempo: 120, usos: 12,
      afin: ['madera'], claves: ['sierra', 'serrucho'], pista: 'una sierra' },
    { id: 'iman', g: 'm', basica: true, n: 'Imán', precio: 40, efecto: '+50 % de metal. Saca imanes de neodimio.',
      frags: 3, receta: { metal: 4, piedra: 1 }, tiempo: 120, usos: 12,
      afin: ['metal'], claves: ['iman'], pista: 'un imán' },
    { id: 'palanca', g: 'f', basica: true, n: 'Palanca', precio: 60, efecto: '+40 % de material y −25 % de tiempo en objetos grandes (L y XL). Saca bisagras.',
      frags: 3, receta: { metal: 6 }, tiempo: 180, usos: 10,
      afin: ['metal', 'madera', 'piedra'], claves: ['palanca', 'pata de cabra'], pista: 'una palanca' },
    { id: 'destornillador', g: 'm', basica: true, n: 'Destornillador', precio: 50, efecto: 'Saca tornillos, muelles y motores. En aparatos complejos: +2 de electrónica, +1 de metal y −25 % de tiempo.',
      frags: 3, receta: { metal: 2, plastico: 2 }, tiempo: 120, usos: 12,
      afin: ['electronica', 'plastico', 'metal'], claves: ['destornillador'], pista: 'un destornillador' },
    { id: 'navaja', g: 'f', basica: true, n: 'Navaja', precio: 45, efecto: 'De madera u orgánico, a veces saca Resina (raro).',
      frags: 3, receta: { metal: 2, madera: 1 }, tiempo: 120, usos: 12,
      afin: ['madera', 'organico'], claves: ['navaja', 'cuchillo', 'cutter'], pista: 'una navaja o un cuchillo' },
    { id: 'pelacables', g: 'm', basica: true, n: 'Pelacables', precio: 70, efecto: 'De la electrónica saca Cobre (raro). Saca cable.',
      frags: 3, receta: { metal: 3, goma: 2 }, tiempo: 180, usos: 10,
      afin: ['electronica', 'goma'], claves: ['alicate', 'pelacables', 'tenaza'], pista: 'unos alicates' },
    { id: 'lupa', g: 'f', tech: 'opt', n: 'Lupa', precio: 90, efecto: 'A veces sube un nivel la rareza del objeto; del vidrio saca Cristal óptico (raro). Saca lentes.',
      frags: 4, receta: { vidrio: 3, plastico: 1, metal: 1 }, tiempo: 180, usos: 10,
      afin: ['vidrio', 'plastico'], claves: ['lupa', 'gafas', 'lente', 'prismatico'], pista: 'una lupa o unas gafas' },
    { id: 'kit', g: 'm', tech: 'micro', n: 'Kit de precisión', precio: 150, efecto: 'De la electrónica saca Silicio (raro); el doble en aparatos muy complejos. Saca chips y LED.',
      frags: 4, receta: { cobre: 3, tornillos: 4, plastico: 2 }, tiempo: 300, usos: 8,
      afin: ['electronica'], claves: ['soldador', 'multimetro', 'placa base', 'microscopio'], pista: 'un soldador o un multímetro' }
  ]
};
