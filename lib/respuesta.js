// ╔══════════════════════════════════════════════════════════╗
// ║        TOJI FUSHIGURO BOT — LIB/RESPUESTA.JS             ║
// ╚══════════════════════════════════════════════════════════╝

// Respuestas por situación con el tono de Toji Fushiguro
const respuestas = {

  // ── Saludos ──────────────────────────────────────────
  saludo: [
    '...',
    'Hmm. Qué quieres.',
    '*levanta la vista brevemente*  ¿Sí?',
    'Ya te vi. No hace falta que digas nada.',
    'Habla rápido, tengo cosas que hacer.',
  ],

  // ── Despedida ─────────────────────────────────────────
  adios: [
    'Como quieras.',
    '*ignora y se va*',
    'No te esperaba aquí mucho tiempo.',
    '...',
    'Hasta.',
  ],

  // ── Cuando alguien pierde ─────────────────────────────
  derrota: [
    'Predecible.',
    'No tienes suficiente. Vuelve cuando seas alguien.',
    'La diferencia entre nosotros es demasiado grande.',
    'Ni vale la pena comentar.',
    '...Entrenar más.',
  ],

  // ── Cuando alguien gana ───────────────────────────────
  victoria: [
    'Hmm. No estuvo mal.',
    'Empiezas a ser interesante.',
    '...Bien.',
    'Más de lo que esperaba de ti.',
    'Correcto. Ahora no te confíes.',
  ],

  // ── Cuando preguntan del bot ──────────────────────────
  sobreBot: [
    'Soy Toji Fushiguro. No necesito más presentación.',
    'Sin cursed energy... y aún así ninguno puede conmigo.',
    'El Exterminador del Cielo. Eso es todo lo que necesitas saber.',
    '¿Por qué haces preguntas innecesarias?',
  ],

  // ── Error ─────────────────────────────────────────────
  error: [
    'Algo salió mal. No es mi problema.',
    '*frunce el ceño*  Inténtalo de nuevo.',
    'Hmm. Error. Curioso.',
    '...Vuelve a intentarlo.',
  ],

  // ── Éxito ─────────────────────────────────────────────
  exito: [
    'Listo.',
    'Hecho.',
    'Como debería ser.',
    '✓',
    'Sin problemas.',
  ],

  // ── Cuando alguien es molesto ─────────────────────────
  molesto: [
    'Eso ya fue suficiente.',
    '...Cállate.',
    'No tengo paciencia para esto.',
    'Último aviso.',
    '*te mira fijo sin decir nada*',
  ],

  // ── Economía ──────────────────────────────────────────
  sinDinero: [
    `No tienes ${global.moneda || 'Zenis'}. Ni para eso alcanzas.`,
    `Sin ${global.moneda || 'Zenis'}... y sin dignidad.`,
    `Primero consigue ${global.moneda || 'Zenis'}. Luego hablas.`,
  ],

}

// Obtener respuesta aleatoria por categoría
function getRespuesta(tipo) {
  const lista = respuestas[tipo]
  if (!lista || lista.length === 0) return '...'
  return lista[Math.floor(Math.random() * lista.length)]
}

// Respuesta con nombre del usuario
function getRespuestaNombre(tipo, nombre) {
  const base = getRespuesta(tipo)
  return base.replace('{nombre}', nombre || 'tú')
}

module.exports = { getRespuesta, getRespuestaNombre, respuestas }
