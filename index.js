// ╔══════════════════════════════════════════════════════════╗
// ║        TOJI FUSHIGURO BOT — INDEX.JS                     ║
// ║  "La técnica más poderosa... soy yo mismo."              ║
// ╚══════════════════════════════════════════════════════════╝

require('./settings')

const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
  makeInMemoryStore,
  jidNormalizedUser,
} = require('@whiskeysockets/baileys')

const pino        = require('pino')
const chalk       = require('chalk')
const figlet      = require('figlet')
const fs          = require('fs-extra')
const path        = require('path')
const { handler } = require('./handler')
const { color, smsg } = require('./lib/simple')

const store = makeInMemoryStore({
  logger: pino({ level: 'silent' }).child({ level: 'silent' }),
})

// ── Banner de inicio ─────────────────────────────────────
function printBanner() {
  console.clear()
  console.log(
    chalk.red(
      figlet.textSync('TOJI', { font: 'ANSI Shadow', horizontalLayout: 'full' })
    )
  )
  console.log(chalk.gray('  ──────────────────────────────────────────'))
  console.log(chalk.white.bold('  ༺𝕿𝖔𝖏𝖎 𝕱𝖚𝖘𝖍𝖎𝖌𝖚𝖗𝖔 Bot') + chalk.red(' ⚔️'))
  console.log(chalk.gray('  Sin cursed energy... y aún el más fuerte.'))
  console.log(chalk.gray('  ──────────────────────────────────────────\n'))
}

// ── Conexión principal ───────────────────────────────────
async function startBot() {
  printBanner()

  const { state, saveCreds } = await useMultiFileAuthState('./src/session')
  const { version }           = await fetchLatestBaileysVersion()

  const client = makeWASocket({
    version,
    logger: pino({ level: 'silent' }),
    printQRInTerminal: true,
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'silent' })),
    },
    browser: ['Toji Fushiguro', 'Safari', '1.0.0'],
    getMessage: async (key) => {
      if (store) {
        const msg = await store.loadMessage(key.remoteJid, key.id)
        return msg?.message || undefined
      }
      return { conversation: 'Hola' }
    },
  })

  store.bind(client.ev)

  // ── Eventos ──────────────────────────────────────────
  client.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update

    if (qr) {
      console.log(chalk.yellow('\n  📱 Escanea el QR para conectar...\n'))
    }

    if (connection === 'close') {
      const code = lastDisconnect?.error?.output?.statusCode
      const shouldReconnect = code !== DisconnectReason.loggedOut

      console.log(
        chalk.red(`\n  ⚠️  Conexión cerrada. Código: ${code}`) +
        (shouldReconnect ? chalk.yellow(' — Reconectando...') : chalk.red(' — Sesión cerrada.'))
      )

      if (shouldReconnect) setTimeout(startBot, 3000)
    }

    if (connection === 'open') {
      console.log(chalk.green('\n  ✅ Bot conectado correctamente.'))
      console.log(chalk.gray(`  🔗 Canal: ${global.rcanal}\n`))

      // Notificación al owner
      for (const ownerNum of global.owner) {
        await client.sendMessage(`${ownerNum}@s.whatsapp.net`, {
          text: `⚔️ *${global.botName}*\n\n_Conectado y listo para operar._\n\n> Sin cursed energy... y aún así aquí.`,
        }).catch(() => {})
      }
    }
  })

  client.ev.on('creds.update', saveCreds)

  client.ev.on('messages.upsert', async ({ messages, type }) => {
    if (type !== 'notify') return
    const msg = messages[0]
    if (!msg?.message) return

    const m = smsg(client, msg, store)
    await handler(client, m, store).catch(console.error)
  })

  // ── Grupos: actualizar participantes ──────────────────
  client.ev.on('group-participants.update', async ({ id, participants, action }) => {
    const metadata = await client.groupMetadata(id).catch(() => null)
    if (!metadata) return

    for (const jid of participants) {
      const ppUrl = await client.profilePictureUrl(jid, 'image').catch(() => global.avatar)

      if (action === 'add') {
        await client.sendMessage(id, {
          image: { url: ppUrl },
          caption:
            `⚔️ *Bienvenido al grupo, ${jid.split('@')[0]}.*\n\n` +
            `_"Aquí los débiles no duran. Demuestra lo que vales."_\n\n` +
            `— ${global.botName}`,
        })
      } else if (action === 'remove') {
        await client.sendMessage(id, {
          text: `🌿 *${jid.split('@')[0]}* salió del grupo.\n_"Otro que no pudo aguantar el peso."_`,
        })
      }
    }
  })

  return client
}

startBot()
