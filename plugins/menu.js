// ╔══════════════════════════════════════════════════════════╗
// ║   TOJI FUSHIGURO BOT — PLUGINS/MENU.JS                   ║
// ╚══════════════════════════════════════════════════════════╝

require('../../settings')

const { formatUptime }   = require('../../lib/simple')
const { getStats }       = require('../../lib/database')
const { incrementStat }  = require('../../lib/database')

exports['menu'] = {
  desc:    'Ver el menú principal del bot',
  category: 'general',
  async execute({ client, m, from, isOwner }) {
    incrementStat('totalCommands')
    const stats = getStats()
    const icono = global.getRandomIconoToji()
    const p     = global.prefix

    const menu =
      `⚔️ *${global.botName}*\n` +
      `${'━'.repeat(34)}\n\n` +

      `🛠️ *HERRAMIENTAS*\n` +
      `  ${p}p / ${p}ping — Latencia + canal\n` +
      `  ${p}uptime — Tiempo activo\n` +
      `  ${p}hora — Hora y fecha\n` +
      `  ${p}info — Info del bot\n` +
      `  ${p}canal — Canal oficial\n` +
      `  ${p}toji — Imagen aleatoria\n` +
      `  ${p}frase — Frase de personaje\n` +
      `  ${p}dado [N] — Tirar dado\n` +
      `  ${p}monedaflip — Cara o cruz\n` +
      `  ${p}8ball — Oráculo\n\n` +

      `💰 *ECONOMÍA (${global.moneda})*\n` +
      `  ${p}balance — Ver saldo\n` +
      `  ${p}daily — Recompensa diaria\n` +
      `  ${p}work — Trabajar\n` +
      `  ${p}trabajos — Ver trabajos\n` +
      `  ${p}setjob <trabajo> — Elegir trabajo\n` +
      `  ${p}rob @usuario — Robar\n` +
      `  ${p}top — Ranking de ricos\n\n` +

      `⚔️ *RPG*\n` +
      `  ${p}perfil — Ver perfil\n` +
      `  ${p}rank — Ver rango\n` +
      `  ${p}entrenar — Ganar XP\n` +
      `  ${p}batalla @usuario — Pelear\n\n` +

      `👥 *GRUPOS (Admin)*\n` +
      `  ${p}kick @usuario\n` +
      `  ${p}promote @usuario\n` +
      `  ${p}demote @usuario\n` +
      `  ${p}antilink on/off\n` +
      `  ${p}welcome on/off\n` +
      `  ${p}tagall [mensaje]\n\n` +

      `${'─'.repeat(34)}\n` +
      `📡 ${global.rcanal}\n` +
      `📰 *Newsletter:* ${global.newsletterName}\n\n` +
      `⏳ Uptime: ${formatUptime(process.uptime())}\n` +
      `📊 Comandos usados: ${stats.totalCommands || 0}\n\n` +
      `_"¿Ya sabes lo que quieres? Bien."_\n— Toji Fushiguro`

    await client.sendMessage(from, {
      image:   { url: icono },
      caption: menu,
    }, { quoted: m })
  },
}

exports['help'] = exports['menu']
exports['start'] = exports['menu']
