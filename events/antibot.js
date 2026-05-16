import chalk from 'chalk'

export const event = 'messages.upsert'

// ── 🛠️ OPTIMIZADOR LOCAL PARA DETENER CUADROS NEGROS EN CELULARES ─────
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

export const run = async (conn, { messages, type }) => {
    if (type !== 'notify') return

    const m = messages[0]
    if (!m) return
    if (!m.key?.remoteJid?.endsWith('@g.us')) return
    if (m.key?.fromMe) return

    const msgId = m.key?.id || ''
    // Filtro estricto para interceptar cadenas de Baileys / bots externos
    if (!(msgId.startsWith('3EB0') && msgId.length === 22)) return

    const sender = m.key?.participant || ''

    // ── Ignorar si es un sub-bot registrado en tu infraestructura ─────────
    const subbots = (global.conns || []).filter(c => c.user)
    const esSubBot = subbots.some(c => {
        const subJid = (c.user?.id || '').split(':')[0] + '@s.whatsapp.net'
        return subJid === sender || subJid.split('@')[0] === sender.split('@')[0]
    })
    if (esSubBot) return

    // ── Verificar si el bot principal tiene poder (Admin) ─────────────────
    let isBotAdmin = false
    try {
        const meta   = await conn.groupMetadata(m.key.remoteJid)
        const botJid = conn.user.id.split(':')[0] + '@s.whatsapp.net'
        isBotAdmin   = meta.participants.some(p =>
            (p.id === botJid || p.jid === botJid) && (p.admin || p.isAdmin || p.isSuperAdmin)
        )
    } catch {}

    if (!isBotAdmin) return

    try {
        // 1. Fulminamos el mensaje del intruso al instante
        await conn.sendMessage(m.key.remoteJid, {
            delete: {
                remoteJid:   m.key.remoteJid,
                fromMe:      false,
                id:          msgId,
                participant: sender
            }
        })

        // 2. Extraemos el diseño estético de Toji
        let iconUrl = typeof global.getRandomIconoToji === 'function' 
            ? global.getRandomIconoToji() 
            : (global.icono || global.banner || '');
            
        const thumbBuffer = await getBuffer(iconUrl);

        // Mensaje con la actitud ruda de Toji Fushiguro
        let txtHumillacion = `> 🩸 *[ PURGA DE INTRUSO ]*\n` +
                             `> *Lárgate, no tienes nivel para estar en el clan Zenin. Un bot de cuarta no hace más que estorbar en mi territorio.*`

        // 3. Dejamos el recado premium antes de echarlo
        await conn.sendMessage(m.key.remoteJid, {
            text: txtHumillacion,
            contextInfo: {
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid:   global.newsletterJid || '',
                    serverMessageId: -1,
                    newsletterName:  global.newsletterName || '𝐇𝐄𝐀𝐕𝐄𝐍𝐋𝐘 𝐑𝐄𝐒𝐓𝐑𝐈𝐂𝐓𝐈𝐎𝐍'
                },
                externalAdReply: {
                    title:                 '𝐇𝐄𝐀𝐕𝐄𝐍𝐋𝐘 𝐑𝐄𝐒𝐓𝐑𝐈𝐂𝐓𝐈𝐎𝐍',
                    body:                  'Eliminación de escoria completada',
                    mediaType:             1,
                    thumbnail:             thumbBuffer,
                    renderLargerThumbnail: false,
                    sourceUrl:             global.rcanal || ''
                }
            }
        })

        // 4. Lo sacamos del mapa
        await conn.groupParticipantsUpdate(m.key.remoteJid, [sender], 'remove')
        console.log(chalk.red(`✦ [ANTIBOT TOJI] Bot de cuarta eliminado del clan Zenin: ${sender}`))

    } catch (e) {
        console.error(chalk.red('[ANTIBOT TOJI ERROR]'), e.message)
    }
}
