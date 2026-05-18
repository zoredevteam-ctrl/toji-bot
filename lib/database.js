import { JSONFilePreset } from 'lowdb/node'
import path from 'path'
import { fileURLToPath } from 'url'
import chalk from 'chalk'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dbPath    = path.join(__dirname, '../database.json')

// ── Paleta Toji Fushiguro ─────────────────────────────────────────────────────
const cCurse = chalk.hex('#8B5CF6')
const cBlood = chalk.hex('#EF4444')

// ✅ Se añadió "chats" — handler.js lo requiere para funcionar
const defaultData = {
    users: {},
    chats: {},      // ← CRÍTICO: handler.js busca global.db.data.chats
    groups: {},
    subbots: {},
    settings: {
        mode:      'public',
        welcome:   true,
        antilink:  false,
        antispam:  false,
        modoowner: false,
        prefix:    '#'
    },
    stats: {
        totalCommands: 0,
        startTime:     Date.now()
    }
}

const db = await JSONFilePreset(dbPath, defaultData)

async function initDB() {
    try {
        // ✅ Garantizar que chats existe antes de que handler.js lo use
        if (!db.data.users)    db.data.users    = {}
        if (!db.data.chats)    db.data.chats    = {}
        if (!db.data.groups)   db.data.groups   = {}
        if (!db.data.subbots)  db.data.subbots  = {}

        db.data.settings = { ...defaultData.settings, ...(db.data.settings || {}) }
        db.data.stats    = { ...defaultData.stats,    ...(db.data.stats    || {}) }

        await db.write()
        console.log(cCurse('  ⚔️  [DATABASE]') + chalk.white(' Base de datos vinculada — Toji Fushiguro Core System ⚔️'))
    } catch (e) {
        console.error(cBlood('  ⚔️  [DATABASE ERROR]'), e)
    }
}

await initDB()

// Guardado automático cada 60 segundos
setInterval(async () => {
    try { await db.write() } catch {}
}, 60_000)

export const database = {
    get data() {
        return db.data
    },

    getUser(jid) {
        if (!db.data.users) db.data.users = {}
        if (!db.data.users[jid]) {
            db.data.users[jid] = {
                registered:       false,
                premium:          false,
                banned:           false,
                warning:          0,
                exp:              0,
                level:            1,
                money:            0,
                bank:             0,
                limit:            20,
                lastclaim:        0,
                registered_time:  0,
                name:             '',
                age:              null
            }
        }
        return db.data.users[jid]
    },

    getChat(jid) {
        if (!db.data.chats) db.data.chats = {}
        if (!db.data.chats[jid]) {
            db.data.chats[jid] = {
                isBanned:      false,
                welcome:       true,
                antiLink:      true,
                modoadmin:     false,
                detect:        true,
                primaryBot:    null,
                bannedBots:    []
            }
        }
        return db.data.chats[jid]
    },

    async save() {
        try { await db.write() } catch (e) {
            console.log(cBlood('  ⚔️  [DATABASE SAVE ERROR]'), e.message)
        }
    },

    async read() {
        try {
            await db.read()
        } catch (e) {
            console.log(cBlood('  ⚔️  [DATABASE READ ERROR]'), e.message)
        }
    },

    async reset() {
        db.data = { ...defaultData }
        await db.write()
        console.log(chalk.yellow('  ⚔️  [DATABASE] Contrato reiniciado. Datos restablecidos por el Amo del Clan 👑.'))
    }
}
