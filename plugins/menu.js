import { performance } from 'perf_hooks'
import os from 'os'

const handler = async (m, { conn, usedPrefix: px }) => {
    const botName = '𝐓𝐎𝐉𝐈 𝐅𝐔𝐒𝐇𝐈𝐆𝐔𝐑𝐎'
    const version = '𝙃𝙀𝘼𝙑𝙀𝙉𝙇𝙔 𝙍𝙀𝙎𝙏𝙍𝙄𝘾𝙏𝙄𝙊𝙉'
    const developer = '˚₊· ͟͟͞͞  ɪ ᴀᴍ  Aᴅʀɪᴇɴ'
    const protocol = '𝐒𝐎𝐑𝐂𝐄𝐑𝐄𝐑 𝐊𝐈𝐋𝐋𝐄Ｒ'

    const banner = global.banner = 'https://upload.yotsuba.giize.com/u/-6zIeeUe.jpeg'
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

> ♰ \`${px}menu\`
*Muestra la lista completa de comandos interactivos del sistema.* (⁠◍⁠•⁠ᴗ⁠•⁠◍⁠)

> ♰ \`${px}ping\`
*Verifica la velocidad de respuesta y latencia actual del bot.* (⁠◍⁠•⁠ᴗ⁠•⁠◍⁠)

> ♰ \`${px}owner\`
*Muestra la información de contacto del creador oficial.* (⁠◍⁠•⁠ᴗ⁠•⁠◍⁠)

> ♰ \`${px}uptime\`
*Consulta el tiempo total que el bot lleva encendido sin interrupciones.* (⁠◍⁠•⁠ᴗ⁠•⁠◍⁠)

> ♰ \`${px}reg\`
*Registra tu usuario en la base de datos para desbloquear funciones.* (⁠◍⁠•⁠ᴗ⁠•⁠◍⁠)

> ♰ \`${px}clima\`
*Muestra el estado del clima actual de una ciudad específica.* (⁠◍⁠•⁠ᴗ⁠•⁠◍⁠)

> ♰ \`${px}sticker\`
*Convierte imágenes, videos o GIFs en stickers para WhatsApp.* (⁠◍⁠•⁠ᴗ⁠•⁠◍⁠)

> ♰ \`${px}toimg\`
*Convierte un sticker seleccionado de vuelta a una imagen fija.* (⁠◍⁠•⁠ᴗ⁠•⁠◍⁠)

*꒰⌢◌⃘࣭ٜ࣪࣪࣪۬☪︎︎︎︎̸ ✎ ꒱ 𐔌 Grupos 𐦯*

> ♰ \`${px}kick\`
*Elimina a un miembro problemático del grupo actual.* (⁠◍⁠•⁠ᴗ⁠•⁠◍⁠)

> ♰ \`${px}add\`
*Agrega a un nuevo participante al grupo mediante su número.* (⁠◍⁠•⁠ᴗ⁠•⁠◍⁠)

> ♰ \`${px}ban\`
*Banea a un usuario para evitar que use las funciones del bot.* (⁠◍⁠•⁠ᴗ⁠•⁠◍⁠)

> ♰ \`${px}tagall\`
*Menciona a todos los miembros del grupo en un solo mensaje.* (⁠◍⁠•⁠ᴗ⁠•⁠◍⁠)

> ♰ \`${px}grupinfo\`
*Muestra los datos, configuración y estado del grupo actual.* (⁠◍⁠•⁠ᴗ⁠•⁠◍⁠)

> ♰ \`${px}antilink\`
*Activa o desactiva el sistema de seguridad contra enlaces.* (⁠◍⁠•⁠ᴗ⁠•⁠◍⁠)

> ♰ \`${px}warn\`
*Aplica una advertencia de aviso a un miembro del grupo.* (⁠◍⁠•⁠ᴗ⁠•⁠◍⁠)

> ♰ \`${px}welcome\`
*Configura o activa el mensaje de bienvenida para nuevos miembros.* (⁠◍⁠•⁠ᴗ⁠•⁠◍⁠)

> ♰ \`${px}goodbye\`
*Configura o activa el mensaje de despedida del grupo.* (⁠◍⁠•⁠ᴗ⁠•⁠◍⁠)

*꒰⌢◌⃘࣭ٜ࣪࣪࣪۬☪︎︎︎︎̸ ✎ ꒱ 𐔌 Perfil 𐦯*

> ♰ \`${px}perfil\`
*Visualiza tu tarjeta de perfil con todas tus estadísticas.* (⁠◍⁠•⁠ᴗ⁠•⁠◍⁠)

> ♰ \`${px}userinfo\`
*Muestra la información detallada de un usuario mencionado.* (⁠◍⁠•⁠ᴗ⁠•⁠◍⁠)

> ♰ \`${px}setbio\`
*Cambia o actualiza tu biografía personalizada del bot.* (⁠◍⁠•⁠ᴗ⁠•⁠◍⁠)

> ♰ \`${px}casar\`
*Propón matrimonio a otro usuario del bot para uniros.* (⁠◍⁠•⁠ᴗ⁠•⁠◍⁠)

> ♰ \`${px}divorcio\`
*Termina tu matrimonio actual y vuelve a la soltería.* (⁠◍⁠•⁠ᴗ⁠•⁠◍⁠)

> ♰ \`${px}adoptar\`
*Adopta a un usuario del grupo para que sea tu hijo.* (⁠◍⁠•⁠ᴗ⁠•⁠◍⁠)

*꒰⌢◌⃘࣭ٜ࣪࣪࣪۬☪︎︎︎︎̸ ✎ ꒱ 𐔌 Economy 𐦯*

> ♰ \`${px}bal\`
*Consulta tu balance actual de monedas en billetera y banco.* (⁠◍⁠•⁠ᴗ⁠•⁠◍⁠)

> ♰ \`${px}daily\`
*Reclama tu recompensa diaria gratuita de monedas.* (⁠◍⁠•⁠ᴗ⁠•⁠◍⁠)

> ♰ \`${px}chamba\`
*Trabaja en un oficio aleatorio para ganar un sueldo estable.* (⁠◍⁠•⁠ᴗ⁠•⁠◍⁠)

> ♰ \`${px}dep\`
*Deposita tus monedas de la billetera directamente al banco.* (⁠◍⁠•⁠ᴗ⁠•⁠◍⁠)

> ♰ \`${px}retirar\`
*Retira la cantidad de monedas que necesites de tu banco.* (⁠◍⁠•⁠ᴗ⁠•⁠◍⁠)

> ♰ \`${px}transferir\`
*Envía una cantidad de tus monedas a otro usuario.* (⁠◍⁠•⁠ᴗ⁠•⁠◍⁠)

> ♰ \`${px}robar\`
*Intenta asaltar la billetera de otro usuario con riesgo.* (⁠◍⁠•⁠ᴗ⁠•⁠◍⁠)

> ♰ \`${px}top\`
*Muestra la lista de los usuarios con más dinero del bot.* (⁠◍⁠•⁠ᴗ⁠•⁠◍⁠)

*꒰⌢◌⃘࣭ٜ࣪࣪࣪۬☪︎︎︎︎̸ ✎ ꒱ 𐔌 Games 𐦯*

> ♰ \`${px}8ball\`
*Hazle una pregunta a la bola mágica de las respuestas.* (⁠◍⁠•⁠ᴗ⁠•⁠◍⁠)

> ♰ \`${px}dado\`
*Lanza un dado de la suerte para ver qué número obtienes.* (⁠◍⁠•⁠ᴗ⁠•⁠◍⁠)

> ♰ \`${px}ruleta\`
*Apuesta tus monedas girando la ruleta de la fortuna.* (⁠◍⁠•⁠ᴗ⁠•⁠◍⁠)

> ♰ \`${px}trivia\`
*Responde preguntas de conocimiento general para ganar premios.* (⁠◍⁠•⁠ᴗ⁠•⁠◍⁠)

> ♰ \`${px}adivinanza\`
*Intenta resolver el acertijo que te proponga el bot.* (⁠◍⁠•⁠ᴗ⁠•⁠◍⁠)

*꒰⌢◌⃘࣭ٜ࣪࣪࣪۬☪︎︎︎︎̸ ✎ ꒱ 𐔌 Reactions 𐦯*

> ♰ \`${px}kiss\`
*Envía un tierno beso virtual al usuario que desees.* (⁠◍⁠•⁠ᴗ⁠•⁠◍⁠)

> ♰ \`${px}hug\`
*Dale un abrazo afectuoso a un miembro del grupo.* (⁠◍⁠•⁠ᴗ⁠•⁠◍⁠)

> ♰ \`${px}pat\`
*Dale una palmadita suave en la cabeza a alguien.* (⁠◍⁠•⁠ᴗ⁠•⁠◍⁠)

> ♰ \`${px}kill\`
*Simula un ataque letal con estilo hacia otro usuario.* (⁠◍⁠•⁠ᴗ⁠•⁠◍⁠)

> ♰ \`${px}bite\`
*Dale una pequeña mordida juguetona a un compañero.* (⁠◍⁠•⁠ᴗ⁠•⁠◍⁠)

> ♰ \`${px}cry\`
*Expresa una profunda tristeza llorando en el chat.* (⁠◍⁠•⁠ᴗ⁠•⁠◍⁠)

> ♰ \`${px}happy\`
*Demuestra tu inmensa felicidad y alegría actual.* (⁠◍⁠•⁠ᴗ⁠•⁠◍⁠)

> ♰ \`${px}angry\`
*Muestra tu descontento o enojo con una reacción.* (⁠◍⁠•⁠ᴗ⁠•⁠◍⁠)

> ♰ \`${px}cuddle\`
*Acurrúcate cariñosamente con tu persona favorita.* (⁠◍⁠•⁠ᴗ⁠•⁠◍⁠)

> ♰ \`${px}neko\`
*Envía una reacción o imagen con temática de gato anime.* (⁠◍⁠•⁠ᴗ⁠•⁠◍⁠)

> ♰ \`${px}cafe\`
*Disfruta de una taza de café virtual de forma relajada.* (⁠◍⁠•⁠ᴗ⁠•⁠◍⁠)

> ♰ \`${px}dormir\`
*Indica que vas a tomar un descanso o irte a dormir.* (⁠◍⁠•⁠ᴗ⁠•⁠◍⁠)

> ♰ \`${px}push\`
*Dale un empujón divertido a un amigo en el grupo.* (⁠◍⁠•⁠ᴗ⁠•⁠◍⁠)
`

    if (isOwner) {
        menu += `
*╭╼𝅄꒰𑁍⃪࣭۪ٜ݊݊݊݊݊໑ٜ࣪ ꒱ 𐔌 OWNER 𐦯*

> ♰ \`${px}addpremium\`
*Añade privilegios premium a un usuario seleccionado.* (⁠◍⁠•⁠ᴗ⁠•⁠◍⁠)

> ♰ \`${px}delpremium\`
*Remueve el estado premium de un usuario de la lista.* (⁠◍⁠•⁠ᴗ⁠•⁠◍⁠)

> ♰ \`${px}listpremium\`
*Muestra la lista de todos los usuarios premium actuales.* (⁠◍⁠•⁠ᴗ⁠•⁠◍⁠)

> ♰ \`${px}addowner\`
*Otorga permisos de administrador supremo del bot a alguien.* (⁠◍⁠•⁠ᴗ⁠•⁠◍⁠)

> ♰ \`${px}delowner\`
*Remueve los permisos de administrador supremo de un usuario.* (⁠◍⁠•⁠ᴗ⁠•⁠◍⁠)

> ♰ \`${px}listowner\`
*Muestra a todos los creadores con acceso total al sistema.* (⁠◍⁠•⁠ᴗ⁠•⁠◍⁠)
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
