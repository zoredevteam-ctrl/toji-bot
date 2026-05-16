import chalk from 'chalk'
import { readdirSync } from 'fs'
import { join } from 'path'

// ── UTILERÍA OBLIGATORIA PARA WHATSAPP MÓVIL ───────────────────────────
// Descarga la URL del icono en un Buffer para evitar el bug del cuadro invisible
const getBuffer = async (url) => {
    try {
        const res = await fetch(url)
        if (!res.ok) return null
        return Buffer.from(await res.arrayBuffer())
    } catch {
        return null
    }
}

export async function handler(conn, m, chatUpdate) {
    if (!m) return
    conn.msgqueque = conn.msgqueque || []
    
    // Filtros básicos de mensajes
    if (m.isBaileys) return
    if (m.chat.endsWith('broadcast')) return

    try {
        // Cargar base de datos si usas alguna (opcional)
        // let user = global.db.data.users[m.sender]
        
        // ── DETECCIÓN DE PREFIJOS Y COMANDOS ───────────────────────────
        let prefix = /^[.#]/ // Define aquí tus prefijos admisibles
        let isCmd = prefix.test(m.text)
        if (!isCmd) return

        let args = m.text.replace(prefix, '').trim().split(/ +/)
        let command = args.shift().toLowerCase()
        let usedPrefix = m.text.match(prefix)?.[0] || '#'

        // Buscar el plugin que corresponda al comando
        let plugin
        let plugins = global.plugins || {}
        
        for (let name in plugins) {
            let p = plugins[name]
            if (!p) continue
            if (p.command && (Array.isArray(p.command) ? p.command.includes(command) : p.command === command)) {
                plugin = p
                break
            }
        }

        // ── SITEMA DE PERMISOS PREVIOS A EJECUTAR ──────────────────────
        if (plugin) {
            let isOwner = global.owner?.some(num => num[0] + '@s.whatsapp.net' === m.sender) || m.isCreator
            let groupMetadata = m.isGroup ? await conn.groupMetadata(m.chat).catch(() => ({})) : {}
            let participants = m.isGroup ? groupMetadata.participants || [] : []
            let userAdmin = m.isGroup ? participants.find(p => p.id === m.sender)?.admin : null
            let botAdmin = m.isGroup ? participants.find(p => p.id === (conn.user.id.split(':')[0] + '@s.whatsapp.net'))?.admin : null
            
            let isAdmin = !!(userAdmin === 'admin' || userAdmin === 'superadmin')
            let isBotAdmin = !!(botAdmin === 'admin' || botAdmin === 'superadmin')

            // Restricciones automáticas del plugin
            if (plugin.rowner && !isOwner) return
            if (plugin.owner && !isOwner) return
            if (plugin.group && !m.isGroup) return
            if (plugin.admin && !isAdmin) return
            if (plugin.botAdmin && !isBotAdmin) return

            // Ejecutar el comando si todo está en orden
            try {
                await plugin.call(conn, m, { conn, args, usedPrefix, command, isOwner, isAdmin, isBotAdmin, plugins })
            } catch (err) {
                console.error(chalk.red('[PLUGIN ERROR]'), err)
                m.reply(`> 🩸 *Ocurrió un error interno al ejecutar el comando.*`)
            }
            return
        }

        // ── 🩸 MANEJO DE COMANDO INEXISTENTE (ESTILO TOJI CORREGIDO) ────
        if (!plugin) {
            // Elegimos la URL aleatoria de Toji desde tus settings
            let iconUrl = typeof global.getRandomIconoToji === 'function' 
                ? global.getRandomIconoToji() 
                : (global.icono || global.banner || '')

            // Descargamos la imagen a Buffer de forma nativa para que WhatsApp Móvil la renderice
            const thumbBuffer = await getBuffer(iconUrl)

            let txtInvalido = `> 🩸 *[ TRABAJO INVÁLIDO ]*\n` +
                              `> *El comando ${usedPrefix + command} no existe. No me hagas perder el tiempo con estupideces.*`

            await conn.sendMessage(m.chat, {
                text: txtInvalido,
                contextInfo: {
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid:   global.newsletterJid || '',
                        serverMessageId: -1,
                        newsletterName:  global.newsletterName || '𝐇𝐄𝐀𝐕𝐄𝐍𝐋𝐘 𝐑𝐄𝐒𝐓𝐑𝐈𝐂𝐓𝐈𝐎𝐍'
                    },
                    externalAdReply: {
                        title:                 '𝐇𝐄𝐀𝐕𝐄𝐍𝐋𝐘 𝐑𝐄𝐒𝐓𝐑𝐈𝐂𝐓𝐈𝐎𝐍',
                        body:                  'Rastreador fallido: Comando No Encontrado',
                        mediaType:             1,
                        thumbnail:             thumbBuffer, // CAMBIO CLAVE: Usamos buffer real en vez de URL
                        renderLargerThumbnail: false,
                        sourceUrl:             global.rcanal || ''
                    }
                }
            }, { quoted: m })
        }

    } catch (e) {
        console.error(chalk.red('[HANDLER GLOBAL ERROR]'), e)
    }
}
