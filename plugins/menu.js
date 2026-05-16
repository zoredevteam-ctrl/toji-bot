/* 
    PLUGIN: MENU TOJI FUSHIGURO
    ESTILO: MERCENARIO
*/

let handler = async (m, { conn, usedPrefix, isOwner, isAdmin, isPremium, db }) => {
    
    // Accedemos a los usuarios usando 'db' que ya viene verificado desde el handler
    const user = db.users[m.sender]
    const name = user?.name || m.pushName || 'Desconocido'
    
    // Roles estéticos de Toji
    const role = isOwner ? '👑 Amo del Clan Zenin' : (isAdmin ? '⚔️ Shinobi de Élite' : '👥 Mercenario')
    
    const menuText = `⚔️  ──  ᴛᴏᴊɪ ғᴜsʜɪɢᴜʀᴏ ᴍᴅ  ──  ⚔️

Hola, *${name}*.
El dinero mueve el mundo, no las maldiciones. 
Aquí tienes mis servicios actuales:

✦ [ 👤 ᴘᴇʀғɪʟ ]
  ➢ Rol: ${role}
  ➢ Zenis: ${user?.money || 0}
  ➢ Nivel: ${user?.level || 1}

✦ [ ⚔️ ᴍᴇɴᴜ́ ᴅᴇ ᴄᴏɴᴛʀᴀᴛᴏs ]
  ➢ ${usedPrefix}reg - Registrarse en el clan
  ➢ ${usedPrefix}perfil - Tu estado como mercenario
  ➢ ${usedPrefix}shop - Mercado negro (Zenis)
  ➢ ${usedPrefix}sticker - Conversión rápida
  ➢ ${usedPrefix}play - Buscar información (Música/Video)

✦ [ 👑 ᴄᴏᴍᴀɴᴅᴏs ᴅᴇ ᴄʟᴀɴ (ᴀᴅᴍɪɴs) ]
  ➢ ${usedPrefix}kick - Expulsar no deseados
  ➢ ${usedPrefix}hidetag - Anuncio para el clan
  ➢ ${usedPrefix}setwelcome - Configurar entrada

✦ [ 🔗 ᴄᴀɴᴀʟ ᴏғɪᴄɪᴀʟ ]
  ➢ Sígueme aquí: ${global.rcanal || 'https://whatsapp.com'}

──────────────────────────
*El sistema está activo. No me hagas perder el tiempo.*`.trim()

    try {
        // Fallback seguro si las funciones de banner no existen aún en global
        const thumb = typeof global.getBannerThumb === 'function' ? await global.getBannerThumb() : null
        const ctx = typeof global.getNewsletterCtx === 'function' 
            ? global.getNewsletterCtx(thumb, '⚔️ SISTEMA DE CONTRATOS', 'El asesino de hechiceros') 
            : {}

        await conn.sendMessage(m.chat, { 
            text: menuText, 
            contextInfo: ctx 
        }, { quoted: m })

    } catch (e) {
        await m.reply(menuText)
    }
}

handler.command = ['menu', 'help', 'comandos']
export default handler
