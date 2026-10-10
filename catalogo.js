// Catálogo de Rastro: materiales raros y herramientas (planos).
// Se puede ajustar libremente: el juego lee todo de aquí.
//
// Herramientas:
//   frags   fragmentos de plano necesarios (0 = se conoce desde el principio)
//   receta  materiales que cuesta fabricarla
//   tiempo  segundos de fabricación
//   usos    extracciones en las que se puede usar antes de romperse
//   afin    materiales de los objetos que sueltan fragmentos de este plano
//   claves  palabras (sin tildes): si el objeto escaneado las contiene, la primera vez da la herramienta (con sus usos) y su plano
//   pista   texto para el jugador sobre qué fotografiar
//   efecto  descripción del efecto (el efecto en sí está programado en index.html)
//   precio  monedas que cuesta el plano en la tienda (cada fragmento que tengas lo abarata)
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
window.RASTRO_CAT = {
  tiempoTalla: { XS: 15, S: 30, M: 60, L: 120, XL: 240 },
  modos: [
    { id: 'rapida',   n: 'Rápida',   tiempo: 0.2, cant: 0.3, planos: false },
    { id: 'media',    n: 'Media',    tiempo: 0.5, cant: 0.6, planos: false },
    { id: 'completa', n: 'Completa', tiempo: 1,   cant: 1,   planos: true }
  ],
  maxExtr: 3,
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
    { id: 'cobre',   n: 'Cobre' },
    { id: 'silicio', n: 'Silicio' },
    { id: 'resina',  n: 'Resina' },
    { id: 'cristal', n: 'Cristal óptico' }
  ],
  herramientas: [
    { id: 'guantes', n: 'Guantes de trabajo', precio: 0, efecto: '+20 % de todos los materiales y −10 % de tiempo.',
      frags: 0, receta: { tela: 4, cuero: 1 }, tiempo: 60, usos: 15,
      afin: ['tela', 'cuero'], claves: ['guante'], pista: 'unos guantes' },
    { id: 'sierra', n: 'Sierra', precio: 40, efecto: '+50 % de madera y −20 % de tiempo en objetos de madera.',
      frags: 3, receta: { metal: 3, madera: 2 }, tiempo: 120, usos: 12,
      afin: ['madera'], claves: ['sierra', 'serrucho'], pista: 'una sierra' },
    { id: 'iman', n: 'Imán', precio: 40, efecto: '+50 % de metal. Saca imanes de neodimio.',
      frags: 3, receta: { metal: 4, piedra: 1 }, tiempo: 120, usos: 12,
      afin: ['metal'], claves: ['iman'], pista: 'un imán' },
    { id: 'palanca', n: 'Palanca', precio: 60, efecto: '+40 % de material y −25 % de tiempo en objetos grandes (L y XL). Saca bisagras.',
      frags: 3, receta: { metal: 6 }, tiempo: 180, usos: 10,
      afin: ['metal', 'madera', 'piedra'], claves: ['palanca', 'pata de cabra'], pista: 'una palanca' },
    { id: 'destornillador', n: 'Destornillador', precio: 50, efecto: 'Saca tornillos, muelles y motores. En aparatos complejos: +2 de electrónica, +1 de metal y −25 % de tiempo.',
      frags: 3, receta: { metal: 2, plastico: 2 }, tiempo: 120, usos: 12,
      afin: ['electronica', 'plastico', 'metal'], claves: ['destornillador'], pista: 'un destornillador' },
    { id: 'navaja', n: 'Navaja', precio: 45, efecto: 'De madera u orgánico, a veces saca Resina (raro).',
      frags: 3, receta: { metal: 2, madera: 1 }, tiempo: 120, usos: 12,
      afin: ['madera', 'organico'], claves: ['navaja', 'cuchillo', 'cutter'], pista: 'una navaja o un cuchillo' },
    { id: 'pelacables', n: 'Pelacables', precio: 70, efecto: 'De la electrónica saca Cobre (raro). Saca cable.',
      frags: 3, receta: { metal: 3, goma: 2 }, tiempo: 180, usos: 10,
      afin: ['electronica', 'goma'], claves: ['alicate', 'pelacables', 'tenaza'], pista: 'unos alicates' },
    { id: 'lupa', n: 'Lupa', precio: 90, efecto: 'A veces sube un nivel la rareza del objeto; del vidrio saca Cristal óptico (raro). Saca lentes.',
      frags: 4, receta: { vidrio: 3, plastico: 1, metal: 1 }, tiempo: 180, usos: 10,
      afin: ['vidrio', 'plastico'], claves: ['lupa', 'gafas', 'lente', 'prismatico'], pista: 'una lupa o unas gafas' },
    { id: 'kit', n: 'Kit de precisión', precio: 150, efecto: 'De la electrónica saca Silicio (raro); el doble en aparatos muy complejos. Saca chips y LED.',
      frags: 4, receta: { cobre: 3, tornillos: 4, plastico: 2 }, tiempo: 300, usos: 8,
      afin: ['electronica'], claves: ['soldador', 'multimetro', 'placa base', 'microscopio'], pista: 'un soldador o un multímetro' }
  ]
};
