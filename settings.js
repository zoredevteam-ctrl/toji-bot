// ╔══════════════════════════════════════════════════════╗
// ║       TOJI FUSHIGURO BOT - SETTINGS CONFIG           ║
// ║   "No necesito cursed energy... soy la maldición."   ║
// ╚══════════════════════════════════════════════════════╝

global.owner = ['573107400303'] // Tu número con código de país, sin +
global.botName = '༺𝕿𝔧᭄⏤͟͟͞͞𝕿𝖔𝖏𝖎 𝕱𝖚𝖘𝖍𝖎𝖌𝖚𝖗𝖔𒆜℘࿐༵'
global.prefix = '#'

// ── Canal & Newsletter ──────────────────────────────────
global.rcanal        = 'https://whatsapp.com/channel/0029Vb85bh7EAKWOM4Zw8N3G'
global.newsletterJid  = '120363408182996815@newsletter'
global.newsletterName = '༺𝕿𝔧᭄⏤͟͟͞͞𝕿𝖔𝖏𝖎 𝕱𝖚𝖘𝖍𝖎𝖌𝖚𝖗𝖔𒆜℘࿐༵'

// ── Economía ────────────────────────────────────────────
global.moneda = 'Zenis'

// ── Imágenes del bot ────────────────────────────────────
global.banner = 'https://i.pinimg.com/564x/3a/2e/5e/3a2e5e1e6e2b2e5e1e6e2b2e5e1e6e2b.jpg'
global.avatar = 'https://i.pinimg.com/564x/6e/2b/2e/6e2b2e5e1e6e2b2e5e1e6e2b2e5e1e6e.jpg'

// ── Iconos aleatorios de Toji ────────────────────────────
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

global.getRandomIconoToji = () =>
  global.iconosToji[Math.floor(Math.random() * global.iconosToji.length)]

// ── Frases de Toji (respuestas de personaje) ─────────────
global.frasesToji = [
  '...',
  'Hmm.',
  'No me hagas perder el tiempo.',
  'Eso fue demasiado fácil.',
  'Sin cursed energy y aun así por encima de todos.',
  'Los fuertes sobreviven. Los débiles... ya saben.',
  'No necesito técnicas heredadas para destrozarte.',
  'Interesante. Pero no suficiente.',
  '¿Es eso lo mejor que tienes?',
  'El dinero mueve el mundo, no las maldiciones.',
]

global.getRandomFraseToji = () =>
  global.frasesToji[Math.floor(Math.random() * global.frasesToji.length)]

// ── Configuración de límites ─────────────────────────────
global.maxUpload    = 100  // MB
global.maxWait      = 30   // segundos timeout
global.maxSpam      = 5    // mensajes antes de cooldown

// ── Roles ───────────────────────────────────────────────
global.roles = {
  owner:  '👑 Amo del Clan Zenin',
  admin:  '⚔️  Shinobi de élite',
  member: '🌿 Aprendiz',
}

// ── Modo mantenimiento ───────────────────────────────────
global.maintenance = false
global.maintenanceMsg = '⚙️ Estoy en mantenimiento. Vuelve después.'
