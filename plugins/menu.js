/* 
    PLUGIN: MENU TOJI FUSHIGURO
    ESTILO: MERCENARIO
*/

let handler = async (m, { conn, usedPrefix, isOwner, isAdmin, isPremium }) => {
    
    const user = global.database.data.users[m.sender]
    const name = user.name || m.pushName || 'Desconocido'
    const role = isOwner ? global.roles.owner : (isAdmin ? global.roles.admin : global.roles.member)
    
    const menuText = `⚔️  ──  ${global.botName}  ──  ⚔️

Hola, *${name}*.
El dinero mueve el mundo, no las maldiciones. 
Aquí tienes mis servicios actuales:

✦ [ 👤 PERFIL ]
  ➢ Rol: ${role}
  ➢ Zenis: ${user.money || 0}
  ➢ Nivel: ${user.level || 1}

✦ [ ⚔️ MENÚ DE CONTRATOS ]
  ➢ ${usedPrefix}reg - Registrarse en el clan
  ➢ ${usedPrefix}perfil - Tu estado como mercenario
  ➢ ${usedPrefix}shop - Mercado negro (Zenis)
  ➢ ${usedPrefix}sticker - Conversión rápida
  ➢ ${usedPrefix}play - Buscar información (Música/Video)

✦ [ 👑 COMANDOS DE CLAN (ADMINS) ]
  ➢ ${usedPrefix}kick - Expulsar no deseados
  ➢ ${usedPrefix}hidetag - Anuncio para el clan
  ➢ ${usedPrefix}setwelcome - Configurar entrada

✦ [ 🔗 CANAL OFICIAL ]
  ➢ Sígueme aquí: ${global.rcanal}

──────────────────────────
*El sistema está activo. No me hagas perder el tiempo.*`.trim()

    try {
        // Obtenemos el banner y el contexto del newsletter
        const thumb = await global.getBannerThumb()
        const ctx = global.getNewsletterCtx(
            thumb, 
            '⚔️ SISTEMA DE CONTRATOS', 
            'El asesino de hechiceros'
        )

        await conn.sendMessage(m.chat, { 
            text: menuText, 
            contextInfo: ctx 
        }, { quoted: m })

    } catch (e) {
        // Fallback simple si falla la imagen
        await m.reply(menuText)
    }
}

handler.command = ['menu', 'help', 'comandos']
export default handler
