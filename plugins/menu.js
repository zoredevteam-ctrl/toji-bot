import { performance } from 'perf_hooks'
import os from 'os'

const handler = async (m, { conn, usedPrefix: px }) => {
    const botName = '𝐓𝐎𝐉𝐈 𝐅𝐔𝐒𝐇𝐈𝐆𝐔𝐑𝐎'
    const version = '𝙃𝙀𝘼𝙑𝙀𝙉𝙇𝙔 𝙍𝙀𝙎𝙏𝙍𝙄𝘾𝙏𝙄𝙊𝙉'
    const developer = '𝐙𝟎𝐑𝐓 𝐒𝐘𝐒𝐓𝐄𝐌𝐒'
    const protocol = '𝐒𝐎𝐑𝐂𝐄𝐑𝐄𝐑 𝐊𝐈𝐋𝐋𝐄𝐑'

    const banner = global.banner
    const canal = global.rcanal || 'https://whatsapp.com'
    const newsletter = global.newstter || canal

    const t0 = performance.now()
    const speed = (performance.now() - t0).toFixed(4)

    const usedRam = (process.memoryUsage().rss / 1024 / 1024).toFixed(1)
    const totalRam = (os.totalmem() / 1024 / 1024 / 1024).toFixed(0)

    const uptime = ((seconds) => {
        const d = Math.floor(seconds / 86400)
        const h = Math.floor((seconds % 86400) / 3600)
        const m = Math.floor((seconds % 3600) / 60)
        return `${d}D ${h}H ${m}M`
    })(process.uptime())

    const user = global?.db?.data?.users?.[m.sender] || {}
    const {
        level = 1,
        exp = 0,
        money = 0
    } = user

    const totalUsers = Object.keys(global?.db?.data?.users || {}).length

    const isOwner = [
        conn.user.jid,
        ...(global.owner || []).map(v => v[0] + '@s.whatsapp.net')
    ].includes(m.sender)

    let menu = `
╭─┈ ⟬ ☠️ ⟭ ┈─╮
│
│  𝐓𝐎𝐉𝐈 𝐅𝐔𝐒𝐇𝐈𝐆𝐔𝐑𝐎
│  ${version}
│
╰─┈─────────┈─╯

> “𝚃𝚑𝚎 𝚘𝚗𝚎 𝚠𝚑𝚘 𝚕𝚎𝚏𝚝 𝚒𝚝 𝚊𝚕𝚕 𝚋𝚎𝚑𝚒𝚗𝚍...”

╭─┈ ⟬ 👤 USER STATUS ⟭ ┈─╮
│ ◦ USER: @${m.sender.split('@')[0]}
│ ◦ LEVEL: ${level}
│ ◦ EXP: ${exp.toLocaleString()}
│ ◦ YEN: ${money.toLocaleString()}
╰─┈─────────┈─╯

╭─┈ ⟬ ⚔️ SYSTEM INFO ⟭ ┈─╮
│ ◦ SPEED: ${speed} MS
│ ◦ RAM: ${usedRam}MB / ${totalRam}GB
│ ◦ UPTIME: ${uptime}
│ ◦ USERS: ${totalUsers}
╰─┈─────────┈─╯

╭─┈ ⟬ 🗡️ GENERAL ⟭ ┈─╮
│ ◦ ${px}menu
│ ◦ ${px}ping
│ ◦ ${px}owner
│ ◦ ${px}uptime
│ ◦ ${px}reg
│ ◦ ${px}clima
│ ◦ ${px}sticker
│ ◦ ${px}toimg
╰─┈─────────┈─╯

╭─┈ ⟬ 👑 GROUP CONTROL ⟭ ┈─╮
│ ◦ ${px}kick
│ ◦ ${px}add
│ ◦ ${px}ban
│ ◦ ${px}tagall
│ ◦ ${px}grupinfo
│ ◦ ${px}antilink
│ ◦ ${px}warn
│ ◦ ${px}welcome
│ ◦ ${px}goodbye
╰─┈─────────┈─╯

╭─┈ ⟬ 🎴 PROFILE SYSTEM ⟭ ┈─╮
│ ◦ ${px}perfil
│ ◦ ${px}userinfo
│ ◦ ${px}setbio
│ ◦ ${px}casar
│ ◦ ${px}divorcio
│ ◦ ${px}adoptar
╰─┈─────────┈─╯

╭─┈ ⟬ 💴 ECONOMY ⟭ ┈─╮
│ ◦ ${px}bal
│ ◦ ${px}daily
│ ◦ ${px}chamba
│ ◦ ${px}dep
│ ◦ ${px}retirar
│ ◦ ${px}transferir
│ ◦ ${px}robar
│ ◦ ${px}top
╰─┈─────────┈─╯

╭─┈ ⟬ 🎲 GAMES ⟭ ┈─╮
│ ◦ ${px}8ball
│ ◦ ${px}dado
│ ◦ ${px}ruleta
│ ◦ ${px}trivia
│ ◦ ${px}adivinanza
╰─┈─────────┈─╯

╭─┈ ⟬ ❤️ REACTIONS ⟭ ┈─╮
│ ◦ ${px}kiss
│ ◦ ${px}hug
│ ◦ ${px}pat
│ ◦ ${px}kill
│ ◦ ${px}bite
│ ◦ ${px}cry
│ ◦ ${px}happy
│ ◦ ${px}angry
│ ◦ ${px}cuddle
│ ◦ ${px}neko
│ ◦ ${px}cafe
│ ◦ ${px}dormir
│ ◦ ${px}push
╰─┈─────────┈─╯
`

    if (isOwner) {
        menu += `

╭─┈ ⟬ ☠️ OWNER PANEL ⟭ ┈─╮
│ ◦ ${px}addpremium
│ ◦ ${px}delpremium
│ ◦ ${px}listpremium
│ ◦ ${px}addowner
│ ◦ ${px}delowner
│ ◦ ${px}listowner
╰─┈─────────┈─╯
`
    }

    menu += `

╭─┈ ⟬ ⚫ ${protocol} ⟭ ┈─╮
│
│  “𝙄 𝙙𝙤𝙣’𝙩 𝙣𝙚𝙚𝙙 𝙨𝙤𝙧𝙘𝙚𝙧𝙮.”
│
│  ${developer} © 2026
│
╰─┈─────────┈─╯
`.trim()

    await conn.sendMessage(m.chat, {
        image: { url: banner },
        caption: menu,
        mentions: [m.sender],
        contextInfo: {
            externalAdReply: {
                title: botName,
                body: 'HEAVENLY RESTRICTION ACTIVE',
                mediaType: 1,
                thumbnailUrl: banner,
                sourceUrl: newsletter,
                renderLargerThumbnail: true
            }
        }
    }, { quoted: m })
}

handler.command = ['menu', 'help', 'comandos']

export default handler