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

// ─── PALETA MERCENARIA v2 (TOJI FUSHIGURO) ───────────────────────────────────
const cSteel  = chalk.hex('#4E5D6C')   // Gris Acero Oscuro
const cSilver = chalk.hex('#C8D6E0')   // Plata Fría
const cCurse  = chalk.hex('#8B5CF6')   // Púrpura Energía Maldita
const cBlood  = chalk.hex('#EF4444')   // Rojo Restricción Celestial
const cDim    = chalk.hex('#2a3a4a')   // Azul Carbón (bordes internos)
const cGhost  = chalk.hex('#1e2e3e')   // Sombra Fantasma (decoración)
const cTeal   = chalk.hex('#2DD4BF')   // Verde Teal (versión/estado)

// ─── BANNER TOJI FUSHIGURO v2 ─────────────────────────────────────────────────
const tojiBanner = `
  ${cGhost('░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░')}

  ${cDim('╔') + cGhost('═══════════════════════════════════════════════════════════════════') + cDim('╗')}
  ${cDim('║')}                                                                   ${cDim('║')}
  ${cDim('║')}  ${cCurse('▀█▀ ▄▀▀▄ ░░░  ▀   ')} ${cSteel('███████╗██╗   ██╗███████╗██╗  ██╗██╗')}  ${cDim('║')}
  ${cDim('║')}  ${cCurse(' █  ██  █ ░░░  █   ')} ${cSteel('██╔════╝██║   ██║██╔════╝██║  ██║██║')}  ${cDim('║')}
  ${cDim('║')}  ${cCurse(' █  ██  █ ░░░  █   ')} ${cSilver('███████╗██║   ██║███████╗███████║██║')}  ${cDim('║')}
  ${cDim('║')}  ${cCurse(' █  ██  █ ░░░  █   ')} ${cSilver('╚════██║██║   ██║╚════██║██╔══██║██║')}  ${cDim('║')}
  ${cDim('║')}  ${cBlood('▄█▄  ▀▀  ░░░ ███  ')} ${cSteel('███████║╚██████╔╝███████║██║  ██║██║')}  ${cDim('║')}
  ${cDim('║')}  ${cGhost('                   ')} ${cSteel('╚══════╝ ╚═════╝ ╚══════╝╚═╝  ╚═╝╚═╝')}  ${cDim('║')}
  ${cDim('║')}                                                                   ${cDim('║')}
  ${cDim('╠') + cGhost('═══════════════════════════════════════════════════════════════════') + cDim('╣')}
  ${cDim('║')}                                                                   ${cDim('║')}
  ${cDim('║')}     ${cSteel('⟦')} ${cCurse('F U S H I G U R O')} ${cSteel('⟧')}   ${cGhost('·')}   ${cSteel('⟦')} ${cBlood('H E A V E N L Y  R E S T R I C T I O N')} ${cSteel('⟧')}     ${cDim('║')}
  ${cDim('║')}                                                                   ${cDim('║')}
  ${cDim('║')}     ${cGhost('◈')} ${cSteel('S O R C E R E R  K I L L E R')}  ${cGhost('·')}  ${cSteel('M U L T I D E V I C E  C O R E')}  ${cGhost('◈')}     ${cDim('║')}
  ${cDim('║')}                                                                   ${cDim('║')}
  ${cDim('╠') + cGhost('═══════════════════════════════════════════════════════════════════') + cDim('╣')}
  ${cDim('║')}                                                                   ${cDim('║')}
  ${cDim('║')}   ${cGhost('▸')}  ${cSteel('AUTHOR')}   ${cGhost('············')}  ${cSilver.bold('˚₊· ͟͟͞͞  A D R I E N  |  Z0RT SYSTEMS')}    ${cDim('║')}
  ${cDim('║')}   ${cGhost('▸')}  ${cSteel('VERSION')}  ${cGhost('···········')}  ${cTeal('v ' + (global.botVersion || '1.0.0') + '  —  S T A B L E')}               ${cDim('║')}
  ${cDim('║')}   ${cGhost('▸')}  ${cSteel('PREFIX')}   ${cGhost('············')}  ${cSilver(global.prefix || '#')}  ${cGhost('·  ·  ·  ·  ·  ·  ·  ·  ·  ·')}              ${cDim('║')}
  ${cDim('║')}   ${cGhost('▸')}  ${cSteel('STATUS')}   ${cGhost('············')}  ${cCurse('◉  O N L I N E')}                             ${cDim('║')}
  ${cDim('║')}                                                                   ${cDim('║')}
  ${cDim('╚') + cGhost('═══════════════════════════════════════════════════════════════════') + cDim('╝')}

  ${cGhost('░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░')}
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
    console.log(cDim('  ' + '─'.repeat(71)))
    console.log(`  ${cGhost('▸')}  ${cCurse.bold('V I N C U L A C I Ó N')}  ${cGhost('·')}  ${cSteel('Selecciona tu método de acceso')}`)
    console.log(cDim('  ' + '─'.repeat(71)))
    console.log()
    console.log(`  ${cDim('[')} ${cCurse.bold('1')} ${cDim(']')}  ${cSilver('Código QR')}           ${cGhost('···  Escanea con WhatsApp')}`)
    console.log(`  ${cDim('[')} ${cCurse.bold('2')} ${cDim(']')}  ${cSilver('Código de 8 dígitos')}  ${cGhost('···  Vinculación por número')}`)
    console.log()
    opcion = readlineSync.question(`  ${cGhost('▸')}  ${cCurse('Opción')} ${cDim('(1 o 2):')}  `).trim()

    if (opcion === '2') {
      console.log()
      phoneNumber = readlineSync
        .question(`  ${cGhost('▸')}  ${cCurse('Número')} ${cDim('(ej: 57310...):')}  `)
        .replace(/\D/g, '')
    }
    console.log()
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
        console.log()
        console.log(cDim('  ' + '─'.repeat(71)))
        console.log(`  ${cGhost('▸')}  ${cSteel('CÓDIGO DE VINCULACIÓN')}`)
        console.log(cDim('  ' + '─'.repeat(71)))
        console.log()
        console.log(`  ${cGhost('  ')}  ${chalk.bgHex('#8B5CF6').black.bold('  ' + formatted + '  ')}`)
        console.log()
        console.log(`  ${cGhost('▸')}  ${cDim('Ingresa este código en')}  ${cSteel('WhatsApp → Dispositivos vinculados → Vincular dispositivo')}`)
        console.log(cDim('  ' + '─'.repeat(71)))
        console.log()
      } catch (e) {
        log.error(`No se pudo obtener el código: ${e.message}`)
      }
    }, 3000)
  }

  // ─── EVENTO: CONEXIÓN ─────────────────────────────────────────────────────
  conn.ev.on('connection.update', async update => {
    const { qr, connection, lastDisconnect } = update

    if (qr && (opcion === '1' || methodCodeQR)) {
      console.log()
      console.log(cDim('  ' + '─'.repeat(71)))
      console.log(`  ${cGhost('▸')}  ${cCurse('C Ó D I G O  Q R')}  ${cGhost('···')}  ${cSteel('Escanea con WhatsApp')}`)
      console.log(cDim('  ' + '─'.repeat(71)))
      console.log()
      qrcode.generate(qr, { small: true })
    }

    if (connection === 'open') {
      console.log()
      console.log(cDim('  ' + '─'.repeat(71)))
      console.log(`  ${cGhost('▸')}  ${cCurse('STATUS')}  ${cGhost('·')}  ${cTeal('◉  ONLINE')}  ${cGhost('···')}  ${cSilver(conn.user?.name || 'Toji Fushiguro Bot')}`)
      console.log(`  ${cGhost('▸')}  ${cSteel('JID')}     ${cGhost('·')}  ${cDim(conn.user?.id || '—')}`)
      console.log(cDim('  ' + '─'.repeat(71)))
      console.log()
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
  conn.ev.on('messages.upsert', async (chatUpdate) => {
    if (chatUpdate.type !== 'notify') return
    try {
      // ✅ CORRECCIÓN PRINCIPAL: handler.js usa "this" como conn
      // y espera el objeto chatUpdate completo { messages, type }
      await handler.call(conn, chatUpdate)
    } catch (e) {
      log.error(`handler: ${e.message}`)
    }
  })
}

// ─── ARRANQUE ─────────────────────────────────────────────────────────────────
;(async () => {
  await database.read()

  // ✅ Exponer la DB como global.db para que handler.js la encuentre
  global.db = {
    data: database.data,
    loadDatabase: async () => { await database.read() }
  }
  global.loadDatabase = async () => { await database.read() }

  if (database.data?.settings?.prefix) global.prefix = database.data.settings.prefix
  if (database.data?.settings?.banner) global.banner = database.data.settings.banner

  console.clear()
  console.log(tojiBanner)

  await loadPlugins()

  // ✅ handler.js itera global.plugins como objeto plano { nombre: plugin }
  global.plugins = Object.fromEntries(plugins)

  const totalPlugins = plugins.size
  console.log(cDim('  ' + '─'.repeat(71)))
  console.log(`  ${cGhost('▸')}  ${cSteel('DATABASE')}  ${cGhost('·')}  ${cTeal('Vinculada')}  ${cGhost('···')}  ${cDim(database.data ? 'OK' : 'ERROR')}`)
  console.log(`  ${cGhost('▸')}  ${cSteel('PLUGINS')}   ${cGhost('·')}  ${cSilver(totalPlugins + ' cargados')}  ${cGhost('···')}  ${cDim('./plugins/')}`)
  console.log(`  ${cGhost('▸')}  ${cSteel('PREFIX')}    ${cGhost('·')}  ${cSilver(global.prefix || '#')}`)
  console.log(cDim('  ' + '─'.repeat(71)))
  console.log()

  await startBot()
})()
