import { performance } from 'perf_hooks'

let handler = async (m, { conn }) => {
    // Tomamos el tiempo de inicio antes de procesar
    let start = performance.now()
    
    // Obtenemos un icono aleatorio de tus settings
    let iconUrl = typeof global.getRandomIconoToji === 'function' 
        ? global.getRandomIconoToji() 
        : (global.icono || global.banner || '')

    // Calculamos los milisegundos transcurridos
    let end = performance.now()
    let latencia = (end - start).toFixed(4)

    let txt = `> 🩸 *[ RENDIMIENTO DEL SISTEMA ]*\n` +
              `> *Velocidad de respuesta:* _${latencia} ms_\n` +
              `>\n` +
              `> *“Demasiado lento si pretendes esquivar mis ataques. Asegúrate de que tu conexión no me haga perder el tiempo.”*`

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
                title: '𝐇𝐄𝐀𝐕𝐄𝐍𝐋𝐘 𝐑𝐄𝐒𝐓𝐑𝐈𝐂𝐓𝐈𝐎𝐍',
                body: 'Rastreo de objetivos activo',
                mediaType: 1,
                thumbnailUrl: iconUrl, // Hereda tus imágenes aleatorias de Toji
                sourceUrl: global.rcanal || '',
                renderLargerThumbnail: false
            }
        }
    }, { quoted: m })
}

handler.command = ['p', 'ping'] // Se activa con #p o #ping

export default handler
