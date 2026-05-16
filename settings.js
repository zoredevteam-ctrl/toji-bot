import fs from 'fs'
import chalk from 'chalk'
import { fileURLToPath } from 'url'

// ══════════════════════════════════════════
//   ✦  T O J I  F U S H I G U R O  —  C O R E
// ══════════════════════════════════════════

global.botName    = '༺𝕿𝔧᭄⏤͟͟͞͞𝕿𝖔𝖏𝖎 𝕱𝖚𝖘𝖍𝖎𝖌𝖚𝖗𝖔𒆜℘࿐༵'
global.ownerName  = '˚₊· ͟͟͞͞  ɪ ᴀᴍ  Aᴅʀɪᴇɴ'
global.botVersion = '1.0.0'

global.owner = [
  ['573107400303',    '˚₊· ͟͟͞͞  ɪ ᴀᴍ  Aᴅʀɪᴇɴ', true],
  ['123613520896125', '˚₊· ͟͟͞͞  ɪ ᴀᴍ  Aᴅʀɪᴇɴ LID', true],
  ['51925092348',     'Jhon', true],
  ['162234554671342', 'Jhon LID', true]
]

global.owners = global.owner.map(v => v[0])
global.mods   = []
global.prems  = []
global.prefix = '#'

// ── Economía & Config ───────────────────────────────────
global.moneda = 'Zenis'
global.maxUpload    = 100  // MB
global.maxWait      = 30   // segundos timeout
global.maxSpam      = 5    // mensajes antes de cooldown

// ══════════════════════════════════════════
//   ✦  E N L A C E S  Y  M E D I A
// ══════════════════════════════════════════

global.rcanal         = 'https://whatsapp.com/channel/0029Vb85bh7EAKWOM4Zw8N3G'
global.newsletterJid  = '120363408182996815@newsletter'
global.newsletterName = '༺𝕿𝔧᭄⏤͟͟͞͞𝕿𝖔𝖏𝖎 𝕱𝖚𝖘𝖍𝖎𝖌𝖚𝖗𝖔𒆜℘࿐༵'

global.banner = 'https://upload.yotsuba.giize.com/u/Uj1apzmd.jpg'
global.icono  = 'https://upload.yotsuba.giize.com/u/Ti0_n2am.png'

// ── Iconos aleatorios de Toji ────────────────────────────
global.iconosToji = [
  'https://upload.yotsuba.giize.com/u/-tuY-BFS.png',
  'https://upload.yotsuba.giize.com/u/l6OnzK9q.png',
  'https://upload.yotsuba.giize.com/u/Tv2DigZL.png',
  'https://upload.yotsuba.giize.com/u/h8B9BZl2.png',
  'https://upload.yotsuba.giize.com/u/piI2v8gs.png',
  'https://upload.yotsuba.giize.com/u/usI7bQPP.png',
  'https://upload.yotsuba.giize.com/u/lEyi2QOg.png',
  'https://upload.yotsuba.giize.com/u/25m4q8ds.png'
]

global.getRandomIconoToji = () => global.iconosToji[Math.floor(Math.random() * global.iconosToji.length)]

// ── Frases de Toji ───────────────────────────────────────
global.frasesToji = [
  '...', 'Hmm.', 'No me hagas perder el tiempo.', 'Eso fue demasiado fácil.',
  'Sin cursed energy y aun así por encima de todos.', 'Los fuertes sobreviven. Los débiles... ya saben.',
  'No necesito técnicas heredadas para destrozarte.', 'Interesante. Pero no suficiente.',
  '¿Es eso lo mejor que tienes?', 'El dinero mueve el mundo, no las maldiciones.'
]

global.getRandomFraseToji = () => global.frasesToji[Math.floor(Math.random() * global.frasesToji.length)]

// ══════════════════════════════════════════
//   ✦  H E L P E R S  D E  I M A G E N
// ══════════════════════════════════════════

global.getBannerThumb = async () => {
    try {
        const res = await fetch(global.banner)
        return Buffer.from(await res.arrayBuffer())
    } catch { return null }
}

global.getIconThumb = async () => {
    try {
        const res = await fetch(global.icono)
        return Buffer.from(await res.arrayBuffer())
    } catch { return null }
}

// ══════════════════════════════════════════
//   ✦  N E W S L E T T E R  C O N T E X T
// ══════════════════════════════════════════

global.getNewsletterCtx = (thumbnail = null, title = null, body = null, renderLarge = false) => ({
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
        newsletterJid:   global.newsletterJid,
        serverMessageId: -1,
        newsletterName:  global.newsletterName
    },
    externalAdReply: {
        title:                 title || `⚔️ ${global.botName}`,
        body:                  body  || global.ownerName,
        mediaType:             1,
        mediaUrl:              global.rcanal,
        sourceUrl:             global.rcanal,
        thumbnail,
        showAdAttribution:     false,
        containsAutoReply:     true,
        renderLargerThumbnail: renderLarge
    }
})

// ══════════════════════════════════════════
//   ✦  M E N S A J E S  D E  S I S T E M A
// ══════════════════════════════════════════

global.mess = {
    wait:     '⚔️ Un momento...',
    success:  '⚔️ Listo. Demasiado fácil.',
    error:    '⚔️ Algo salió mal. No me hagas perder el tiempo.',
    owner:    '👑 Solo mi jefe (Amo del Clan) puede usar esto.',
    group:    '🌿 Esto solo sirve dentro de grupos.',
    admin:    '⚔️ Acceso denegado. Solo para Shinobis de élite.',
    botAdmin: '⚔️ Necesito ser administrador para encargarme de esto.',
    restrict: '🔒 Esta función se encuentra bloqueada.',
    notReg:   '🌿 No estás registrado. Date de alta primero.'
}

// ── Roles ───────────────────────────────────────────────
global.roles = {
  owner:  '👑 Amo del Clan Zenin',
  admin:  '⚔️  Shinobi de élite',
  member: '🌿 Aprendiz'
}

// ══════════════════════════════════════════
//   ✦  A U T O - R E L O A D
// ══════════════════════════════════════════

const file = fileURLToPath(import.meta.url)
fs.watchFile(file, async () => {
    try {
        fs.unwatchFile(file)
        console.log(chalk.cyanBright('\n⚔️ [SETTINGS] Configuración de Toji Recargada.'))
        await import(`${file}?update=${Date.now()}`)
    } catch (e) {
        console.error(chalk.red('[!] Error en auto-reload:'), e)
    }
})

export default global
