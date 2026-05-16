import { downloadMediaMessage } from '@whiskeysockets/baileys'
import { sticker, writeExif } from '../lib/sticker.js'
import { spawn } from 'child_process'
import fs from 'fs-extra'
import { tmpdir } from 'os'
import { join } from 'path'
import Crypto from 'crypto'
import sharp from 'sharp'

const tmpFile = (ext) => join(tmpdir(), `${Crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.${ext}`)

function ffRun(args) {
    return new Promise((resolve, reject) => {
        const p = spawn('ffmpeg', args)
        let err = ''
        p.stderr.on('data', d => err += d)
        p.on('close', code => code === 0 ? resolve() : reject(new Error(err.slice(-400))))
    })
}

const sendStyled = async (conn, m, text) => {
    try {
        // Obtenemos un icono completamente aleatorio de tus settings
        let iconUrl = typeof global.getRandomIconoToji === 'function' 
            ? global.getRandomIconoToji() 
            : (global.icono || global.banner || '')

        return conn.sendMessage(m.chat, {
            text,
            contextInfo: {
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid:   global.newsletterJid,
                    serverMessageId: -1,
                    newsletterName:  global.newsletterName
                },
                externalAdReply: {
                    title:                 '𝐇𝐄𝐀𝐕𝐄𝐍𝐋𝐘 𝐑𝐄𝐒𝐓𝐑𝐈𝐂𝐓𝐈𝐎𝐍',
                    body:                  'Asesino de Hechiceros',
                    mediaType:             1,
                    thumbnailUrl:          iconUrl, // Corregido para evitar el cuadro negro
                    renderLargerThumbnail: false,
                    sourceUrl:             global.rcanal || ''
                }
            }
        }, { quoted: m })
    } catch {
        return conn.sendMessage(m.chat, { text }, { quoted: m })
    }
}

async function webpToPng(buffer) {
    return sharp(buffer).png().toBuffer()
}

async function webpToGif(buffer) {
    return sharp(buffer, { animated: true }).gif().toBuffer()
}

async function addWatermarkImg(buffer, texto) {
    const tmpIn  = tmpFile('jpg')
    const tmpOut = tmpFile('jpg')
    await fs.writeFile(tmpIn, buffer)
    const safe = texto.replace(/'/g, "\\'").replace(/:/g, '\\:')
    await ffRun([
        '-y', '-i', tmpIn,
        '-vf', `drawtext=text='${safe}':fontsize=28:fontcolor=white:borderw=2:bordercolor=black:x=w-tw-18:y=h-th-18`,
        '-q:v', '2',
        tmpOut
    ])
    const result = await fs.readFile(tmpOut)
    await fs.remove(tmpIn)
    await fs.remove(tmpOut)
    return result
}

let handler = async (m, { conn, args, usedPrefix, command }) => {
    const isWm    = /^(wm|watermark|marca)$/.test(command)
    const isToImg = /^(toimagen|toimg|s2img)$/.test(command)
    let stiker = false

    try {
        let q    = m.quoted ? m.quoted : m
        let mime = (q.msg || q).mimetype || q.mediaType || ''

        if (isToImg) {
            if (!m.quoted) return sendStyled(conn, m,
                `> 🩸 *[ STICKER → IMAGEN ]*\n> *Cita un sticker para convertirlo.*`
            )
            if (!/webp/.test(mime)) return sendStyled(conn, m,
                `> 🩸 *[ STICKER → IMAGEN ]*\n> *Eso no es un sticker válido.*`
            )

            await m.react('🩸')
            const buf = await downloadMediaMessage(q, 'buffer', {}, { logger: console, reuploadRequest: conn.updateMediaMessage })
            if (!buf) throw new Error('No se pudo procesar el archivo.')

            if (q.msg?.isAnimated) {
                try {
                    const gif = await webpToGif(buf)
                    await conn.sendMessage(m.chat, { video: gif, caption: '> 🩸 *“The one who left it all behind...”*', gifPlayback: true }, { quoted: m })
                } catch {
                    const png = await webpToPng(buf)
                    await conn.sendMessage(m.chat, { image: png, caption: '> 🩸 *“The one who left it all behind...”*' }, { quoted: m })
                }
            } else {
                const png = await webpToPng(buf)
                await conn.sendMessage(m.chat, { image: png, caption: '> 🩸 *“The one who left it all behind...”*' }, { quoted: m })
            }
            return await m.react('✅')
        }

        if (isWm) {
            const buf = await downloadMediaMessage(q, 'buffer', {}, { logger: console, reuploadRequest: conn.updateMediaMessage })
            if (!buf) throw new Error('No se pudo extraer el archivo de origen.')

            if (/webp/.test(mime)) {
                await m.react('🩸')
                const texto = args.join(' ').trim()
                let packname, author

                if (texto) {
                    packname = texto
                    author   = '𝕿𝖔𝖏𝖎 𝖋𝖚𝖘𝖍𝖎𝖌𝖚𝖗ο 🩸'
                } else {
                    const now     = new Date()
                    const fecha   = now.toLocaleDateString('es-ES', { day: 'numeric', month: 'numeric', year: 'numeric' })
                    const hora    = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
                    const usuario = m.pushName || m.sender.split('@')[0]
                    const grupo   = m.isGroup ? (await conn.groupMetadata(m.chat).catch(() => ({}))).subject || m.chat : 'MD'
                    packname = `🩸 Usuario: ${usuario}\n🩸 Bot: 𝕿𝖔𝖏𝖎 𝖋𝖚𝖘𝖍𝖎𝖌𝖚𝖗ο\n🩸 Fecha: ${fecha}`
                    author   = `${hora} • ${grupo}`
                }

                const result = await writeExif(buf, packname, author)
                await conn.sendMessage(m.chat, { sticker: result }, { quoted: m })
                return await m.react('✅')
            }

            if (!/image/.test(mime)) return sendStyled(conn, m,
                `> 🩸 *[ MARCA DE AGUA ]*\n> *Cita una imagen o sticker usando el comando.*`
            )

            await m.react('🩸')
            const texto = args.join(' ').trim() || '𝕿𝖔𝖏𝖎 𝖋𝖚𝖘𝖍𝖎𝖌𝖚𝖗ο 🩸'
            const out   = await addWatermarkImg(buf, texto)
            await conn.sendMessage(m.chat, { image: out, caption: '> 🩸 *“I don’t need sorcery.”*' }, { quoted: m })
            return await m.react('✅')
        }

        if (/webp|image|video/g.test(mime)) {
            await m.react('🩸')
            const img = await downloadMediaMessage(q, 'buffer', {}, { logger: console, reuploadRequest: conn.updateMediaMessage })
            if (!img) throw new Error('No se pudo leer el material.')
            
            // Corregido para usar las variables correctas de tu settings.js si no existen las globales default
            let pName = global.packname || '𝕿𝖔𝖏𝖎 𝖋𝖚𝖘𝖍𝖎𝖌𝖚𝖗ο 🩸'
            let pAuth = global.author || global.ownerName || 'Adrien | Amo del Clan'
            
            stiker = await sticker(img, false, pName, pAuth)
        } else if (args[0] && /https?:\/\//.test(args[0])) {
            let pName = global.packname || '𝕿𝖔𝖏𝖎 𝖋𝖚𝖘𝖍𝖎𝖌𝖚𝖗ο 🩸'
            let pAuth = global.author || global.ownerName || 'Adrien | Amo del Clan'
            stiker = await sticker(false, args[0], pName, pAuth)
        } else {
            return sendStyled(conn, m,
                `> 🩸 *[ MATERIAL INVÁLIDO ]*\n> *Responde a una imagen, video o envía un enlace directo.*`
            )
        }

        if (stiker) {
            await conn.sendMessage(m.chat, { sticker: stiker }, { quoted: m })
            await m.react('✅')
        }

    } catch (e) {
        console.error(e)
        await m.react('❌')
        sendStyled(conn, m, `> 🩸 *[ CONTRATO FALLIDO ]*\n> *Error: ${e.message}*`)
    }
}

handler.help    = ['s', 'wm', 'toimagen']
handler.command = ['s', 'sticker', 'stiker', 'wm', 'watermark', 'marca', 'toimagen', 'toimg', 's2img']
handler.tags    = ['tools']

export default handler
