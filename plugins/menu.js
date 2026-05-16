import { performance } from 'perf_hooks'
import os from 'os'

const handler = async (m, { conn, usedPrefix: px }) => {
    const botName = '𝐓𝐎𝐉𝐈 𝐅𝐔𝐒𝐇𝐈𝐆𝐔𝐑𝐎'
    const version = '𝙃𝙀𝘼𝙑𝙀𝙉𝙇𝙔 𝙍𝙀𝙎𝙏𝙍𝙄𝘾𝙏𝙄𝙊𝙉'
    const developer = '˚₊· ͟͟͞͞  ɪ ᴀᴍ  Aᴅʀɪᴇɴ'
    const protocol = '𝐒𝐎𝐑𝐂𝐄𝐑𝐄𝐑 𝐊𝐈𝐋𝐋𝐄Ｒ'

    const banner = global.banner = 'https://upload.yotsuba.giize.com/u/Uj1apzmd.jpg'
    const canal = global.rcanal || 'https://whatsapp.com'
    const newsletter = global.newsletter || canal

    const start = performance.now()
    const speed = (performance.now() - start).toFixed(4)

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
        conn.user?.jid,
        ...(global.owner || []).map(v => v[0] + '@s.whatsapp.net')
    ].filter(Boolean).includes(m.sender)

    let menu = `
*╭╼𝅄꒰𑁍⃪࣭۪ٜ݊݊݊݊݊໑ٜ࣪ ꒱ 𐔌 𝐓𝐎𝐉𝐈  𐦯*
│
│  ${botName}
│  ${version}
│
╰─ׅ─ׅ┈ ─๋︩︪─☪︎︎︎̸⃘̸࣭ٜ࣪࣪࣪۬◌⃘۪֟፝֯۫۫︎⃪𐇽۫۬♰⃘۪֟፝֯۫۫۫۬◌⃘࣭ٜ࣪࣪࣪☪︎︎︎︎̸─ׅ─ׅ┈ ─๋︩︪─╯

> “𝚃𝚑𝚎 𝚘𝚗𝚎 𝚠𝚑𝚘 𝚕𝚎𝚏𝚝 𝚒𝚝 𝚊𝚕𝚕 𝚋𝚎𝚑𝚒𝚗𝚍...”

> ꒰⌢ ʚ˚₊‧ ✎ ꒱ INFO:
- ${botName} es un bot privado, el cual el bot principal no se unirá a tus grupos. Si quieres tener el bot en tu grupo tienes que ser Sub-Bot con *(#code)*
> ꒰⌢ ʚ˚₊‧ ✎ ꒱ ❐ ʚ˚₊‧ʚ˚₊‧ʚ˚

*╭╼𝅄꒰𑁍⃪࣭۪ٜ݊݊݊݊݊໑ٜ࣪ ꒱ 𐔌 INFO - USER 𐦯*
│ ◦ USER: @${m.sender.split('@')[0]}
│ ◦ LEVEL: ${level}
│ ◦ EXP: ${exp.toLocaleString()}
│ ◦ YEN: ${money.toLocaleString()}
╰─ׅ─ׅ┈ ─๋︩︪─☪︎︎︎̸⃘̸࣭ٜ࣪࣪࣪۬◌⃘۪֟፝֯۫۫︎⃪𐇽۫۬♰⃘۪֟፝֯۫۫۫۬◌⃘࣭ٜ࣪࣪࣪☪︎︎︎︎̸─ׅ─ׅ┈ ─๋︩︪─╯

*╭╼𝅄꒰𑁍⃪࣭۪ٜ݊݊݊݊݊໑ٜ࣪ ꒱ 𐔌 BOT - INFO 𐦯*
│ ◦ SPEED: ${speed} MS
│ ◦ RAM: ${usedRam}MB / ${totalRam}GB
│ ◦ UPTIME: ${uptime}
│ ◦ USERS: ${totalUsers}
╰─ׅ─ׅ┈ ─๋︩︪─☪︎︎︎̸⃘̸࣭ٜ࣪࣪࣪۬◌⃘۪֟፝֯۫۫︎⃪𐇽۫۬♰⃘۪֟፝֯۫۫۫۬◌⃘࣭ٜ࣪࣪࣪☪︎︎︎︎̸─ׅ─ׅ┈ ─๋︩︪─╯

*꒰⌢◌⃘࣭ٜ࣪࣪࣪۬☪︎︎︎︎̸ ✎ ꒱ 𐔌 General 𐦯*
│ ۝࿐༵ ${px}menu
│ ۝࿐༵ ${px}ping
│ ۝࿐༵ ${px}owner
│ ۝࿐༵ ${px}uptime
│ ۝࿐༵ ${px}reg
│ ۝࿐༵ ${px}clima
│ ۝࿐༵ ${px}sticker
│ ۝࿐༵ ${px}toimg
╰─ׅ─ׅ┈ ─๋︩︪─☪︎︎︎̸⃘̸࣭ٜ࣪࣪࣪۬◌⃘۪֟፝֯۫۫︎⃪𐇽۫۬♰⃘۪֟፝֯۫۫۫۬◌⃘࣭ٜ࣪࣪࣪☪︎︎︎︎̸─ׅ─ׅ┈ ─๋︩︪─╯

*꒰⌢◌⃘࣭ٜ࣪࣪࣪۬☪︎︎︎︎̸ ✎ ꒱ 𐔌 Grupos 𐦯*
│ ۝࿐༵ ${px}kick
│ ۝࿐༵ ${px}add
│ ۝࿐༵ ${px}ban
│ ۝࿐༵ ${px}tagall
│ ۝࿐༵ ${px}grupinfo
│ ۝࿐༵ ${px}antilink
│ ۝࿐༵ ${px}warn
│ ۝࿐༵ ${px}welcome
│ ۝࿐༵ ${px}goodbye
╰─ׅ─ׅ┈ ─๋︩︪─☪︎︎︎̸⃘̸࣭ٜ࣪࣪࣪۬◌⃘۪֟፝֯۫۫︎⃪𐇽۫۬♰⃘۪֟፝֯۫۫۫۬◌⃘࣭ٜ࣪࣪࣪☪︎︎︎︎̸─ׅ─ׅ┈ ─︩Ḫ๋─╯

*꒰⌢◌⃘࣭ٜ࣪࣪࣪۬☪︎︎︎︎̸ ✎ ꒱ 𐔌 Perfil 𐦯*
│ ۝࿐༵ ${px}perfil
│ ۝࿐༵ ${px}userinfo
│ ۝࿐༵ ${px}setbio
│ ۝࿐༵ ${px}casar
│ ۝࿐༵ ${px}divorcio
│ ۝࿐༵ ${px}adoptar
╰─ׅ─ׅ┈ ─๋︩︪─☪︎︎︎̸⃘̸࣭ٜ࣪࣪࣪۬◌⃘۪֟፝֯۫۫︎⃪𐇽۫۬♰⃘۪֟፝֯۫۫۫۬◌⃘࣭ٜ࣪࣪࣪☪︎︎︎︎̸─ׅ─ׅ┈ ─๋︩︪─╯

*꒰⌢◌⃘࣭ٜ࣪࣪࣪۬☪︎︎︎︎̸ ✎ ꒱ 𐔌 economy 𐦯*
│ ۝࿐༵ ${px}bal
│ ۝࿐༵ ${px}daily
│ ۝࿐༵ ${px}chamba
│ ۝࿐༵ ${px}dep
│ ۝࿐༵ ${px}retirar
│ ۝࿐༵ ${px}transferir
│ ۝࿐༵ ${px}robar
│ ۝࿐༵ ${px}top
╰─ׅ─ׅ┈ ─๋︩︪─☪︎︎︎̸⃘̸࣭ٜ࣪࣪࣪۬◌⃘۪֟፝֯۫۫︎⃪𐇽۫۬♰⃘۪֟፝֯۫۫۫۬◌⃘࣭ٜ࣪࣪࣪☪︎︎︎︎̸─ׅ─ׅ┈ ─๋︩︪─╯

*꒰⌢◌⃘࣭ٜ࣪࣪࣪۬☪︎︎︎︎̸ ✎ ꒱ 𐔌 Games 𐦯*
│ ۝࿐༵ ${px}8ball
│ ۝࿐༵ ${px}dado
│ ۝࿐༵ ${px}ruleta
│ ۝࿐༵ ${px}trivia
│ ۝࿐༵ ${px}adivinanza
╰─ׅ─ׅ┈ ─๋︩︪─☪︎︎︎̸⃘̸࣭ٜ࣪࣪࣪۬◌⃘۪֟፝֯۫۫︎⃪𐇽۫۬♰⃘۪֟፝֯۫۫۫۬◌⃘࣭ٜ࣪࣪࣪☪︎︎︎︎̸─ׅ─ׅ┈ ─๋︩︪─╯

*꒰⌢◌⃘࣭ٜ࣪࣪࣪۬☪︎︎︎︎̸ ✎ ꒱ 𐔌 REACTIONS 𐦯*
│ ۝࿐༵ ${px}kiss
│ ۝࿐༵ ${px}hug
│ ۝࿐༵ ${px}pat
│ ۝࿐༵ ${px}kill
│ ۝࿐༵ ${px}bite
│ ۝࿐༵ ${px}cry
│ ۝࿐༵ ${px}happy
│ ۝࿐༵ ${px}angry
│ ۝࿐༵ ${px}cuddle
│ ۝࿐༵ ${px}neko
│ ۝࿐༵ ${px}cafe
│ ۝࿐༵ ${px}dormir
│ ۝࿐༵ ${px}push
╰─ׅ─ׅ┈ ─๋︩︪─☪︎︎︎̸⃘̸࣭ٜ࣪࣪࣪۬◌⃘۪֟፝֯۫۫︎⃪𐇽۫۬♰⃘۪֟፝֯۫۫۫۬◌⃘࣭ٜ࣪࣪࣪☪︎︎︎︎̸─ׅ─ׅ┈ ─๋︩︪─╯
`

    if (isOwner) {
        menu += `
*╭╼𝅄꒰𑁍⃪࣭۪ٜ݊݊݊݊݊໑ٜ࣪ ꒱ 𐔌 OWNER 𐦯*
│ ۝࿐༵ ${px}addpremium
│ ۝࿐༵ ${px}delpremium
│ ۝࿐༵ ${px}listpremium
│ ۝࿐༵ ${px}addowner
│ ۝࿐༵ ${px}delowner
│ ۝࿐༵ ${px}listowner
╰─ׅ─ׅ┈ ─๋︩︪─☪︎︎︎̸⃘̸࣭ٜ࣪࣪࣪۬◌⃘۪֟፝֯۫۫︎⃪𐇽۫۬♰⃘۪֟፝֯۫۫۫۬◌⃘࣭ٜ࣪࣪࣪☪︎︎︎︎̸─ׅ─ׅ┈ ─๋︩︪─╯
`
    }

    menu += `
> ꒰⌢ ʚ˚₊‧ ✎ ꒱ TOJI:
│
│  “𝙄 𝙙𝙤𝙣’𝙩 𝙣𝙚𝙚𝙙 𝙨𝙤𝙧𝙘𝙚𝙧𝙮.”
│
│  ${developer} © 2026
│
╰─ׅ─ׅ┈ ─๋︩︪─☪︎︎︎̸⃘̸࣭ٜ࣪࣪࣪۬◌⃘۪֟፝֯۫۫︎⃪𐇽۫۬♰⃘۪֟፝֯۫۫۫۬◌⃘࣭ٜ࣪࣪࣪☪︎︎︎︎̸─ׅ─ׅ┈ ─๋︩︪─╯
`.trim()

    await conn.sendMessage(m.chat, {
        document: { url: banner },
        mimetype: 'application/pdf',
        fileName: ' TOJI FUSHIGURO ',
        fileLength: 999999999999,
        pageCount: 1,
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
