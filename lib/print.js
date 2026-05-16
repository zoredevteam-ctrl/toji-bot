import chalk from 'chalk'

// ── Paleta Toji Fushiguro (Mercenary Core) ─────────────────────
const cSteel  = chalk.hex('#4E5D6C') // Gris Acero Oscuro
const cSilver = chalk.hex('#E2E8F0') // Plata Brillante
const cCurse  = chalk.hex('#8B5CF6') // Púrpura Energía Maldita
const cBlood  = chalk.hex('#EF4444') // Rojo Restricción Celestial
const cg      = chalk.gray
const cWhite  = chalk.white

const printLog = async (hasPrefix, sender, chat, body, pushName, conn = null) => {
    if (!body) return

        try {
        const now       = new Date()
        const time      = now.toLocaleTimeString('es-CO', { hour12: false, timeZone: 'America/Bogota' })
        const date      = now.toLocaleDateString('es-CO', { timeZone: 'America/Bogota' })
        const num       = (sender || '').split('@')[0].split(':')[0]
        const nombre    = pushName || num
        const bodyShort = (body || '').slice(0, 80)

        // Configuración de estilo según tipo (Comando vs Mensaje)
        const tipo      = hasPrefix ? '⚔️ ᴄᴍᴅ' : '🌿 ᴍsɢ'
        const emojiTipo = hasPrefix ? '👑' : '💬'
        const colorTipo = hasPrefix ? cBlood : cSteel

        let header = cSteel('  ┌───────────────────────────────────┐')
        let footer = cSteel('  └───────────────────────────────────┘')
        let line   = cSteel('  │ ')

        if (chat && chat.endsWith('@g.us')) {
            let groupName = chat.split('@')[0]
            if (conn) {
                try {
                    const meta = await conn.groupMetadata(chat)
                    groupName  = meta.subject || groupName
                } catch {}
            }

            console.log(
                header + '\n' +
                line + cSilver(`${date} ⚔️ ${time}`) + ' ' + colorTipo.bold(`[${tipo}]`) + '\n' +
                line + cCurse('ɢʀᴜᴘᴏ   ') + cWhite(groupName) + ' ' + emojiTipo + '\n' +
                line + cCurse('sᴇɴᴅᴇʀ  ') + cWhite(nombre) + cg(` (${num})`) + '\n' +
                line + cCurse('ᴍᴇɴsᴀᴊᴇ ') + cWhite(bodyShort || '(multimedia)') + '\n' +
                footer
            )
        } else {
            console.log(
                header + '\n' +
                line + cSilver(`${date} ⚔️ ${time}`) + ' ' + colorTipo.bold(`[${tipo}]`) + '\n' +
                line + cCurse('ᴘʀɪᴠᴀᴅᴏ ') + cWhite(nombre) + ' ' + emojiTipo + cg(` (${num})`) + '\n' +
                line + cCurse('ᴍᴇɴsᴀᴊᴇ ') + cWhite(bodyShort || '(multimedia)') + '\n' +
                footer
            )
        }
    } catch (e) {
        console.log(
            cSteel('  ┌── [ ') + chalk.red.bold('ERROR') + cSteel(' ] ──┐') + '\n' +
            cSteel('  │ ') + cWhite(e.message) + '\n' +
            cSteel('  └───────────────┘')
        )
    }
}

export default printLog
