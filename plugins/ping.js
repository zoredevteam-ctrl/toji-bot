import { performance } from 'perf_hooks'

// ── 🛠️ OPTIMIZADOR PARA EVITAR CUADROS NEGROS EN CELULARES ─────
const getBuffer = async (url) => {
    try {
        if (!url) return null;
        const targetUrl = url.startsWith('http') 
            ? `https://images.weserv.nl/?url=${encodeURIComponent(url)}&w=200&h=200&output=jpg&bg=white` 
            : url;
        const res = await fetch(targetUrl);
        if (!res.ok) return null;
        return Buffer.from(await res.arrayBuffer());
    } catch {
        return null;
    }
};

let handler = async (m, { conn }) => {
    // Tomamos el tiempo de inicio antes de procesar
    let start = performance.now()

    // Obtenemos un icono aleatorio de tus settings
    let iconUrl = typeof global.getRandomIconoToji === 'function' 
        ? global.getRandomIconoToji() 
        : (global.icono || global.banner || '')

    // Descargamos y optimizamos la imagen a Buffer para WhatsApp normal
    const thumbBuffer = await getBuffer(iconUrl)

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
                // Corregido: Se usa || para dar valor por defecto, no =
                newsletterName:  global.newsletterName || '༺𝕿𝔧᭄⏤͟͟͞͞𝕿𝖔𝖏𝖎 𝕱𝖚𝖘𝖍𝖎𝖌𝖚𝖗𝖔𒆜℘࿐༵'
            },
            externalAdReply: {
                title: '𝐇𝐄𝐀𝐕𝐄𝐍𝐋𝐘 𝐑𝐄𝐒𝐓𝐑𝐈𝐂𝐓𝐈𝐎𝐍',
                body: 'Rastreo de objetivos activo',
                mediaType: 1,
                thumbnail: thumbBuffer, // CAMBIO CLAVE: Enviamos el buffer real
                sourceUrl: global.rcanal || '',
                renderLargerThumbnail: false
            }
        }
    }, { quoted: m })
}

handler.command = ['p', 'ping'] // Se activa con #p o #ping

export default handler
