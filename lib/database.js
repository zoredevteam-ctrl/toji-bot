import { JSONPreset } from 'lowdb/node' // Nueva forma correcta para lowdb v7+
import path from 'path'
import { fileURLToPath } from 'url'
import chalk from 'chalk'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dbPath    = path.join(__dirname, '../database.json')

// ── Paleta Toji Fushiguro (Mercenary Core) ────────────────────────────────────
const cCurse = chalk.hex('#8B5CF6') // Púrpura Energía Maldita
const cBlood = chalk.hex('#EF4444') // Rojo Restricción Celestial

const defaultData = {
    users: {},
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

// JSONPreset hace todo el trabajo de Low y el adaptador en una sola línea
const db = await JSONPreset(dbPath, defaultData)

async function initDB() {
    try {
        // En lowdb v7 con JSONPreset, los datos ya se leen automáticamente al iniciar,
        // pero aseguramos que las propiedades hijas existan:
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
    data: db.data,
// ... [Todo lo demás de tu archivo getUser, save, read, reset se queda EXACTAMENTE IGUAL] ...
