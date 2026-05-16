import { exec } from 'child_process'

let handler = async (m, { conn, isOwner }) => {
    // Solo el jefe puede usar este comando
    if (!isOwner) {
        let txt = `> 🩸 *[ ACCESO DENEGADO ]*\n> *¿Intentas apagarme? No tienes el dinero ni el poder para cancelar mis contratos.*`
        return conn.sendMessage(m.chat, { text: txt }, { quoted: m })
    }

    // Obtenemos un icono aleatorio de tus settings
    let iconUrl = typeof global.getRandomIconoToji === 'function' 
        ? global.getRandomIconoToji() 
        : (global.icono || global.banner || '')

    let txt = `> 🩸 *[ REINICIO EN CURSO ]*\n` +
              `> *Desconectando sistemas temporales. Volveré a rastrear mis objetivos en unos segundos...*\n` +
              `>\n` +
              `> *“Un descanso rápido. Iré por un cigarrillo y a cobrar un encargo, no te muevas.”*`

    try {
        await m.react('⚔️')
        
        await conn.sendMessage(m.chat, { 
            text: txt,
            contextInfo: {
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid:   global.newsletterJid || '',
                    serverMessageId: -1,
                    newsletterName:  global.newsletterName || '𝐇𝐄𝐀𝐕𝐄𝐍𝐋𝐘 𝐑𝐄𝐒𝐓𝐑𝐈𝐂𝐓𝐈𝐎𝐍'
                },
                externalAdReply: {
                    title: '𝐒𝐈𝐒𝐓𝐄𝐌𝐀: 𝐑𝐄𝐁𝐎𝐎𝐓',
                    body: 'Cerrando contratos activos',
                    mediaType: 1,
                    thumbnailUrl: iconUrl,
                    sourceUrl: global.rcanal || '',
                    renderLargerThumbnail: false
                }
            }
        }, { quoted: m })

        await m.react('✅')
        
        // Pequeño delay para asegurar que el mensaje de WhatsApp se envíe antes de matar el proceso
        setTimeout(() => {
            process.exit(0) // Mata el proceso de Node de forma limpia
        }, 2000)

    } catch (e) {
        console.error(e)
        await m.react('❌')
        m.reply('> 🩸 *Ocurrió un fallo al intentar forzar el reinicio.*')
    }
}

handler.help    = ['restart']
handler.command = ['restart', 'reiniciar', 'reboot']
handler.owner   = true // Bloqueo directo desde el handler si no es dueño

export default handler
