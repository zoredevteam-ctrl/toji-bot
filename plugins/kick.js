let handler = async (m, { conn, args, usedPrefix, command, isOwner, isAdmin }) => {
    // 1. Verificación de permisos de quien ejecuta el comando
    if (!isAdmin && !isOwner) {
        let txt = `> 🩸 *[ ACCESO DENEGADO ]*\n> *No tienes el poder ni el dinero suficiente para darme órdenes. Solo los administradores o mi jefe manejan este contrato.*`
        return conn.sendMessage(m.chat, { text: txt }, { quoted: m })
    }

    // 2. Definir a quién se va a eliminar (Mención, cita de mensaje o argumento)
    let who = null
    if (m.mentionedJid?.[0]) {
        who = m.mentionedJid[0]
    } else if (m.quoted?.sender) {
        who = m.quoted.sender
    } else if (args[0]) {
        // Limpia el texto por si pasan el número plano sin @
        let target = args[0].replace(/[^0-9]/g, '')
        if (target) who = `${target}@s.whatsapp.net`
    }

    if (!who) {
        let txt = `> 🩸 *[ CONTRATO VACÍO ]*\n> *Necesito un objetivo claro. Etiqueta a alguien, responde a su mensaje o escribe su número usando ${usedPrefix + command} @usuario.*`
        return conn.sendMessage(m.chat, { text: txt }, { quoted: m })
    }

    // 3. Filtros de Seguridad automáticos
    let botJid = conn.user.id.split(':')[0] + '@s.whatsapp.net'

    if (who === botJid) {
        let txt = `> 🩸 *[ OPERACIÓN ANULADA ]*\n> *¿Intentas eliminarme a mí? Ja, buen intento, pero no me vendo tan barato.*`
        return conn.sendMessage(m.chat, { text: txt }, { quoted: m })
    }

    if (who === m.sender) {
        let txt = `> 🩸 *[ OPERACIÓN ANULADA ]*\n> *No voy a ejecutar un suicidio. Si quieres irte, hazlo tú mismo.*`
        return conn.sendMessage(m.chat, { text: txt }, { quoted: m })
    }

    // 4. Ejecución de la baja
    try {
        await m.react('🩸')

        // Obtenemos un icono aleatorio de tus settings
        let iconUrl = typeof global.getRandomIconoToji === 'function' 
            ? global.getRandomIconoToji() 
            : (global.icono || global.banner || '')

        let num = who.split('@')[0]
        let txt = `> 🩸 *[ OBJETIVO ELIMINADO ]*\n` +
                  `> *El usuario @${num} ha sido removido del grupo por romper las reglas de la zona.*\n` +
                  `>\n` +
                  `> *“Contrato completado. Una escoria menos de la que preocuparse en este lugar.”*`

        // Sacar al usuario del grupo
        await conn.groupParticipantsUpdate(m.chat, [who], 'remove')

        // Enviar confirmación con la estética premium de Toji
        await conn.sendMessage(m.chat, { 
            text: txt,
            mentions: [who],
            contextInfo: {
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid:   global.newsletterJid || '',
                    serverMessageId: -1,
                    newsletterName:  global.newsletterName || '𝐇𝐄𝐀𝐕𝐄𝐍𝐋𝐘 𝐑𝐄𝐒𝐓𝐑𝐈𝐂𝐓𝐈𝐎𝐍'
                },
                externalAdReply: {
                    title: '𝐇𝐄𝐀𝐕𝐄𝐍𝐋𝐘 𝐑𝐄𝐒𝐓𝐑𝐈𝐂𝐓𝐈𝐎𝐍',
                    body: 'Baja del sistema confirmada',
                    mediaType: 1,
                    thumbnailUrl: iconUrl,
                    sourceUrl: global.rcanal || '',
                    renderLargerThumbnail: false
                }
            }
        }, { quoted: m })

        await m.react('✅')

    } catch (e) {
        console.error(e)
        await m.react('❌')
        let txt = `> 🩸 *[ FALLO DE LOGÍSTICA ]*\n> *No pude eliminar al objetivo. Asegúrate de que tenga los permisos activos en el grupo y que el bot sea Administrador.*`
        await conn.sendMessage(m.chat, { text: txt }, { quoted: m })
    }
}

// Configuración del comando
handler.help    = ['kick']
handler.command = ['kick', 'echar', 'sacar', 'ban']
handler.group   = true    // Obligatorio usarlo en grupos
handler.botAdmin = true  // Bloquea el comando automáticamente desde el handler si el bot no es admin

export default handler