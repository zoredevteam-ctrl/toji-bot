import { watchFile, unwatchFile } from 'fs'
import chalk from 'chalk'
import { fileURLToPath } from 'url'
import fs from 'fs'
import fetch from 'node-fetch'
import axios from 'axios'
import moment from 'moment-timezone'

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.botNumber = ''

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.owner = [
// <-- Número @s.whatsapp.net -->
  ['18294868853', 'Aarom', true],
// Agrega tus owners aquí
];

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.mods = []
global.suittag = ['18294868853']
global.prems = []

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.libreria = 'Baileys'
global.baileys = 'V 6.7.16'
global.languaje = 'Español'
global.vs = '1.0.0'
global.nameqr = 'Toji-Fushiguro-Bot-MD'
global.namebot = '⚔️ 𝙏𝙤𝙟𝙞 𝙁𝙪𝙨𝙝𝙞𝙜𝙪𝙧𝙤 𝘽𝙤𝙩 ⚔️'
global.Rubysessions = 'Toji-Sessions'
global.jadi = 'TojiJadiBots'
global.RubyJadibts = true
global.subbotlimitt = 30
global.baileysSocketConfig = {
  connectTimeoutMs: 45000,
  keepAliveIntervalMs: 20000,
  retryRequestDelayMs: 1500,
  defaultQueryTimeoutMs: 30000
}

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.packname = '⚔️ 𝗧𝗼𝗷𝗶 𝗙𝘂𝘀𝗵𝗶𝗴𝘂𝗿𝗼 𝗕𝗼𝘁'
global.botname = '⚔️ 𝙏𝙤𝙟𝙞 𝙁𝙪𝙨𝙝𝙞𝙜𝙪𝙧𝙤 𝘽𝙤𝙩 ⚔️'
global.wm = '⚔️ Toji-Fushiguro-Bot-MD'
global.author = 'Made by Aarom'
global.dev = '⌬ Modified by: Aarom ⚙️💻'
global.textbot = '⚔️ 𝗧𝗼𝗷𝗶 𝗙𝘂𝘀𝗵𝗶𝗴𝘂𝗿𝗼 𝗕𝗼𝘁 • 𝗣𝗼𝘄𝗲𝗿𝗲𝗱 𝗕𝘆 𝗔𝗮𝗿𝗼𝗺'
global.etiqueta = '⚔️ Toji Fushiguro Bot'

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.moneda = 'Zenis'

// Banner e ícono de Toji Fushiguro
global.banner = 'https://i.pinimg.com/564x/3a/2e/5e/3a2e5e1e6e2b2e5e1e6e2b2e5e1e6e2b.jpg'
global.avatar = 'https://i.pinimg.com/564x/6e/2b/2e/6e2b2e5e1e6e2b2e5e1e6e2b2e5e1e6e.jpg'

// Iconos de Toji para thumbnails (miniaturas para mensajes)
global.iconosToji = [
  'https://i.pinimg.com/736x/e4/7f/cb/e47fcb0e2a1b3c4d5e6f7a8b9c0d1e2f.jpg',
  'https://i.pinimg.com/736x/a1/b2/c3/a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6.jpg',
  'https://i.pinimg.com/736x/f1/e2/d3/f1e2d3c4b5a6f7e8d9c0b1a2f3e4d5c6.jpg',
  'https://i.pinimg.com/736x/b5/c6/d7/b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0.jpg',
  'https://i.pinimg.com/736x/c9/d0/e1/c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4.jpg',
  'https://i.pinimg.com/736x/d3/e4/f5/d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8.jpg',
  'https://i.pinimg.com/736x/e7/f8/a9/e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2.jpg',
  'https://i.pinimg.com/736x/f0/a1/b2/f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5.jpg',
]

global.getRandomIconoToji = () => global.iconosToji[Math.floor(Math.random() * global.iconosToji.length)]

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.gp1 = 'https://chat.whatsapp.com/XXXXXXXXXXXXXXXXXXXXXXX'
global.comunidad1 = 'https://chat.whatsapp.com/XXXXXXXXXXXXXXXXXXXXXXX'

// ⚠️ REEMPLAZA con tu propio canal y newsletter
global.channel = 'https://whatsapp.com/channel/0029Vb85bh7EAKWOM4Zw8N3G'
global.channel2 = 'https://whatsapp.com/channel/0029Vb85bh7EAKWOM4Zw8N3G'
global.rcanal = 'https://whatsapp.com/channel/0029Vb85bh7EAKWOM4Zw8N3G'
global.md = 'https://github.com/tuusuario/toji-fushiguro-bot'
global.correo = 'tucorreo@gmail.com'
global.cn = 'https://whatsapp.com/channel/0029Vb85bh7EAKWOM4Zw8N3G'

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

// Newsletter (canal de WhatsApp del bot)
// ⚠️ REEMPLAZA con el JID de tu propio newsletter
global.newsletterJid = '120363408182996815@newsletter'
global.newsletterName = '⚔️ Toji Fushiguro Bot | Updates'

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

global.ch = {
  ch1: global.newsletterJid,
}

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

// catalogo.jpg — imagen representativa del bot (Toji)
// Crea un src/catalogo.jpg con una imagen de Toji
import { createRequire } from 'module'
const require = createRequire(import.meta.url)

let _catalogoBuf = null
try {
  _catalogoBuf = fs.readFileSync('./src/catalogo.jpg')
} catch (e) {
  _catalogoBuf = Buffer.alloc(0)
}
global.catalogo = _catalogoBuf

global.estilo = {
  key: {
    fromMe: false,
    participant: '0@s.whatsapp.net',
    ...(false ? { remoteJid: '0@g.us' } : {})
  },
  message: {
    orderMessage: {
      itemCount: -999999,
      status: 1,
      surface: 1,
      message: global.packname,
      orderTitle: 'Toji',
      thumbnail: global.catalogo,
      sellerJid: '0@s.whatsapp.net'
    }
  }
}

//*─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─⭒─ׄ─ׅ─ׄ─*

let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
  unwatchFile(file)
  console.log(chalk.redBright("Update 'settings.js'"))
  import(`${file}?update=${Date.now()}`)
})
