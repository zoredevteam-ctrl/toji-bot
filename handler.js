// ╔══════════════════════════════════════════════════════════╗
// ║        TOJI FUSHIGURO BOT — HANDLER.JS                   ║
// ╚══════════════════════════════════════════════════════════╝

require('./settings')

const fs   = require('fs-extra')
const path = require('path')

// ── Cargar todos los plugins ──────────────────────────────
const plugins = {}
const pluginDir = path.join(__dirname, 'plugins/index')

fs.readdirSync(pluginDir)
  .filter(f => f.endsWith('.js'))
  .forEach(file => {
    try {
      const plug = require(path.join(pluginDir, file))
      Object.assign(plugins, plug)
    } catch (e) {
      console.error(`[HANDLER] Error cargando plugin ${file}:`, e.message)
    }
  })

// ── Cooldown map ──────────────────────────────────────────
const cooldowns = new Map()

// ── Handler principal ─────────────────────────────────────
async function handler(client, m, store) {
  if (!m) return
  if (m.key?.remoteJid === 'status@broadcast') return

  const from    = m.key.remoteJid
  const isGroup = from.endsWith('@g.us')
  const sender  = isGroup ? m.key.participant : from
  const body    = (
    m.message?.conversation ||
    m.message?.extendedTextMessage?.text ||
    m.message?.imageMessage?.caption ||
    m.message?.videoMessage?.caption ||
    ''
  ).trim()

  const isOwner = global.owner.includes(sender?.replace('@s.whatsapp.net', ''))
  const prefix  = global.prefix

  // Ignorar si no empieza con prefijo
  if (!body.startsWith(prefix)) return

  const args    = body.slice(prefix.length).trim().split(/ +/)
  const command = args.shift().toLowerCase()

  // ── Mantenimiento ─────────────────────────────────────
  if (global.maintenance && !isOwner) {
    return client.sendMessage(from, { text: global.maintenanceMsg }, { quoted: m })
  }

  // ── Anti-spam / cooldown ──────────────────────────────
  const now      = Date.now()
  const cdKey    = `${sender}-${command}`
  const lastUsed = cooldowns.get(cdKey) || 0

  if (now - lastUsed < 3000 && !isOwner) {
    return client.sendMessage(from, {
      text: `⏳ Espera un momento antes de usar *${prefix}${command}* de nuevo.`,
    }, { quoted: m })
  }
  cooldowns.set(cdKey, now)

  // ── Buscar y ejecutar plugin ──────────────────────────
  const plugin = plugins[command]

  if (!plugin) {
    return client.sendMessage(from, {
      text: `❌ Comando *${prefix}${command}* no encontrado.\nUsa *${prefix}menu* para ver los disponibles.`,
    }, { quoted: m })
  }

  // Verificar si requiere owner
  if (plugin.ownerOnly && !isOwner) {
    return client.sendMessage(from, {
      text: `🔒 Solo el dueño puede usar este comando.\n_"Conoce tu lugar."_`,
    }, { quoted: m })
  }

  // Verificar si requiere grupo
  if (plugin.groupOnly && !isGroup) {
    return client.sendMessage(from, {
      text: `👥 Este comando solo funciona en grupos.`,
    }, { quoted: m })
  }

  // Verificar si requiere privado
  if (plugin.privateOnly && isGroup) {
    return client.sendMessage(from, {
      text: `💬 Este comando solo funciona en privado.`,
    }, { quoted: m })
  }

  // Ejecutar
  try {
    await plugin.execute({ client, m, from, sender, args, body, isOwner, isGroup, store })
  } catch (err) {
    console.error(`[HANDLER] Error en comando "${command}":`, err.message)
    await client.sendMessage(from, {
      text: `⚠️ Error ejecutando *${prefix}${command}*.\n_${err.message}_`,
    }, { quoted: m })
  }
}

module.exports = { handler, plugins }
