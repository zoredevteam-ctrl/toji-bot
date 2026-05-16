import { readdirSync } from 'fs'
import { join, resolve } from 'path'
import { pathToFileURL } from 'url'

let handler = async (m, { conn, isOwner, plugins }) => {
    // Solo el jefe puede usar este comando
    if (!isOwner) {
        let txt = `> 🩸 *[ ACCESO DENEGADO ]*\n> *¿Intentas apagarme? No tienes el dinero ni el poder para cancelar mis contratos.*`
        return conn.sendMessage(m.chat, { text: txt }, { quoted: m })
    }

    // Obtenemos un icono aleatorio de tus settings
    let iconUrl = typeof global.getRandomIconoToji === 'function' 
        ? global.getRandomIconoToji() 
        : (global.icono || global.banner || '')

    let txt = `> 🩸 *[ RECALIBRANDO ARSENAL ]*\n` +
              `> *Optimizando herramientas y recargando contratos en tiempo real...*\n` +
              `>\n` +
              `> *“No necesito apagarme para volverme más fuerte. Un asesino profesional mantiene sus armas afiladas en pleno combate.”*`

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
                    title: '𝐒𝐈𝐒𝐓𝐄𝐌𝐀: 𝐇class𝐎𝐓-𝐑𝐄𝐋𝐎𝐀𝐃',
                    body: 'Actualizando comandos sin caídas',
                    mediaType: 1,
                    thumbnailUrl: iconUrl,
                    sourceUrl: global.rcanal || '',
                    renderLargerThumbnail: false
                }
            }
        }, { quoted: m })

        // ── LÓGICA DE RECARGA EN CALIENTE (HOT RELOAD) ───────────────────
        const pluginsPath = resolve('./plugins')
        let files = readdirSync(pluginsPath).filter(f => f.endsWith('.js'))

        // Detectamos si el contenedor de plugins de tu handler es un Map o un Objeto
        const isMap = plugins instanceof Map

        // Vaciamos el contenedor actual para evitar comandos duplicados o fantasmas
        if (isMap) {
            plugins.clear()
        } else {
            for (let key in plugins) { delete plugins[key] }
        }

        // Volvemos a importar cada archivo aplicando un query param para romper la caché de ESM de Node
        for (const file of files) {
            try {
                const url = pathToFileURL(join(pluginsPath, file)).href + `?update=${Date.now()}`
                const mod = await import(url)
                
                if (isMap) {
                    plugins.set(file, mod.default || mod)
                } else {
                    plugins[file] = mod.default || mod
                }
            } catch (err) {
                console.error(`[HOT-RELOAD ERROR] No se pudo cargar el archivo ${file}:`, err)
            }
        }

        await m.react('✅')
        await conn.sendMessage(m.chat, { 
            text: `> 🩸 *[ CONTRATOS ACTUALIZADOS ]*\n> *El arsenal ha sido recargado con éxito. El comando #kick y cualquier otro cambio ya están operativos en el servidor.*` 
        }, { quoted: m })

    } catch (e) {
        console.error(e)
        await m.react('❌')
        m.reply(`> 🩸 *Ocurrió un error durante la recarga:* ${e.message}`)
    }
}

handler.help    = ['restart']
handler.command = ['restart', 'reiniciar', 'reboot', 'reload']
handler.owner   = true 

export default handler
