// lib/respuesta.js — Mensajes de error con personalidad de Toji Fushiguro

const newsletterJid = global.newsletterJid || '120363408182996815@newsletter'
const newsletterName = global.newsletterName || '⚔️ Toji Fushiguro Bot | Updates'
const packname = global.packname || '⚔️ Toji Fushiguro Bot'

// Imágenes de Toji para thumbnails
const iconosToji = [
  'https://i.pinimg.com/736x/3b/4c/5d/3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e.jpg',
  'https://i.pinimg.com/736x/9f/0a/1b/9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c.jpg',
  'https://i.pinimg.com/736x/5e/6f/7a/5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b.jpg',
  'https://i.pinimg.com/736x/1c/2d/3e/1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f.jpg',
  'https://i.pinimg.com/736x/7a/8b/9c/7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d.jpg',
]

const getRandomIcono = () => {
  if (global.getRandomIconoToji) return global.getRandomIconoToji()
  return iconosToji[Math.floor(Math.random() * iconosToji.length)]
}

const getSourceUrl = () => global.rcanal || 'https://whatsapp.com/channel/0029Vb85bh7EAKWOM4Zw8N3G'

const getRandomThumbnail = async (conn) => {
  const url = getRandomIcono()
  try {
    const file = await conn.getFile(url)
    if (file?.data && file?.mime?.startsWith('image/')) return { thumbnail: file.data }
  } catch (e) {
    // silencioso
  }
  return {}
}

const handler = async (type, conn, m) => {
  const msgs = {
    rowner: '⚔️ *Tch.* Solo mi creador puede usar eso.\n\n> Ni lo intentes.',

    owner: '⚔️ *¿Tú?* Eso es solo para los dueños y programadores del bot.\n\n> Busca otra cosa que hacer.',

    mods: '⚔️ Solo mis moderadores pueden ejecutar eso.\n\n> No eres suficiente.',

    premium: '⚔️ *Premium.* Esa función tiene un precio.\n\n💴 ¿Quieres acceso?\n> Usa: *.comprarpremium 2 dias*\n\n> Sin eso, ni hablar.',

    group: '⚔️ Ese comando solo funciona en *grupos*.\n\n> Aprende a leer el contexto.',

    private: '⚔️ Habla conmigo en *privado* para usar eso.\n\n> No todo es para audiencias.',

    admin: '⚔️ Solo los *admins* pueden hacer eso en este grupo.\n\n> ¿No eres admin? Entonces cállate.',

    botAdmin: '⚔️ *Hazme admin* y verás de qué soy capaz.\n\n> Sin permisos, no hay poder.',

    unreg: '⚔️ *¿Quién eres tú?*\n\nNo estás registrado. Regístrate primero:\n*/reg nombre.edad*\n\nEjemplo:\n*/reg Toji.30*\n\n> Sin nombre, no hay comandos.',

    restrict: '⚔️ Esa función está *desactivada* por ahora.\n\n> Ni te molestes.'
  }

  const msg = msgs[type]
  if (!msg) return true

  const thumbnailInfo = await getRandomThumbnail(conn)
  const sourceUrl = getSourceUrl()

  const contextInfo = {
    mentionedJid: [m.sender],
    isForwarded: true,
    forwardingScore: 999,
    forwardedNewsletterMessageInfo: {
      newsletterJid,
      newsletterName,
      serverMessageId: -1
    },
    externalAdReply: {
      title: packname,
      body: '⚔️ Toji Fushiguro Bot',
      ...thumbnailInfo,
      sourceUrl,
      mediaUrl: sourceUrl,
      mediaType: 1,
      renderLargerThumbnail: false
    }
  }

  return conn.reply(m.chat, msg, m, { contextInfo }).then(_ => m.react('⚔️'))
}

export default handler
