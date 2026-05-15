// ╔══════════════════════════════════════════════════════════╗
// ║        TOJI FUSHIGURO BOT — LIB/DATABASE.JS              ║
// ╚══════════════════════════════════════════════════════════╝

const fs   = require('fs-extra')
const path = require('path')

const DB_PATH = path.join(__dirname, '../src/database/database.json')

// ── Estructura inicial ────────────────────────────────────
const defaultDB = {
  users: {},
  groups: {},
  stats: {
    totalCommands: 0,
    startedAt: Date.now(),
  },
}

// ── Leer DB ───────────────────────────────────────────────
function readDB() {
  try {
    if (!fs.existsSync(DB_PATH)) {
      fs.ensureDirSync(path.dirname(DB_PATH))
      fs.writeJsonSync(DB_PATH, defaultDB, { spaces: 2 })
    }
    return fs.readJsonSync(DB_PATH)
  } catch {
    return { ...defaultDB }
  }
}

// ── Guardar DB ────────────────────────────────────────────
function saveDB(data) {
  try {
    fs.writeJsonSync(DB_PATH, data, { spaces: 2 })
    return true
  } catch {
    return false
  }
}

// ── Usuario ───────────────────────────────────────────────
function getUser(jid) {
  const db = readDB()
  const id = jid.replace('@s.whatsapp.net', '')

  if (!db.users[id]) {
    db.users[id] = {
      id,
      name:       '',
      balance:    0,
      xp:         0,
      level:      1,
      job:        null,
      lastDaily:  0,
      lastWork:   0,
      lastRob:    0,
      inventory:  [],
      banned:     false,
      premium:    false,
      createdAt:  Date.now(),
    }
    saveDB(db)
  }

  return db.users[id]
}

function saveUser(jid, data) {
  const db = readDB()
  const id = jid.replace('@s.whatsapp.net', '')
  db.users[id] = { ...db.users[id], ...data }
  return saveDB(db)
}

// ── Economía ──────────────────────────────────────────────
function addBalance(jid, amount) {
  const user = getUser(jid)
  saveUser(jid, { balance: (user.balance || 0) + amount })
}

function deductBalance(jid, amount) {
  const user = getUser(jid)
  const newBal = (user.balance || 0) - amount
  saveUser(jid, { balance: Math.max(0, newBal) })
  return newBal >= 0
}

function getBalance(jid) {
  return getUser(jid).balance || 0
}

// ── Grupo ─────────────────────────────────────────────────
function getGroup(jid) {
  const db = readDB()
  const id = jid

  if (!db.groups[id]) {
    db.groups[id] = {
      id,
      welcome:    true,
      antilink:   false,
      antitoxic:  false,
      nsfw:       false,
      createdAt:  Date.now(),
    }
    saveDB(db)
  }

  return db.groups[id]
}

function saveGroup(jid, data) {
  const db = readDB()
  db.groups[jid] = { ...db.groups[jid], ...data }
  return saveDB(db)
}

// ── Stats ─────────────────────────────────────────────────
function incrementStat(key) {
  const db = readDB()
  db.stats[key] = (db.stats[key] || 0) + 1
  saveDB(db)
}

function getStats() {
  return readDB().stats || {}
}

// ── Ranking ───────────────────────────────────────────────
function getTopUsers(limit = 10) {
  const db = readDB()
  return Object.values(db.users)
    .sort((a, b) => (b.balance || 0) - (a.balance || 0))
    .slice(0, limit)
}

module.exports = {
  readDB,
  saveDB,
  getUser,
  saveUser,
  addBalance,
  deductBalance,
  getBalance,
  getGroup,
  saveGroup,
  incrementStat,
  getStats,
  getTopUsers,
}
