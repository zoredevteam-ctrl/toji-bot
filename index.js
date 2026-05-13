process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'
import './settings.js'
import { createRequire } from 'module'
import { fileURLToPath, pathToFileURL } from 'url'
import { platform } from 'process'
import { watchFile, unwatchFile, readdirSync, statSync, unlinkSync, existsSync, mkdirSync, readFileSync, rmSync, watch } from 'fs'
import * as ws from 'ws'
import cfonts from 'cfonts'
import path, { join, dirname } from 'path'
import yargs from 'yargs'
import { spawn } from 'child_process'
import lodash from 'lodash'
import chalk from 'chalk'
import syntaxerror from 'syntax-error'
import { tmpdir } from 'os'
import { format } from 'util'
import boxen from 'boxen'
import pino from 'pino'
import { Boom } from '@hapi/boom'
import { makeWASocket, protoType, serialize } from './lib/simple.js'
import { Low, JSONFile } from 'lowdb'
import { mongoDB, mongoDBV2 } from './lib/mongoDB.js'
import store from './lib/store.js'
import NodeCache from 'node-cache'
import readline, { createInterface } from 'readline'
import { RubyJadiBot } from './plugins/jadibot-serbot.js'
import { EventEmitter } from 'events'
EventEmitter.defaultMaxListeners = 100

const { proto } = (await import('@whiskeysockets/baileys')).default
const {
  DisconnectReason,
  useMultiFileAuthState,
  MessageRetryMap,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
  jidNormalizedUser
} = await import('@whiskeysockets/baileys')

import pkg from 'google-libphonenumber'
const { PhoneNumberUtil } = pkg
const phoneUtil = PhoneNumberUtil.getInstance()

const { CONNECTING } = ws
const { chain } = lodash

global.__filename = function filename(pathURL = import.meta.url, rmPrefix = platform !== 'win32') {
  return rmPrefix
    ? /file:\/\/\//.test(pathURL) ? fileURLToPath(pathURL) : pathURL
    : pathToFileURL(pathURL).toString()
}
global.__dirname = function dirname(pathURL) { return path.dirname(global.__filename(pathURL, true)) }
global.__require = function require(dir = import.meta.url) { return createRequire(dir) }
global.timestamp = { start: new Date }

const __dirname = global.__dirname(import.meta.url)

global.opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse())
global.__bannerShown = false
global.prefix = new RegExp('^[#/!.]')
global.db = new Low(
  /https?:\/\//.test(opts['db'] || '')
    ? new mongoDB(opts['db'])
    : new JSONFile('./src/database/database.json')
)
global.DATABASE = global.db

// ─── BANNER ASCII DE TOJI ───────────────────────────────────────────────────

const bannerASCII = chalk.bold.hex('#e94560')(`
 ██████████                  ██  ██
░░░░░██░░░                  ░██ ░░
    ░██   ░██████  ░ ██  ██ ░██  ██
    ░██  ██░░░░██ ░  ██ ░██ ░██ ░██
    ░██ ░██   ░██    ░██░██ ░██ ░██
    ░██ ░██   ░██     ░████ ░██ ░██
    ░██ ░░██████       ░░██ ███ ░██
    ░░   ░░░░░░         ░░ ░░░  ░░
 ███████                      ██       ██                                
░░░░░░███                    ░██      ░██                                
     ███  ██   ██  ██████   ██████   ██████  ██████  ██████  ██   ██████ 
    ███  ░██  ░██ ██░░░░   ░░░██░   ░░░██░  ░░░░░██ ██░░░░██░██  ██░░░░██
   ███   ░██  ░██░░██████    ░██      ░██    ███████░██   ░██░██ ░██   ░██
  ███    ░██  ░██ ░░░░░██    ░██      ░██   ██░░░░██░██   ░██░██ ░██   ░██
 ███████ ░░██████ ██████     ░░██     ░░██ ░░████████░░██████ ███░░██████ 
░░░░░░░   ░░░░░░ ░░░░░░       ░░       ░░   ░░░░░░░░  ░░░░░░ ░░░  ░░░░░░  
`)

const showBanner = () => {
  if (global.__bannerShown) return
  global.__bannerShown = true
  console.clear()
  console.log(bannerASCII)
  console.log(chalk.bold.hex('#e94560')('─'.repeat(70)))
  console.log(chalk.bold.hex('#ffffff')('  ⚔️  "No necesito cursería... solo resultados."'))
  console.log(chalk.bold.hex('#e94560')('─'.repeat(70)))
  cfonts.say('Toji Bot', {
    font: 'chrome',
    align: 'center',
    gradient: ['#e94560', '#0f3460'],
    transition: true,
    env: 'node'
  })
  console.log(
    boxen(chalk.bold.hex('#e94560')('⚔️  Bot iniciado correctamente. Listo para el combate.'), {
      padding: 1,
      margin: 1,
      borderStyle: 'double',
      borderColor: 'red',
      float: 'center'
    })
  )
}

showBanner()

// ─── BASE DE DATOS ───────────────────────────────────────────────────────────

global.loadDatabase = async function loadDatabase() {
  if (global.db.READ) {
    return new Promise((resolve) =>
      setInterval(async function () {
        if (!global.db.READ) {
          clearInterval(this)
          resolve(global.db.data == null ? global.loadDatabase() : global.db.data)
        }
      }, 1000)
    )
  }
  if (global.db.data !== null) return
  global.db.READ = true
  await global.db.read().catch(console.error)
  global.db.READ = null
  global.db.data = {
    users: {},
    chats: {},
    stats: {},
    msgs: {},
    sticker: {},
    settings: {},
    ...(global.db.data || {})
  }
  global.db.chain = chain(global.db.data)
}

loadDatabase()
protoType()
serialize()

// ─── CONEXIÓN ────────────────────────────────────────────────────────────────

const { state, saveState, saveCreds } = await useMultiFileAuthState(global.Rubysessions)
const msgRetryCounterMap = (MessageRetryMap) => {}
const msgRetryCounterCache = new NodeCache()
const { version } = await fetchLatestBaileysVersion()

let phoneNumber = global.botNumber
const methodCodeQR = process.argv.includes('qr')
const methodCode = !!phoneNumber || process.argv.includes('code')
const MethodMobile = process.argv.includes('mobile')
const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
const question = (texto) => {
  rl.clearLine(rl.input, 0)
  return new Promise((resolver) => {
    rl.question(texto, (respuesta) => {
      rl.clearLine(rl.input, 0)
      resolver(respuesta.trim())
    })
  })
}

let opcion
if (methodCodeQR) { opcion = '1' }

if (!methodCodeQR && !methodCode && !existsSync(`./${global.Rubysessions}/creds.json`)) {
  const lineM = '━'.repeat(40)
  do {
    showBanner()
    opcion = await question(chalk.bold.hex('#e94560')(`
╭━━${lineM}━━╮
┃  ${chalk.bold.hex('#ffffff')('⚔️  TOJI FUSHIGURO BOT — CONEXIÓN')}
┃
┃  ${chalk.bold.yellow('🔸 OPCIÓN 1:')} ${chalk.white('Escanear Código QR')}
┃  ${chalk.bold.yellow('🔸 OPCIÓN 2:')} ${chalk.white('Código de 8 Dígitos (Pairing)')}
┃
┃  ${chalk.italic.gray('Escribe 1 o 2 y presiona Enter')}
╰━━${lineM}━━╯
${chalk.bold.hex('#e94560')('➜ ')}`))

    if (!/^[1-2]$/.test(opcion)) {
      console.log(chalk.red.bold('❌ OPCIÓN INVÁLIDA. ELIGE 1 O 2.'))
      await new Promise(resolve => setTimeout(resolve, 1500))
    }
  } while (opcion !== '1' && opcion !== '2' || existsSync(`./${global.Rubysessions}/creds.json`))
}

const socketCfg = global.baileysSocketConfig || {}
const connectionOptions = {
  logger: pino({ level: 'silent' }),
  printQRInTerminal: opcion == '1' ? true : methodCodeQR ? true : false,
  mobile: MethodMobile,
  browser: ['Mac OS', 'Safari', '10.15.7'],
  auth: {
    creds: state.creds,
    keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'fatal' }).child({ level: 'fatal' }))
  },
  markOnlineOnConnect: true,
  generateHighQualityLinkPreview: true,
  getMessage: async (clave) => {
    let jid = jidNormalizedUser(clave.remoteJid)
    let msg = await store.loadMessage(jid, clave.id)
    return msg?.message || ''
  },
  msgRetryCounterCache,
  msgRetryCounterMap,
  defaultQueryTimeoutMs: socketCfg.defaultQueryTimeoutMs ?? 30000,
  version,
  syncFullHistory: false,
  connectTimeoutMs: socketCfg.connectTimeoutMs ?? 45000,
  keepAliveIntervalMs: socketCfg.keepAliveIntervalMs ?? 20000,
  retryRequestDelayMs: socketCfg.retryRequestDelayMs ?? 1500
}

global.conn = makeWASocket(connectionOptions)
let conn = global.conn
conn.isInit = false
conn.well = false

// ─── PAIRING CODE ────────────────────────────────────────────────────────────

if (!existsSync(`./${global.Rubysessions}/creds.json`)) {
  if (opcion === '2' || methodCode) {
    opcion = '2'
    if (!conn.authState.creds.registered) {
      let addNumber
      if (!!phoneNumber) {
        addNumber = phoneNumber.replace(/[^0-9]/g, '')
      } else {
        do {
          phoneNumber = await question(chalk.bold.hex('#e94560')(
            '\n📞 INGRESA TU NÚMERO DE WHATSAPP\n' +
            chalk.white('Ejemplo: 5219999999999\n') +
            chalk.yellow('➜ ')
          ))
          phoneNumber = phoneNumber.replace(/\D/g, '')
          if (!phoneNumber.startsWith('+')) phoneNumber = '+' + phoneNumber
        } while (!await isValidPhoneNumber(phoneNumber))
        rl.close()
        addNumber = phoneNumber.replace(/\D/g, '')
        setTimeout(async () => {
          let codeBot = await conn.requestPairingCode(addNumber)
          codeBot = codeBot?.match(/.{1,4}/g)?.join('-') || codeBot
          console.log(
            boxen(
              chalk.bold.white(' Código : ') + chalk.bold.bgRed(` ${codeBot} `),
              { borderStyle: 'round', borderColor: 'red', padding: 1, margin: 1, title: '⚔️ VINCULACIÓN', titleAlignment: 'center' }
            )
          )
        }, 3000)
      }
    }
  }
}

// ─── CONNECTION UPDATE ────────────────────────────────────────────────────────

async function connectionUpdate(update) {
  const { connection, lastDisconnect, isNewLogin, qr } = update
  global.stopped = connection
  if (isNewLogin) conn.isInit = true

  const code = lastDisconnect?.error?.output?.statusCode ||
    lastDisconnect?.error?.output?.payload?.statusCode

  if (code && code !== DisconnectReason.loggedOut && conn?.ws.socket == null) {
    await global.reloadHandler(true).catch(console.error)
    global.timestamp.connect = new Date()
  }

  if (global.db.data == null) loadDatabase()

  if ((qr && opcion === '1') || methodCodeQR) {
    console.log(
      boxen(chalk.hex('#e94560')('⚔️  Escanea el código QR para conectar a Toji Bot'), {
        padding: 1,
        borderStyle: 'classic',
        borderColor: 'red'
      })
    )
  }

  if (connection === 'open') {
    console.log('\n')
    console.log(
      boxen(chalk.bold.hex('#00FF00')('⚔️  TOJI BOT CONECTADO — Listo para el combate.'), {
        padding: 1,
        borderStyle: 'double',
        borderColor: 'green',
        title: '✅ CONECTADO',
        titleAlignment: 'center'
      })
    )
    console.log('\n')
  }

  if (connection === 'close') {
    const reason = new Boom(lastDisconnect?.error)?.output?.statusCode
    const show = (color, text, icon) =>
      console.log(boxen(color(text), { padding: 1, borderStyle: 'round', borderColor: 'red', title: icon, titleAlignment: 'center' }))

    switch (reason) {
      case DisconnectReason.badSession:
        show(chalk.red, `⚠️ SESIÓN CORRUPTA — Borra la carpeta ${global.Rubysessions}`, '❌ ERROR')
        await global.reloadHandler(true).catch(console.error)
        break
      case DisconnectReason.connectionClosed:
        show(chalk.yellow, '🔌 CONEXIÓN CERRADA — Reconectando...', '🔁')
        await global.reloadHandler(true).catch(console.error)
        break
      case DisconnectReason.connectionLost:
        show(chalk.blue, '📡 SEÑAL PERDIDA — Reconectando...', '⚠️')
        await global.reloadHandler(true).catch(console.error)
        break
      case DisconnectReason.connectionReplaced:
        show(chalk.magenta, '💻 SESIÓN ABIERTA EN OTRO LUGAR', '🚫')
        break
      case DisconnectReason.loggedOut:
        show(chalk.red, `👋 SESIÓN CERRADA — Borra la carpeta ${global.Rubysessions}`, '🚪')
        await global.reloadHandler(true).catch(console.error)
        break
      case DisconnectReason.restartRequired:
        show(chalk.cyan, '🔄 REINICIO NECESARIO...', '♻️')
        await global.reloadHandler(true).catch(console.error)
        break
      case DisconnectReason.timedOut:
        show(chalk.yellow, '⏳ TIEMPO AGOTADO — Reconectando...', '⏱️')
        await global.reloadHandler(true).catch(console.error)
        break
      default:
        show(chalk.red, `❓ ERROR DESCONOCIDO: ${reason}`, '💀')
        break
    }
  }
}

process.on('uncaughtException', console.error)

// ─── RELOAD HANDLER ───────────────────────────────────────────────────────────

let isInit = true
let handler = await import('./handler.js')

global.reloadHandler = async function (restatConn) {
  try {
    const Handler = await import(`./handler.js?update=${Date.now()}`).catch(console.error)
    if (Object.keys(Handler || {}).length) handler = Handler
  } catch (e) { console.error(e) }

  if (restatConn) {
    const oldChats = global.conn.chats
    try { global.conn.ws.close() } catch (e) {}
    conn.ev.removeAllListeners()
    global.conn = makeWASocket(connectionOptions, { chats: oldChats })
    conn = global.conn
    isInit = true
  }

  if (!isInit) {
    conn.ev.off('messages.upsert', conn.handler)
    conn.ev.off('connection.update', conn.connectionUpdate)
    conn.ev.off('creds.update', conn.credsUpdate)
  }

  conn.handler = handler.handler.bind(global.conn)
  conn.connectionUpdate = connectionUpdate.bind(global.conn)
  conn.credsUpdate = saveCreds.bind(global.conn, true)
  conn.ev.on('messages.upsert', conn.handler)
  conn.ev.on('connection.update', conn.connectionUpdate)
  conn.ev.on('creds.update', conn.credsUpdate)
  isInit = false
  return true
}

await global.reloadHandler(false)

// ─── SUB-BOTS ─────────────────────────────────────────────────────────────────

global.rutaJadiBot = join(__dirname, `./${global.jadi}`)

if (global.RubyJadibts || true) {
  if (!existsSync(global.rutaJadiBot)) {
    mkdirSync(global.rutaJadiBot, { recursive: true })
    console.log(chalk.bold.cyan('✅ Carpeta de Sub-Bots creada'))
  } else {
    console.log(chalk.bold.cyan('✨ Cargando Sub-Bots...'))
  }

  const readRutaJadiBot = readdirSync(global.rutaJadiBot)
  if (readRutaJadiBot.length > 0) {
    const creds = 'creds.json'
    const subBotPaths = readRutaJadiBot
      .map(gjbts => join(global.rutaJadiBot, gjbts))
      .filter(botPath => {
        try { return statSync(botPath).isDirectory() && readdirSync(botPath).includes(creds) }
        catch (e) { return false }
      })

    const batchSize = Math.max(1, Number(global.subBotLoadBatch || 3))
    for (let i = 0; i < subBotPaths.length; i += batchSize) {
      const batch = subBotPaths.slice(i, i + batchSize)
      await Promise.all(batch.map(async (botPath) => {
        try {
          await RubyJadiBot({ pathRubyJadiBot: botPath, m: null, conn, args: '', usedPrefix: '/', command: 'serbot' })
        } catch (e) {
          console.log(chalk.red('Error cargando subbot:'), e)
        }
      }))
      if (i + batchSize < subBotPaths.length) await new Promise(resolve => setTimeout(resolve, 500))
    }
  }
}

// ─── PLUGINS ──────────────────────────────────────────────────────────────────

const pluginFolder = global.__dirname(join(__dirname, './plugins/index'))
const pluginFilter = (filename) => /\.js$/.test(filename)
global.plugins = {}

async function filesInit() {
  for (const filename of readdirSync(pluginFolder).filter(pluginFilter)) {
    try {
      const file = global.__filename(join(pluginFolder, filename))
      const module = await import(file)
      global.plugins[filename] = module.default || module
    } catch (e) {
      conn.logger.error(e)
      delete global.plugins[filename]
    }
  }
}

filesInit().then((_) => Object.keys(global.plugins)).catch(console.error)

global.reload = async (_ev, filename) => {
  if (pluginFilter(filename)) {
    const dir = global.__filename(join(pluginFolder, filename), true)
    if (filename in global.plugins) {
      if (existsSync(dir)) conn.logger.info(`✨ Plugin actualizado: '${filename}'`)
      else {
        conn.logger.warn(`🗑️ Plugin eliminado: '${filename}'`)
        return delete global.plugins[filename]
      }
    } else conn.logger.info(`✨ Nuevo plugin: '${filename}'`)

    const err = syntaxerror(readFileSync(dir), filename, {
      sourceType: 'module',
      allowAwaitOutsideFunction: true
    })
    if (err) conn.logger.error(`❌ Error de sintaxis en '${filename}'\n${format(err)}`)
    else {
      try {
        const module = await import(`${global.__filename(dir)}?update=${Date.now()}`)
        global.plugins[filename] = module.default || module
      } catch (e) {
        conn.logger.error(`❌ Error cargando '${filename}'\n${format(e)}`)
      } finally {
        global.plugins = Object.fromEntries(
          Object.entries(global.plugins).sort(([a], [b]) => a.localeCompare(b))
        )
      }
    }
  }
}

Object.freeze(global.reload)
watch(pluginFolder, global.reload)

// ─── UTILIDADES ───────────────────────────────────────────────────────────────

async function isValidPhoneNumber(number) {
  try {
    number = number.replace(/\s+/g, '')
    if (number.startsWith('+521')) number = number.replace('+521', '+52')
    else if (number.startsWith('+52') && number[4] === '1') number = number.replace('+52 1', '+52')
    const parsedNumber = phoneUtil.parseAndKeepRawInput(number)
    return phoneUtil.isValidNumber(parsedNumber)
  } catch (error) { return false }
}

function clearTmp() {
  const tmpDirectories = [tmpdir(), join(__dirname, './tmp')]
  tmpDirectories.forEach(dir => {
    if (!existsSync(dir)) return
    readdirSync(dir).forEach(file => {
      const filePath = join(dir, file)
      try {
        const stats = statSync(filePath)
        if (stats.isFile() && (Date.now() - stats.mtimeMs > 3 * 60 * 1000)) {
          unlinkSync(filePath)
        }
      } catch (e) {}
    })
  })
}

function purgeSession() {
  try {
    const sessionDir = `./${global.Rubysessions}`
    if (!existsSync(sessionDir)) return
    readdirSync(sessionDir).forEach(file => {
      const filePath = join(sessionDir, file)
      try {
        const stats = statSync(filePath)
        if (file.startsWith('pre-key-') && (Date.now() - stats.mtimeMs > 3600000)) {
          unlinkSync(filePath)
        }
      } catch (e) {}
    })
  } catch (e) { console.log('Error en purga de sesión:', e) }
}

function purgeSessionSB() {
  try {
    const jadiDir = global.rutaJadiBot
    if (!existsSync(jadiDir)) return
    readdirSync(jadiDir).forEach(directorio => {
      const subBotPath = join(jadiDir, directorio)
      if (statSync(subBotPath).isDirectory()) {
        readdirSync(subBotPath).forEach(file => {
          const filePath = join(subBotPath, file)
          try {
            const stats = statSync(filePath)
            if (file.startsWith('pre-key-') && (Date.now() - stats.mtimeMs > 3600000)) {
              unlinkSync(filePath)
            }
          } catch (e) {}
        })
      }
    })
  } catch (e) { console.log('Error en purga de Sub-Bots:', e) }
}

// ─── INTERVALOS DE LIMPIEZA ───────────────────────────────────────────────────

setInterval(async () => {
  await clearTmp()
}, 1000 * 60 * 2)

setInterval(async () => {
  await purgeSession()
  await purgeSessionSB()
  console.log(chalk.hex('#e94560')('\n⚔️  LIMPIEZA AUTOMÁTICA COMPLETADA\n'))
}, 1000 * 60 * 60)
