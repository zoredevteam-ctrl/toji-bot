// ╔══════════════════════════════════════════════════════════╗
// ║        TOJI FUSHIGURO BOT — LIB/SIMPLE.JS                ║
// ╚══════════════════════════════════════════════════════════╝

const chalk = require('chalk')

// ── Colores para consola ──────────────────────────────────
function color(text, c) {
  const colors = {
    red:    chalk.red,
    green:  chalk.green,
    yellow: chalk.yellow,
    blue:   chalk.blue,
    cyan:   chalk.cyan,
    white:  chalk.white,
    gray:   chalk.gray,
    bold:   chalk.bold,
  }
  return (colors[c] || chalk.white)(text)
}

// ── Wrapper de mensajes smsg ──────────────────────────────
function smsg(client, m, store) {
  if (!m) return m

  const M = proto => {
    if (!proto) return proto
    return proto
  }

  m.id      = m.key?.id
  m.isBaileys = m.id?.startsWith('BAE5') && m.id?.length === 16
  m.chat    = m.key?.remoteJid
  m.isGroup = m.chat?.endsWith('@g.us')
  m.sender  = m.isGroup
    ? m.key?.participant
    : m.key?.remoteJid

  m.fromMe  = m.key?.fromMe
  m.mtype   = getContentType(m.message)
  m.msg     = (m.mtype === 'viewOnceMessage')
    ? m.message[m.mtype].message[getContentType(m.message[m.mtype].message)]
    : m.message?.[m.mtype]

  m.body =
    m.message?.conversation ||
    m.msg?.text ||
    m.msg?.caption ||
    (m.mtype === 'templateButtonReplyMessage' && m.msg?.selectedId) ||
    (m.mtype === 'buttonsResponseMessage' && m.msg?.selectedButtonId) ||
    (m.mtype === 'listResponseMessage' && m.msg?.singleSelectReply?.selectedRowId) ||
    ''

  m.text   = m.body
  m.mentionedJid = m.msg?.contextInfo?.mentionedJid || []

  // ── Reply quoted ─────────────────────────────────────
  const quoted = m.quoted = m.msg?.contextInfo?.quotedMessage
    ? {
        ...m.msg.contextInfo,
        message: m.msg.contextInfo.quotedMessage,
        key: {
          remoteJid: m.chat,
          fromMe: m.msg.contextInfo.participant === client.user?.id,
          id:     m.msg.contextInfo.stanzaId,
          participant: m.msg.contextInfo.participant,
        },
      }
    : null

  if (quoted) {
    quoted.mtype  = getContentType(quoted.message)
    quoted.isSelf = quoted.key?.fromMe
    quoted.sender = quoted.key?.participant || quoted.key?.remoteJid
    quoted.text   =
      quoted.message?.conversation ||
      quoted.message?.[quoted.mtype]?.text ||
      quoted.message?.[quoted.mtype]?.caption ||
      ''
  }

  // ── Métodos de envío rápido ───────────────────────────
  m.reply = (text, options = {}) =>
    client.sendMessage(m.chat, { text, ...options }, { quoted: m })

  m.replyImage = (url, caption = '', options = {}) =>
    client.sendMessage(m.chat, { image: { url }, caption, ...options }, { quoted: m })

  m.replyVideo = (url, caption = '', options = {}) =>
    client.sendMessage(m.chat, { video: { url }, caption, ...options }, { quoted: m })

  m.react = (emoji) =>
    client.sendMessage(m.chat, {
      react: { text: emoji, key: m.key },
    })

  return m
}

// ── getContentType seguro ─────────────────────────────────
function getContentType(message) {
  if (!message) return undefined
  const keys = Object.keys(message)
  const ignore = ['messageContextInfo', 'senderKeyDistributionMessage']
  return keys.find(k => !ignore.includes(k) && k !== 'UNRECOGNIZED')
}

// ── Formatear número de bytes ─────────────────────────────
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 B'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

// ── Formatear uptime ──────────────────────────────────────
function formatUptime(seconds) {
  const d = Math.floor(seconds / 86400)
  const h = Math.floor((seconds % 86400) / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.floor(seconds % 60)
  const parts = []
  if (d) parts.push(`${d}d`)
  if (h) parts.push(`${h}h`)
  if (m) parts.push(`${m}m`)
  parts.push(`${s}s`)
  return parts.join(' ')
}

// ── Obtener hora actual ───────────────────────────────────
function getTime(format = '24') {
  const now = new Date()
  if (format === '12') {
    return now.toLocaleTimeString('en-US', { hour12: true })
  }
  return now.toLocaleTimeString('es-MX', { hour12: false })
}

module.exports = { color, smsg, getContentType, formatBytes, formatUptime, getTime }
