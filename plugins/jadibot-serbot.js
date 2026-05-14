const {
  useMultiFileAuthState,
  DisconnectReason,
  makeCacheableSignalKeyStore,
  fetchLatestBaileysVersion,
  prepareWAMessageMedia,
  generateWAMessageFromContent,
  proto,
} = (await import('@whiskeysockets/baileys'))

import qrcode from 'qrcode'
import NodeCache from 'node-cache'
import fs from 'fs'
import path from 'path'
import pino from 'pino'
import chalk from 'chalk'
import util from 'util'
import * as ws from 'ws'
const { spawn, exec } = await import('child_process')
const { CONNECTING } = ws
import { makeWASocket } from '../lib/simple.js'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const pairingCodeRequests = global.pairingCodeRequests || (global.pairingCodeRequests = new Map())
const PAIRING_CODE_TTL_MS = 45000
const PAIRING_CODE_COOLDOWN_MS = 60000

if (global.conns instanceof Array) console.log()
else global.conns = []
if (!(global.subBotRegistry instanceof Map)) global.subBotRegistry = new Map()

const emoji = '⚔️'
const emoji2 = '🗡️'
const jadi = global.jadi || 'TojiJadiBots'

const rtx = `*\n\n⚔️ Conexión Sub-Bot Modo QR\n\n` +
  `✰ Con otro celular o en la PC escanea este QR para convertirte en *Sub-Bot* Temporal.\n\n` +
  `\`1\` » Toca los tres puntos en la esquina superior derecha\n\n` +
  `\`2\` » Dispositivos vinculados\n\n` +
  `\`3\` » Escanea este código QR\n\n` +
  `✧ ¡Este código expira en 45 segundos!.`

let handler = async (m, { conn, args, usedPrefix, command, isOwner }) => {
  let time = global.db.data.users[m.sender].Subs + 120000
  if (new Date - global.db.data.users[m.sender].Subs < 120000)
    return conn.reply(m.chat, emoji + ' Debes esperar ' + msToTime(time - new Date()) + ' para volver a vincular un *Sub-Bot.*', m)

  const limiteSubBots = global.subbotlimitt || 30
  const subBots = [...new Set([...global.conns.filter((c) => c.user && c.ws.socket && c.ws.socket.readyState !== ws.CLOSED)])]
  const subBotsCount = subBots.length

  if (subBotsCount >= limiteSubBots) {
    return m.reply(emoji2 + ' Se ha alcanzado el límite de *Sub-Bots* activos (' + subBotsCount + '/' + limiteSubBots + ').\n\nEspera a que uno se desconecte.')
  }

  let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
  let id = who.split('@')[0]
  let pathRubyJadiBot = path.join('./' + jadi + '/', id)

  const existingById = global.conns.find(c => c?.subBotId === id && c?.ws?.socket?.readyState === ws.OPEN)
  if (existingById) {
    return conn.reply(m.chat, emoji + ' Ya tienes un *Sub-Bot* activo y estable.', m)
  }

  if (!fs.existsSync(pathRubyJadiBot)) {
    fs.mkdirSync(pathRubyJadiBot, { recursive: true })
  }

  const options = { pathRubyJadiBot, m, conn, args: [...args], usedPrefix, command, fromCommand: true }
  RubyJadiBot(options)
  global.db.data.users[m.sender].Subs = new Date * 1
}

handler.help = ['qr', 'code']
handler.tags = ['serbot']
handler.command = ['qr', 'code']
export default handler

export async function RubyJadiBot(options) {
  let { pathRubyJadiBot, m, conn, args, usedPrefix, command } = options

  if (command === 'code') {
    command = 'qr'
    args.unshift('code')
  }

  const mcode = args[0] && /(--code|code)/.test(args[0].trim())
    ? true : args[1] && /(--code|code)/.test(args[1].trim()) ? true : false

  let txtCode, codeBot, txtQR

  if (mcode) {
    args[0] = args[0].replace(/^--code$|^code$/, '').trim()
    if (args[1]) args[1] = args[1].replace(/^--code$|^code$/, '').trim()
    if (args[0] == '') args[0] = undefined
  }

  const pathCreds = path.join(pathRubyJadiBot, 'creds.json')

  if (!fs.existsSync(pathRubyJadiBot)) {
    fs.mkdirSync(pathRubyJadiBot, { recursive: true })
  }

  try {
    args[0] && args[0] != undefined
      ? fs.writeFileSync(pathCreds, JSON.stringify(JSON.parse(Buffer.from(args[0], 'base64').toString('utf-8')), null, '\t'))
      : ''
  } catch (e) {
    conn.reply(m.chat, emoji + ' Usa correctamente el comando » ' + usedPrefix + command + ' code', m)
    return
  }

  let { version } = await fetchLatestBaileysVersion()
  const subSocketCfg = global.baileysSocketConfig || {}
  const msgRetryCache = new NodeCache({ stdTTL: 5 * 60, checkperiod: 120, useClones: false })
  const { state, saveState, saveCreds } = await useMultiFileAuthState(pathRubyJadiBot)

  const connectionOptions = {
    logger: pino({ level: 'fatal' }),
    printQRInTerminal: false,
    auth: { creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'silent' })) },
    msgRetryCache,
    browser: mcode ? ['Ubuntu', 'Chrome', '110.0.5585.95'] : ['Toji Fushiguro Bot (Sub Bot)', 'Chrome', '2.0.0'],
    version,
    generateHighQualityLinkPreview: true,
    defaultQueryTimeoutMs: subSocketCfg.defaultQueryTimeoutMs ?? 45000,
    connectTimeoutMs: subSocketCfg.connectTimeoutMs ?? 60000,
    keepAliveIntervalMs: subSocketCfg.keepAliveIntervalMs ?? 20000,
    retryRequestDelayMs: subSocketCfg.retryRequestDelayMs ?? 1500,
    markOnlineOnConnect: false,
    syncFullHistory: false
  }

  let sock = makeWASocket(connectionOptions)
  const subBotId = path.basename(pathRubyJadiBot)
  sock.subBotId = subBotId
  sock.isInit = false

  let isInit = true
  let healthInterval = null
  let reconnectAttempts = 0
  const MAX_RECONNECT_ATTEMPTS = subSocketCfg.maxReconnectAttempts ?? 6
  const RECONNECT_BASE_DELAY_MS = subSocketCfg.reconnectBaseDelayMs ?? 1500
  let pairingCodeSent = false
  let pairingCodeMessageKey = null
  let pairingCodeTimer = null
  let qrMessageSent = false

  const removeSockFromPool = (targetSock = sock) => {
    const i = global.conns.indexOf(targetSock)
    if (i >= 0) global.conns.splice(i, 1)
  }

  const clearHealthMonitor = () => {
    if (healthInterval) { clearInterval(healthInterval); healthInterval = null }
  }

  const clearPairingCodeLock = () => {
    if (pairingCodeTimer) clearTimeout(pairingCodeTimer)
    pairingCodeTimer = null
    pairingCodeRequests.delete(subBotId)
  }

  const destroySock = ({ removeSession = false } = {}) => {
    clearHealthMonitor()
    clearPairingCodeLock()
    try { sock.ws.close() } catch (e) {}
    try { sock.ev.removeAllListeners() } catch (e) {}
    removeSockFromPool(sock)
    if (global.subBotRegistry instanceof Map) global.subBotRegistry.delete(subBotId)
    if (removeSession) {
      try { fs.rmSync(pathRubyJadiBot, { recursive: true, force: true }) } catch (e) {}
    }
  }

  let handler = await import('../handler.js')
  let creloadHandler = async function (restatConn) {
    try {
      const Handler = await import('../handler.js?update=' + Date.now()).catch(console.error)
      if (Object.keys(Handler || {}).length) handler = Handler
    } catch (e) { console.error(e) }

    if (restatConn) {
      const oldChats = sock.chats
      removeSockFromPool(sock)
      try { sock.ws.close() } catch (e) {}
      try { sock.ev.removeAllListeners() } catch (e) {}
      sock = makeWASocket(connectionOptions, { chats: oldChats })
      sock.subBotId = subBotId
      isInit = true
      if (global.subBotRegistry instanceof Map) global.subBotRegistry.set(subBotId, { sock, reconnecting: true, ts: Date.now() })
    }

    if (!isInit) {
      sock.ev.off('messages.upsert', sock.handler)
      sock.ev.off('connection.update', sock.connectionUpdate)
      sock.ev.off('creds.update', sock.credsUpdate)
    }

    sock.handler = handler.handler.bind(sock)
    sock.connectionUpdate = connectionUpdate.bind(sock)
    sock.credsUpdate = saveCreds.bind(sock, true)
    sock.ev.on('messages.upsert', sock.handler)
    sock.ev.on('connection.update', sock.connectionUpdate)
    sock.ev.on('creds.update', sock.credsUpdate)
    isInit = false
    return true
  }

  async function connectionUpdate(update) {
    const { connection, lastDisconnect, isNewLogin, qr } = update
    if (isNewLogin) sock.isInit = false

    if (qr && !mcode) {
      if (qrMessageSent) return
      qrMessageSent = true
      if (m?.chat) {
        txtQR = await conn.sendMessage(m.chat, {
          image: await qrcode.toBuffer(qr, { scale: 8 }),
          caption: rtx.trim()
        }, { quoted: m })
      } else return
      if (txtQR && txtQR.key) {
        setTimeout(() => { conn.sendMessage(m.chat, { delete: txtQR.key }).catch(() => {}) }, PAIRING_CODE_TTL_MS)
      }
      return
    }

    if (qr && mcode) {
      if (!m?.chat || pairingCodeSent) return
      const now = Date.now()
      const activeRequest = pairingCodeRequests.get(subBotId)
      if (activeRequest && now - activeRequest.ts < PAIRING_CODE_COOLDOWN_MS) {
        pairingCodeSent = true
        pairingCodeMessageKey = activeRequest.key || null
        return
      }

      pairingCodeSent = true
      const rawCode = await sock.requestPairingCode(m.sender.split('@')[0], 'TOJIBOT')
      const formattedCode = rawCode.match(/.{1,4}/g)?.join('-') || rawCode

      const mediaMessage = await prepareWAMessageMedia({
        image: { url: global.banner || 'https://i.pinimg.com/736x/3b/4c/5d/3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e.jpg' }
      }, { upload: conn.waUploadToServer })

      const interactivePayload = generateWAMessageFromContent(m.chat, {
        viewOnceMessage: {
          message: {
            interactiveMessage: proto.Message.InteractiveMessage.fromObject({
              body: proto.Message.InteractiveMessage.Body.create({
                text: '*⚔️ Tu código de vinculación está listo.*\n\n' +
                  'Úsalo para conectarte como Sub-Bot:\n\n' +
                  '*Código:* ' + formattedCode + '\n\n' +
                  '> Toca el botón para copiarlo.'
              }),
              footer: proto.Message.InteractiveMessage.Footer.create({
                text: 'Este código expira en 45 segundos.'
              }),
              header: proto.Message.InteractiveMessage.Header.create({
                hasMediaAttachment: true,
                imageMessage: mediaMessage.imageMessage
              }),
              nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
                buttons: [{
                  name: 'cta_copy',
                  buttonParamsJson: JSON.stringify({
                    display_text: 'Copiar Código',
                    copy_code: rawCode
                  })
                }]
              })
            })
          }
        }
      }, { quoted: m })

      await conn.relayMessage(m.chat, interactivePayload.message, { messageId: interactivePayload.key.id })
      pairingCodeMessageKey = interactivePayload.key
      pairingCodeRequests.set(subBotId, { ts: now, key: pairingCodeMessageKey })

      if (pairingCodeMessageKey) {
        pairingCodeTimer = setTimeout(() => {
          conn.sendMessage(m.chat, { delete: pairingCodeMessageKey }).catch(() => {})
          clearPairingCodeLock()
        }, PAIRING_CODE_TTL_MS)
      }
      return
    }

    const reason = lastDisconnect?.error?.output?.statusCode || lastDisconnect?.error?.output?.payload?.statusCode

    const scheduleReconnect = async (closeReason, reconnectFn) => {
      if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
        console.log(chalk.bold.red('⚔️ Sub-Bot +' + subBotId + ' alcanzó el límite de reconexiones.'))
        return destroySock({ removeSession: false })
      }
      reconnectAttempts += 1
      const waitMs = Math.min(30000, RECONNECT_BASE_DELAY_MS * (2 ** (reconnectAttempts - 1)))
      await sleep(waitMs)
      try {
        await reconnectFn()
      } catch (e) {
        console.error('Error reconectando +' + subBotId + ':', e)
        return scheduleReconnect(closeReason, reconnectFn)
      }
    }

    if (connection === 'close') {
      const fatal = [401, 403, 405]
      if (fatal.includes(reason)) {
        console.log(chalk.bold.red('⚔️ Sesión (+' + path.basename(pathRubyJadiBot) + ') cerrada. Razón: ' + reason))
        destroySock({ removeSession: true })
        return
      }
      if (reason === 440) {
        console.log(chalk.bold.red('⚔️ Conexión (+' + path.basename(pathRubyJadiBot) + ') reemplazada por otra sesión.'))
        destroySock({ removeSession: false })
        return
      }
      console.log(chalk.bold.yellow('⚔️ Conexión perdida (+' + path.basename(pathRubyJadiBot) + '). Razón: ' + reason + '. Reconectando...'))
      return scheduleReconnect(reason, async () => { await creloadHandler(true) })
    }

    if (global.db.data == null) global.loadDatabase()

    if (connection === 'open') {
      if (!global.db.data?.users) global.loadDatabase()
      const userName = sock.authState.creds.me?.name || 'Anónimo'
      console.log(chalk.bold.red('\n⚔️ Sub-Bot ' + userName + ' (+' + path.basename(pathRubyJadiBot) + ') conectado.'))
      sock.isInit = true
      reconnectAttempts = 0
      if (!global.conns.includes(sock)) global.conns.push(sock)
      if (global.subBotRegistry instanceof Map) global.subBotRegistry.set(subBotId, { sock, connectedAt: Date.now() })
      clearPairingCodeLock()
      await joinChannels(sock)

      if (m?.chat) {
        await conn.sendMessage(m.chat, {
          text: args[0]
            ? '@' + m.sender.split('@')[0] + ', ya estás conectado, leyendo mensajes entrantes...'
            : '@' + m.sender.split('@')[0] + ', ⚔️ ya eres parte de los Sub-Bots de Toji.',
          mentions: [m.sender]
        }, { quoted: m })
      }

      if (!healthInterval) {
        healthInterval = setInterval(async () => {
          if (!sock.user || sock?.ws?.socket?.readyState === ws.CLOSED) {
            if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
              destroySock({ removeSession: false })
            }
          }
        }, 90000)
      }
    }
  }

  creloadHandler(false)
}

function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)) }

function msToTime(duration) {
  let seconds = Math.floor((duration / 1000) % 60)
  let minutes = Math.floor((duration / (1000 * 60)) % 60)
  minutes = minutes < 10 ? '0' + minutes : minutes
  seconds = seconds < 10 ? '0' + seconds : seconds
  return minutes + ' m y ' + seconds + ' s'
}

async function joinChannels(conn) {
  for (const channelId of Object.values(global.ch || {})) {
    await conn.newsletterFollow(channelId).catch(() => {})
  }
}
