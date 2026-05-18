// ╔══════════════════════════════════════════════════════════╗
// ║        TOJI FUSHIGURO BOT — LIB/RESPUESTA.JS             ║
// ║     Desarrollado por Aarom — Estética Premium            ║
// ╚══════════════════════════════════════════════════════════╝

const respuestas = {

  // ── Saludos ──────────────────────────────────────────
  saludo: [
    '...',
    'Hmm. Qué quieres, *{nombre}*. Habla rápido, mi tiempo cuesta Zenis.',
    '¿Tienes un encargo serio para mí o solo vienes a estorbar?',
    'No siento energía maldita en ti... eres insignificante. ¿Qué buscas?',
    'Deja de mirarme, *{nombre}*, y suelta el mensaje de una vez.',
  ],

  // ── Despedida ─────────────────────────────────────────
  adios: [
    'Como quieras. Tengo una apuesta de carreras que atender.',
    'Ya me aburrí. No me busques a menos que tengas efectivo.',
    'Consigue algo de valor antes de volver a hablarme, *{nombre}*.',
    'Me largo.',
    '... Ya era hora.',
  ],

  // ── Cuando alguien pierde ─────────────────────────────
  derrota: [
    'Predecible. No tienes el talento ni la fuerza, mocoso.',
    '¿Eso fue todo? Ni siquiera tuve que sacar una herramienta maldita.',
    'La Restricción Celestial es absoluta. Nunca tuviste oportunidad contra mí.',
    'Qué patético, *{nombre}*. Vuelve cuando valga la pena gastar mis energías.',
    '... Entrena más. Das lástima.',
  ],

  // ── Cuando alguien gana ───────────────────────────────
  victoria: [
    'Hmm. No estuvo mal para alguien de tu nivel, *{nombre}*.',
    'Tienes buenos reflejos. Quizás sirvas para un trabajo real más adelante.',
    'Ganaste esta vez. No dejes que se te suba a la cabeza, mocoso.',
    'Correcto. Al menos sabes cómo moverte bajo presión.',
  ],

  // ── Cuando preguntan del bot ──────────────────────────
  sobreBot: [
    'Soy *Toji Fushiguro*. El Asesino de Hechiceros. No necesitas saber nada más.',
    'Cero energía maldita, pero puedo aplastar a cualquiera de tus ídolos si el pago es correcto.',
    'Hago trabajos por contrato bajo las órdenes de Aarom. Si hay dinero, el objetivo desaparece.',
    '¿Por qué haces preguntas innecesarias? Muéstrame los Zenis.',
  ],

  // ── Error ─────────────────────────────────────────────
  error: [
    'Algo salió mal con el sistema. Qué molestia... arréglalo tú mismo.',
    'La herramienta se rompió. Inténtalo de nuevo antes de que pierda la paciencia.',
    'Hmm... un fallo. Ve a quejarte con mi programador, yo solo me encargo de ejecutar las órdenes.',
  ],

  // ── Éxito ─────────────────────────────────────────────
  exito: [
    'Trabajo terminado. Así de fácil.',
    'Hecho. Espero mi comisión.',
    'Contrato cumplido sin dejar rastro.',
    'Listo. Siguiente objetivo.',
  ],

  // ── Cuando alguien es molesto ─────────────────────────
  molesto: [
    'Estás colmando mi paciencia, *{nombre}*. Cállate de una vez.',
    'Un comentario estúpido más y te convierto en mi próximo encargo.',
    'No me pagan lo suficiente para aguantar tus idioteces.',
    '*Te mira fijamente apoyado en la pared, jugando con una navaja.* Último aviso.',
  ],

  // ── Economía ──────────────────────────────────────────
  sinDinero: [
    '¿Cero Zenis? No trabajo por caridad, *{nombre}*. Largo de aquí.',
    'Sin dinero no hay contrato. Consigue fondos si quieres que te escuche.',
    'Qué pobreza... Ni para los cigarros te alcanza. Vuelve cuando tengas efectivo.',
  ],
}

// ── Obtener respuesta aleatoria por categoría ─────────────
export function getRespuesta(tipo) {
  const lista = respuestas[tipo]
  if (!lista || lista.length === 0) return '...'
  return lista[Math.floor(Math.random() * lista.length)]
}

// ── Respuesta con nombre del usuario ──────────────────────
export function getRespuestaNombre(tipo, nombre) {
  return getRespuesta(tipo).replace(/{nombre}/g, nombre || 'mocoso')
}

// ── Función dfail optimizada al estilo de Toji ─────────────
export function dfail(type, m, conn) {
  const msgs = {
    owner:    '> 🩸 *[ CONTRATO EXCLUSIVO ]*\n> *Esa orden solo la puede dar mi jefe (Aarom). Tú no tienes ese nivel.*',
    rowner:   '> 🩸 *[ ACCESO RAÍZ UNICO ]*\n> *Solo el propietario absoluto del sistema puede autorizar este movimiento.*',
    mods:     '> ⚔️ *[ PERMISO INSUFICIENTE ]*\n> *Solo los moderadores del clan tienen permitido solicitar este tipo de trabajo.*',
    premium:  '> 🪙 *[ PAGO REQUERIDO ]*\n> *No muevo un dedo gratis. Este comando requiere una suscripción Premium.*',
    admin:    '> ⚔️ *[ FALTA DE RANGO ]*\n> *No eres administrador. No recibo órdenes de subordinados en este grupo.*',
    botAdmin: '> ⚔️ *[ MANOS ATADAS ]*\n> *Necesito rango de administrador aquí para poder ejecutar el trabajo limpiamente.*',
    group:    '> 🌿 *[ ENTORNO ERRÓNEO ]*\n> *Este encargo es a gran escala. Solo funciona dentro de un grupo.*',
    private:  '> 🔒 *[ TRATO SECRETO ]*\n> *Este contrato es confidencial. Háblame al privado (MD) si quieres hablar de negocios.*',
    unreg:    '> 𝔖 *[ IDENTIDAD DESCONOCIDA ]*\n> *¿Y tú quién eres? Regístrate primero usando el comando antes de pedirme favores.*',
  }
  const text = msgs[type] || '> ⚔️ *No tienes el nivel ni el dinero para usar esto.*'
  conn.sendMessage(m.chat, { text }, { quoted: m }).catch(() => {})
}

export default { getRespuesta, getRespuestaNombre, dfail, respuestas }
