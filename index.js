import './settings.js'
import chalk from 'chalk'
import pino from 'pino'
import qrcode from 'qrcode-terminal'
import fs from 'fs'
import path from 'path'
import readlineSync from 'readline-sync'
import { fileURLToPath } from 'url'
import {
  Browsers,
  makeWASocket,
  makeCacheableSignalKeyStore,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  jidDecode,
  DisconnectReason
} from '@whiskeysockets/baileys'
import { handler } from './handler.js'
import { database } from './lib/database.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const pluginsDir = path.join(__dirname, 'plugins')
global.conns = []

// ─── LOGGER TOJI STYLE ────────────────────────────────────────────────────────
const log = {
  info:    msg => console.log(chalk.bgHex('#4E5D6C').black.bold('  INFO  ')   + ' ' + chalk.white(msg)),
  success: msg => console.log(chalk.bgHex('#8B5CF6').black.bold(' SUCCESS ') + ' ' + chalk.hex('#E2E8F0').bold(msg)),
  warn:    msg => console.log(chalk.bgHex('#F59E0B').black.bold('  WARN  ')  + ' ' + chalk.yellow(msg)),
  error:   msg => console.log(chalk.bgHex('#EF4444').white.bold('  ERROR ')    + ' ' + chalk.redBright(msg))
}

// ─── PALETA MERCENARIA (TOJI FUSHIGURO) ────────────────────────────────────────
const cSteel  = chalk.hex('#4E5D6C') // Gris Acero Oscuro
const cSilver = chalk.hex('#E2E8F0') // Plata Brillante
const cCurse  = chalk.hex('#8B5CF6') // Púrpura Energía Maldita
const cBlood  = chalk.hex('#EF4444') // Rojo Restricción Celestial
const cDark   = chalk.hex('#1F2937') // Carbón de fondo

// ─── BANNER PREMIUM AKIRAX ────────────────────────────────────────────────────
const tojiBanner = `
${cSteel('┌──────────────────────────────────────────────────────────────┐')}
${cSteel('│')}  ${cCurse('████████╗ ██████╗  ██████╗██╗')}                                ${cSteel('│')}
${cSteel('│')}  ${cCurse('╚══██╔══╝██╔═══██╗     ██║██║')}                                ${cSteel('│')}
${cSteel('│')}  ${cSilver('   ██║   ██║   ██║     ██║██║')}   ${cBlood('M E R C E N A R Y')}          ${cSteel('│')}
${cSteel('│')}  ${cSilver('   ██║   ██║   ██║██   ██║██║')}   ${cSilver('S Y S T E M')}              ${cSteel('│')}
${cSteel('│')}  ${cSteel('   ██║   ╚██████╔╝╚█████╔╝██║')}                                ${cSteel('│')}
${cSteel('│')}  ${cSteel('   ╚═╝    ╚═════╝  ╚════╝ ╚═╝')}                                ${cSteel('│')}
${cSteel('│')}                                                              ${cSteel('│')}
${cSteel('│')}  ${cSilver('⚔️  F U S H I G U R O   M U L T I D E V I C E   E D I T I O N')}   ${cSteel('│')}
${cSteel('│')}  ${cSteel('──────────────────────────────────────────────────────────────')} ${cSteel('│')}
${cSteel('│')}  ${cSilver.bold('  ˚₊· ͟͟͞͞  A D R I E N  |  Z0RT SYSTEMS        ')}                  ${cSteel('│')}
${cSteel('│')}  ${chalk.gray('  Version: ' + (global.botVersion || '1.0.0') + '  |  Sorcerer Killer Core     ')}         ${cSteel('│')}
${cSteel('└──────────────────────────────────────────────────────────────┘')}
`

// ─── CARGA DE PLUGINS ─────────────────────────────────────────────────────────
const plugins = new Map()

async function loadPlugins() {
  if (!fs.existsSync(pluginsDir)) fs.mkdirSync(pluginsDir, { recursive: true })
  const files = fs.readdirSync(pluginsDir).filter(f => f.endsWith('.js'))
  for (const file of files) {
    try {
      const filePath = path.resolve(pluginsDir, file)
      const plugin   = (await import(`file://${filePath}?t=${Date.now()}`)).default
      if (plugin) {
        plugins.set(file, plugin)
        log.success(`Cargado: ${file}`)
      }
    } catch (e) {
      log.error(`Error en ${file}: ${e.message}`)
    }
  }
}

// ─── SESIÓN ───────────────────────────────────────────────────────────────────
global.sessionName = './Sessions/Owner'
if (!fs.existsSync(global.sessionName)) fs.mkdirSync(global.sessionName, { recursive: true })

const methodCodeQR = process.argv.includes('--qr')
const methodCode   = process.argv.includes('--code')

let opcion      = ''
let phoneNumber = ''

// ─── BOT ──────────────────────────────────────────────────────────────────────
async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState(global.sessionName)
  const { version }          = await fetchLatestBaileysVersion()

  if (!methodCodeQR && !methodCode && !state.creds.registered && !opcion) {
    console.clear()
    console.log(tojiBanner)
    console.log(cCurse.bold('✦ SELECCIONA TU MÉTODO DE VINCULACIÓN:\n'))
    console.log(cSteel('   [ 1 ]') + cSilver(' Código QR'))
    console.log(cSteel('   [ 2 ]') + cSilver(' Código de 8 dígitos'))
    opcion = readlineSync.question(chalk.bold.yellow('\n ─── ✦ Elige una opción (1 o 2): ')).trim()

    if (opcion === '2') {
      phoneNumber = readlineSync
        .question(cCurse('\n ✦ Ingresa tu número (ej: 57310...): '))
        .replace(/\D/g, '')
    }
  }

  const conn = makeWASocket({
    version,
    logger: pino({ level: 'silent' }),
    printQRInTerminal: false,
    browser: Browsers.ubuntu('Chrome'),
    auth: {
      creds: state.creds,
      keys:  makeCacheableSignalKeyStore(state.keys, pino({ level: 'silent' }))
    },
    markOnlineOnConnect:            true,
    generateHighQualityLinkPreview: true,
    getMessage: async () => ({ conversation: 'Toji Fushiguro Core System.' })
  })

  global.conn = conn

  conn.decodeJid = jid => {
    if (!jid) return jid
    const decode = jidDecode(jid) || {}
    return (decode.user && decode.server) ? `${decode.user}@${decode.server}` : jid
  }

  conn.ev.on('creds.update', saveCreds)

  if ((opcion === '2' || methodCode) && !state.creds.registered) {
    setTimeout(async () => {
      try {
        const code      = await conn.requestPairingCode(phoneNumber)
        const formatted = code?.match(/.{1,4}/g)?.join('-') || code
        console.log(
          chalk.bgHex('#8B5CF6').black.bold('\n ✦ TU CÓDIGO: ') +
          chalk.bgBlack.white.bold(` ${formatted} `) +
          '\n'
        )
      } catch (e) {
        log.error(`No se pudo obtener el código: ${e.message}`)
      }
    }, 3000)
  }

  // ─── EVENTO: CONEXIÓN ─────────────────────────────────────────────────────
  conn.ev.on('connection.update', async update => {
    const { qr, connection, lastDisconnect } = update

    if (qr && (opcion === '1' || methodCodeQR)) {
      console.log(cCurse('\n ✦ Escanea este código QR:'))
      qrcode.generate(qr, { small: true })
    }

    if (connection === 'open') {
      log.success(`Online: ${conn.user?.name || 'Toji Fushiguro Bot'} ✓`)
    }

    if (connection === 'close') {
      const statusCode = lastDisconnect?.error?.output?.statusCode
      const reason     = lastDisconnect?.error?.message || 'Desconocido'

      if (statusCode !== DisconnectReason.loggedOut) {
        log.warn(`Reconectando... (razón: ${reason})`)
        startBot()
      } else {
        log.error('Sesión cerrada. Borra la carpeta Sessions para re-vincular.')
      }
    }
  })

  // ─── EVENTO: PARTICIPANTES DE GRUPO ──────────────────────────────────────
  conn.ev.on('group-participants.update', async (anu) => {
    try {
      for (const [, plugin] of plugins) {
        if (typeof plugin?.participantsUpdate === 'function') {
          try {
            await plugin.participantsUpdate(conn, anu, database.data)
          } catch (e) {
            console.error('[PARTICIPANTS PLUGIN ERROR]', e.message)
          }
        }
      }
    } catch (err) {
      log.error(`group-participants.update: ${err.message}`)
    }
  })

  // ─── EVENTO: MENSAJES ────────────────────────────────────────────────────
  conn.ev.on('messages.upsert', async ({ messages, type }) => {
    if (type !== 'notify') return
    const m = messages[0]
    if (!m?.message) return
    const jid = m.key?.remoteJid || ''
    if (jid === 'status@broadcast') return
    if (jid.endsWith('@newsletter')) return
    try {
      await handler(m, conn, plugins)
    } catch (e) {
      log.error(`handler: ${e.message}`)
    }
  })
}

// ─── ARRANQUE ─────────────────────────────────────────────────────────────────
;(async () => {
  await database.read()

  if (database.data?.settings?.prefix) global.prefix = database.data.settings.prefix
  if (database.data?.settings?.banner) global.banner = database.data.settings.banner

  await loadPlugins()
  global.plugins = plugins
  await startBot()
})()
