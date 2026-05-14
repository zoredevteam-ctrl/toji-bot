import path from 'path'
import { toAudio } from './converter.js'
import chalk from 'chalk'
import fetch from 'node-fetch'
import PhoneNumber from 'awesome-phonenumber'
import fs from 'fs'
import util from 'util'
import { fileTypeFromBuffer } from 'file-type'
import { format } from 'util'
import { fileURLToPath } from 'url'
import store from './store.js'
import Jimp from 'jimp'
import pino from 'pino'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const {
  default: _makeWaSocket,
  makeWALegacySocket,
  proto,
  downloadContentFromMessage,
  jidDecode,
  areJidsSameUser,
  generateWAMessage,
  generateForwardMessageContent,
  generateWAMessageFromContent,
  WAMessageStubType,
  extractMessageContent,
  makeInMemoryStore,
  getAggregateVotesInPollMessage,
  prepareWAMessageMedia,
  WA_DEFAULT_EPHEMERAL
} = (await import('@whiskeysockets/baileys')).default

// ─── LOG INTERNO CON ESTILO TOJI ─────────────────────────────────────────────
const tojiLog = {
  info:  (...a) => console.log(chalk.bold.bgHex('#0f3460')(' ⚔ INFO '),    `[${chalk.white(new Date().toUTCString())}]:`, chalk.hex('#e94560')(format(...a))),
  error: (...a) => console.log(chalk.bold.bgHex('#e94560')(' 💀 ERROR '),   `[${chalk.white(new Date().toUTCString())}]:`, chalk.red(format(...a))),
  warn:  (...a) => console.log(chalk.bold.bgYellow(' ⚠ WARN '),             `[${chalk.white(new Date().toUTCString())}]:`, chalk.yellow(format(...a))),
  trace: (...a) => console.log(chalk.grey(' TRACE '),                        `[${chalk.white(new Date().toUTCString())}]:`, chalk.white(format(...a))),
  debug: (...a) => console.log(chalk.bold.bgHex('#16213e')(' 🗡 DEBUG '),   `[${chalk.white(new Date().toUTCString())}]:`, chalk.cyan(format(...a))),
}

export function makeWASocket(connectionOptions, options = {}) {
  let conn = (global.opts['legacy'] ? makeWALegacySocket : _makeWaSocket)(connectionOptions)

  let sock = Object.defineProperties(conn, {

    chats: {
      value: { ...(options.chats || {}) },
      writable: true
    },

    decodeJid: {
      value(jid) {
        if (!jid || typeof jid !== 'string') return (!nullish(jid) && jid) || null
        return jid.decodeJid()
      }
    },

    // ─── LOGGER CON TEMA TOJI ───────────────────────────────────────────
    logger: {
      get() { return tojiLog },
      enumerable: true
    },

    // ─── SEND BOT (con externalAdReply de Toji) ─────────────────────────
    sendBot: {
      async value(jid, text = '', buffer, title, body, url, quoted, options) {
        if (buffer) try { ({ data: buffer } = await conn.getFile(buffer)) } catch(e) {}

        // Thumbnail: intentar descargar icono de Toji
        let thumbnail
        try {
          const iconUrl = global.getRandomIconoToji ? global.getRandomIconoToji()
            : 'https://i.pinimg.com/736x/3b/4c/5d/3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e.jpg'
          const f = await conn.getFile(iconUrl)
          if (f?.data && f?.mime?.startsWith('image/')) thumbnail = f.data
        } catch(e) {}

        const sourceUrl = global.rcanal || 'https://whatsapp.com/channel/0029Vb85bh7EAKWOM4Zw8N3G'
        let prep = generateWAMessageFromContent(jid, {
          extendedTextMessage: {
            text,
            contextInfo: {
              externalAdReply: {
                title: title || global.botname || '⚔️ Toji Fushiguro Bot',
                body:  body  || '⚔️ Sin magia maldita, solo poder bruto.',
                thumbnail,
                sourceUrl,
                mediaUrl: sourceUrl,
                mediaType: 1,
                renderLargerThumbnail: false
              },
              forwardedNewsletterMessageInfo: {
                newsletterJid:  global.newsletterJid  || '120363408182996815@newsletter',
                newsletterName: global.newsletterName || '⚔️ Toji Fushiguro Bot | Updates',
                serverMessageId: -1
              },
              isForwarded: true,
              forwardingScore: 999,
              mentionedJid: await conn.parseMention(text)
            }
          }
        }, { quoted })
        return conn.relayMessage(jid, prep.message, { messageId: prep.key.id })
      }
    },

    // ─── SEND LIST B (interactive) ───────────────────────────────────────
    sendListB: {
      async value(jid, title, text, buttonText, buffer, listSections, quoted, options = {}) {
        let img, video
        if (/^https?:\/\//i.test(buffer)) {
          try {
            const response = await fetch(buffer)
            const contentType = response.headers.get('content-type')
            if (/^image\//i.test(contentType)) {
              img = await prepareWAMessageMedia({ image: { url: buffer } }, { upload: conn.waUploadToServer })
            } else if (/^video\//i.test(contentType)) {
              video = await prepareWAMessageMedia({ video: { url: buffer } }, { upload: conn.waUploadToServer })
            }
          } catch(e) { console.error('sendListB URL error:', e) }
        } else {
          try {
            const type = await conn.getFile(buffer)
            if (/^image\//i.test(type.mime)) {
              img = await prepareWAMessageMedia({ image: { url: buffer } }, { upload: conn.waUploadToServer })
            } else if (/^video\//i.test(type.mime)) {
              video = await prepareWAMessageMedia({ video: { url: buffer } }, { upload: conn.waUploadToServer })
            }
          } catch(e) { console.error('sendListB file error:', e) }
        }

        const sections = [...listSections]
        const message = {
          interactiveMessage: {
            header: {
              title,
              hasMediaAttachment: false,
              imageMessage: img ? img.imageMessage : null,
              videoMessage: video ? video.videoMessage : null
            },
            body: { text },
            nativeFlowMessage: {
              buttons: [{
                name: 'single_select',
                buttonParamsJson: JSON.stringify({ title: buttonText, sections })
              }],
              messageParamsJson: ''
            }
          }
        }
        let msgL = generateWAMessageFromContent(jid, { viewOnceMessage: { message } }, { userJid: conn.user.jid, quoted })
        conn.relayMessage(jid, msgL.message, { messageId: msgL.key.id, ...options })
      }
    },

    // ─── SEND PAYMENT ────────────────────────────────────────────────────
    sendPayment: {
      async value(jid, amount, text, quoted, options) {
        conn.relayMessage(jid, {
          requestPaymentMessage: {
            currencyCodeIso4217: 'PEN',
            amount1000: amount,
            requestFrom: null,
            noteMessage: {
              extendedTextMessage: {
                text,
                contextInfo: { mentionedJid: conn.parseMention(text) }
              }
            }
          }
        }, {})
      }
    },

    // ─── GET FILE ────────────────────────────────────────────────────────
    getFile: {
      async value(PATH, saveToFile = false) {
        let res, filename
        const data = Buffer.isBuffer(PATH) ? PATH
          : PATH instanceof ArrayBuffer ? Buffer.from(PATH)
          : /^data:.*?\/.*?;base64,/i.test(PATH) ? Buffer.from(PATH.split`,`[1], 'base64')
          : /^https?:\/\//.test(PATH) ? await (res = await fetch(PATH)).buffer()
          : fs.existsSync(PATH) ? (filename = PATH, fs.readFileSync(PATH))
          : typeof PATH === 'string' ? Buffer.from(PATH)
          : Buffer.alloc(0)
        if (!Buffer.isBuffer(data)) throw new TypeError('⚔️ Result is not a buffer')
        const type = await fileTypeFromBuffer(data) || { mime: 'application/octet-stream', ext: '.bin' }
        if (data && saveToFile && !filename) {
          filename = path.join(__dirname, '../tmp/' + Date.now() + '.' + type.ext)
          await fs.promises.writeFile(filename, data)
        }
        return { res, filename, ...type, data, deleteFile() { return filename && fs.promises.unlink(filename) } }
      },
      enumerable: true
    },

    // ─── WAIT EVENT ─────────────────────────────────────────────────────
    waitEvent: {
      value(eventName, is = () => true, maxTries = 25) {
        return new Promise((resolve, reject) => {
          let tries = 0
          let on = (...args) => {
            if (++tries > maxTries) reject('⚔️ Max tries reached')
            else if (is()) { conn.ev.off(eventName, on); resolve(...args) }
          }
          conn.ev.on(eventName, on)
        })
      }
    },

    // ─── SEND CONTACT ────────────────────────────────────────────────────
    sendContact: {
      async value(jid, data, quoted, options) {
        if (!Array.isArray(data[0]) && typeof data[0] === 'string') data = [data]
        let contacts = []
        for (let [number, name] of data) {
          number = number.replace(/[^0-9]/g, '')
          let njid = number + '@s.whatsapp.net'
          let biz = await conn.getBusinessProfile(njid).catch(_ => null) || {}
          let vcard = `BEGIN:VCARD\nVERSION:3.0\nN:;${name.replace(/\n/g,'\\n')};;;\nFN:${name.replace(/\n/g,'\\n')}\nTEL;type=CELL;type=VOICE;waid=${number}:${PhoneNumber('+'+number).getNumber('international')}${biz.description ? `\nX-WA-BIZ-NAME:${(conn.chats[njid]?.vname||conn.getName(njid)||name).replace(/\n/,'\\n')}\nX-WA-BIZ-DESCRIPTION:${biz.description.replace(/\n/g,'\\n')}` : ''}\nEND:VCARD`.trim()
          contacts.push({ vcard, displayName: name })
        }
        return conn.sendMessage(jid, {
          ...options,
          contacts: {
            displayName: (contacts.length >= 2 ? contacts.length + ' contactos' : contacts[0].displayName) || null,
            contacts
          }
        }, { quoted, ...options })
      },
      enumerable: true
    },

    // ─── RESIZE ─────────────────────────────────────────────────────────
    resize: {
      value(buffer, w, h) {
        return new Promise(async (resolve, reject) => {
          try {
            const img = await Jimp.read(buffer)
            const buf = await img.resize(w, h).getBufferAsync(Jimp.MIME_JPEG)
            resolve(buf)
          } catch(e) { reject(e) }
        })
      }
    },

    // ─── RELAY WA MESSAGE ────────────────────────────────────────────────
    relayWAMessage: {
      async value(pesanfull) {
        if (pesanfull.message.audioMessage) {
          await conn.sendPresenceUpdate('recording', pesanfull.key.remoteJid)
        } else {
          await conn.sendPresenceUpdate('composing', pesanfull.key.remoteJid)
        }
        const mekirim = await conn.relayMessage(pesanfull.key.remoteJid, pesanfull.message, { messageId: pesanfull.key.id })
        conn.ev.emit('messages.upsert', { messages: [pesanfull], type: 'append' })
        return mekirim
      }
    },

    // ─── SEND LIST M ─────────────────────────────────────────────────────
    sendListM: {
      async value(jid, button, rows, quoted, options = {}) {
        const fsizedoc = '1'.repeat(10)
        const sections = [{ title: button.title, rows: [...rows] }]
        const listMessage = {
          text: button.description,
          footer: button.footerText,
          mentions: await conn.parseMention(button.description),
          ephemeralExpiration: '86400',
          title: '',
          buttonText: button.buttonText,
          sections
        }
        conn.sendMessage(jid, listMessage, {
          quoted,
          ephemeralExpiration: fsizedoc,
          contextInfo: {
            forwardingScore: fsizedoc,
            isForwarded: true,
            mentions: await conn.parseMention(button.description + button.footerText),
            ...options
          }
        })
      }
    },

    // ─── SEND LIST ───────────────────────────────────────────────────────
    sendList: {
      async value(jid, title, text, footer, buttonText, buffer, listSections, quoted, options) {
        if (buffer) try { ({ data: buffer } = await conn.getFile(buffer)) } catch(e) {}
        if (buffer && !Buffer.isBuffer(buffer) && (typeof buffer === 'string' || Array.isArray(buffer))) {
          options = quoted; quoted = listSections; listSections = buffer; buffer = null
        }
        if (!options) options = {}
        const sections = listSections.map(([title, rows]) => ({
          title: !nullish(title) && title || '',
          rows: rows.map(([rowTitle, rowId, description]) => ({
            title: !nullish(rowTitle) && rowTitle || !nullish(rowId) && rowId || '',
            rowId: !nullish(rowId) && rowId || !nullish(rowTitle) && rowTitle || '',
            description: !nullish(description) && description || ''
          }))
        }))
        return conn.sendMessage(jid, { text, footer, title, buttonText, sections }, {
          quoted,
          upload: conn.waUploadToServer,
          contextInfo: {
            mentionedJid: await conn.parseMention(text),
            forwardingScore: 1,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
              newsletterJid:  global.newsletterJid  || '120363408182996815@newsletter',
              newsletterName: global.newsletterName || '⚔️ Toji Fushiguro Bot | Updates',
              serverMessageId: ''
            },
            ...options
          }
        })
      }
    },

    // ─── SEND CONTACT ARRAY ──────────────────────────────────────────────
    sendContactArray: {
      async value(jid, data, quoted, options) {
        if (!Array.isArray(data[0]) && typeof data[0] === 'string') data = [data]
        let contacts = [], buttons = []
        for (let [number, name, isi, isi1, isi2, isi3, isi4, isi5, ...extraLinks] of data) {
          number = number.replace(/[^0-9]/g, '')
          let njid = number + '@s.whatsapp.net'
          let biz = await conn.getBusinessProfile(njid).catch(_ => null) || {}
          let vcard = `BEGIN:VCARD\nVERSION:3.0\nN:Toji;Bot;;;\nFN:${name.replace(/\n/g,'\\n')}\nitem.ORG:${isi}\nitem1.TEL;waid=${number}:${PhoneNumber('+'+number).getNumber('international')}\nitem1.X-ABLabel:${isi1}${isi2?'\nitem2.EMAIL;type=INTERNET:'+isi2+'\nitem2.X-ABLabel:📧 Email':''}${isi3?'\nitem3.ADR:;;'+isi3+';;;;\nitem3.X-ABLabel:📍 Region':''}${isi4?'\nitem4.URL;type=pref:'+isi4+'\nitem4.X-ABLabel:Website':''}\nEND:VCARD`.trim()
          contacts.push({ vcard, displayName: name })
        }
        const displayName = contacts.length === 1 ? contacts[0].displayName : contacts.length + ' contactos'
        return conn.sendMessage(jid, { contacts: { displayName, contacts } }, { quoted, ...options })
      }
    },

    // ─── SEND FILE ───────────────────────────────────────────────────────
    sendFile: {
      async value(jid, filePath, filename = '', caption = '', quoted, ptt = false, options = {}) {
        let type = await conn.getFile(filePath, true)
        let { res, data: file, filename: pathFile } = type
        if ((res && res.status !== 200) || file.length <= 65536) {
          try { throw { json: JSON.parse(file.toString()) } } catch(e) { if (e.json) throw e.json }
        }
        let opt = {}
        if (quoted) opt.quoted = quoted
        if (!type) options.asDocument = true
        let mtype = '', mimetype = options.mimetype || type.mime, convert
        if (/webp/.test(type.mime) || (/image/.test(type.mime) && options.asSticker)) mtype = 'sticker'
        else if (/image/.test(type.mime) || (/webp/.test(type.mime) && options.asImage)) mtype = 'image'
        else if (/video/.test(type.mime)) mtype = 'video'
        else if (/audio/.test(type.mime)) {
          convert = await toAudio(file, type.ext)
          file = convert.data; pathFile = convert.filename
          mtype = 'audio'; mimetype = options.mimetype || 'audio/ogg; codecs=opus'
        } else mtype = 'document'
        if (options.asDocument) mtype = 'document'

        delete options.asSticker; delete options.asLocation
        delete options.asVideo; delete options.asDocument; delete options.asImage

        let message = {
          ...options, caption, ptt,
          [mtype]: { url: pathFile },
          mimetype,
          fileName: filename || pathFile.split('/').pop()
        }
        let m
        try {
          m = await conn.sendMessage(jid, message, { ...opt, ...options })
        } catch(e) {
          console.error('⚔️ sendFile error:', e)
          m = null
        } finally {
          if (type?.deleteFile) type.deleteFile()
        }
        return m
      },
      enumerable: true
    },

    // ─── SEND TOJI (reply con thumbnail de Toji automatico) ──────────────
    sendToji: {
      async value(jid, text, quoted, options = {}) {
        let thumbnail
        try {
          const iconUrl = global.getRandomIconoToji
            ? global.getRandomIconoToji()
            : 'https://i.pinimg.com/736x/3b/4c/5d/3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e.jpg'
          const f = await conn.getFile(iconUrl)
          if (f?.data && f?.mime?.startsWith('image/')) thumbnail = f.data
        } catch(e) {}
        const sourceUrl = global.rcanal || 'https://whatsapp.com/channel/0029Vb85bh7EAKWOM4Zw8N3G'
        return conn.sendMessage(jid, {
          text,
          contextInfo: {
            mentionedJid: await conn.parseMention(text),
            isForwarded: true,
            forwardingScore: 999,
            forwardedNewsletterMessageInfo: {
              newsletterJid:  global.newsletterJid  || '120363408182996815@newsletter',
              newsletterName: global.newsletterName || '⚔️ Toji Fushiguro Bot | Updates',
              serverMessageId: -1
            },
            externalAdReply: {
              title: global.botname || '⚔️ Toji Fushiguro Bot',
              body: '⚔️ Sin magia maldita, solo poder bruto.',
              thumbnail,
              sourceUrl,
              mediaUrl: sourceUrl,
              mediaType: 1,
              renderLargerThumbnail: false
            }
          },
          ...options
        }, { quoted })
      },
      enumerable: true
    },

    // ─── PARSE MENTION ───────────────────────────────────────────────────
    parseMention: {
      value(text = '') {
        return [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net')
      }
    },

    // ─── GET NAME ────────────────────────────────────────────────────────
    getName: {
      value(jid, withoutContact = false) {
        let id = conn.decodeJid(jid)
        withoutContact = conn.withoutContact || withoutContact
        let v
        if (id?.endsWith('@g.us')) {
          return new Promise(async (resolve) => {
            v = conn.chats[id] || {}
            if (!v.name) v = await conn.groupMetadata(id).catch(_ => {}) || {}
            resolve(v?.name || v?.subject || PhoneNumber('+' + id.replace('@s.whatsapp.net', '')).getNumber('international'))
          })
        } else {
          v = id === '0@s.whatsapp.net' ? { id, name: 'WhatsApp' }
            : id === conn.user?.id ? conn.user
            : (conn.chats[id] || {})
          return (withoutContact ? '' : v?.name) || v?.subject || v?.pushName
            || PhoneNumber('+' + id?.replace('@s.whatsapp.net', '')).getNumber('international')
        }
      },
      enumerable: true
    },

    // ─── REPLY ───────────────────────────────────────────────────────────
    reply: {
      value(jid, text = '', quoted, options = {}) {
        return conn.sendMessage(jid, { text, ...options }, { quoted, ...options })
      },
      enumerable: true
    },

    // ─── COPY N FORWARD ─────────────────────────────────────────────────
    copyNForward: {
      async value(jid, message, forceForward = false, options = {}) {
        let vtype
        if (options.readViewOnce) {
          message.message = message.message?.viewOnceMessageV2?.message
            || message.message?.viewOnceMessage?.message
            || message.message
          vtype = Object.keys(message.message)[0]
          delete message.message[vtype]?.viewOnce
          message.message = { ...message.message }
        }
        let mtype = Object.keys(message.