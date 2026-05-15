// ╔══════════════════════════════════════════════════════════╗
// ║        TOJI FUSHIGURO BOT — LIB/LEVELLING.JS             ║
// ╚══════════════════════════════════════════════════════════╝

const { getUser, saveUser } = require('./database')

// XP necesaria para cada nivel
function xpForLevel(level) {
  return Math.floor(100 * Math.pow(1.5, level - 1))
}

// Calcular nivel a partir de XP total
function calcLevel(xp) {
  let level = 1
  let accumulated = 0
  while (accumulated + xpForLevel(level) <= xp) {
    accumulated += xpForLevel(level)
    level++
  }
  return level
}

// Añadir XP y notificar si sube de nivel
async function addXP(jid, amount, client, chat) {
  const user     = getUser(jid)
  const oldLevel = calcLevel(user.xp || 0)
  const newXP    = (user.xp || 0) + amount
  const newLevel = calcLevel(newXP)

  saveUser(jid, { xp: newXP, level: newLevel })

  if (newLevel > oldLevel && client && chat) {
    await client.sendMessage(chat, {
      text:
        `⚔️ *¡Subiste de nivel!*\n\n` +
        `> *${jid.split('@')[0]}* llegó al nivel *${newLevel}*.\n\n` +
        `_"Sigue creciendo... quizás algún día seas digno."_\n— Toji`,
    })
  }

  return { newLevel, levelUp: newLevel > oldLevel }
}

// Rangos / títulos por nivel
function getRank(level) {
  if (level >= 50) return '⚡ Invocador Especial de Grado 1'
  if (level >= 40) return '🌀 Hechicero de Grado 1'
  if (level >= 30) return '⚔️ Cazador de Maldiciones'
  if (level >= 20) return '🗡️ Exterminador Semiprofesional'
  if (level >= 10) return '🌿 Aprendiz Prometedor'
  return '👤 Recién llegado'
}

// Barra de progreso de XP
function xpBar(xp, level, length = 10) {
  const needed   = xpForLevel(level)
  const current  = xp % needed || xp
  const progress = Math.round((current / needed) * length)
  const filled   = '█'.repeat(Math.min(progress, length))
  const empty    = '░'.repeat(Math.max(length - progress, 0))
  return `[${filled}${empty}] ${current}/${needed} XP`
}

module.exports = { xpForLevel, calcLevel, addXP, getRank, xpBar }
