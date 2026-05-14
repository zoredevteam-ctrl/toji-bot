import moment from 'moment-timezone';
import fs from 'fs';
import { xpRange } from '../../lib/levelling.js';
import path from 'path';

const cwd = process.cwd();

let handler = async (m, { conn, args }) => {
  let userId = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.sender;
  let name = await conn.getName(userId);
  let user = global.db.data.users[userId];
  let exp = user.exp || 0;
  let level = user.level || 0;
  let role = user.role || 'Sin Rango';
  let coins = user.coin || 0;

  let _uptime = process.uptime() * 1000;
  let uptime = clockString(_uptime);
  let totalreg = Object.keys(global.db.data.users).length;
  let totalCommands = Object.values(global.plugins).filter(v => v.help && v.tags).length;

  // Imágenes de Toji para el menú
  const imagenesToji = [
    'https://i.pinimg.com/736x/3b/4c/5d/3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e.jpg',
    'https://i.pinimg.com/736x/9f/0a/1b/9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c.jpg',
    'https://i.pinimg.com/736x/5e/6f/7a/5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b.jpg',
    'https://i.pinimg.com/736x/1c/2d/3e/1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f.jpg',
  ];
  const randomImg = imagenesToji[Math.floor(Math.random() * imagenesToji.length)];

  let txt = `
⚔️⸻⸻⸻⸻⸻⸻⸻⸻⚔️
𝗧𝗢𝗝𝗜 𝗙𝗨𝗦𝗛𝗜𝗚𝗨𝗥𝗢 𝗕𝗢𝗧
⚔️⸻⸻⸻⸻⸻⸻⸻⸻⚔️

*Hm.* ${name}... no esperaba verte aquí.
Haz lo que viniste a hacer.

╔═══════⩽⚔️⩾═══════╗
   「 𝗜𝗡𝗙𝗢 𝗗𝗘𝗟 𝗕𝗢𝗧 」
╚═══════⩽⚔️⩾═══════╝
║ ⚔️ *MODO*: *PÚBLICO*
║ 🔩 *BAILEYS*: *MULTI DEVICE*
║ 📚 *COMANDOS*: ${totalCommands}
║ ⏱️ *ACTIVO*: ${uptime}
║ 👤 *USUARIOS*: ${totalreg}
║ 👁️ *CREADOR*: wa.me/18294868853
╚════════════════════════

╔═══════⩽⚔️⩾═══════╗
   「 𝗜𝗡𝗙𝗢 𝗗𝗘𝗟 𝗨𝗦𝗨𝗔𝗥𝗜𝗢 」
╚═══════⩽⚔️⩾═══════╝
║ 👤 *USUARIO*: ${name}
║ 💠 *EXP*: ${exp}
║ 💴 *${m.moneda}*: ${coins}
║ 📊 *NIVEL*: ${level}
║ 🏅 *RANGO*: ${role}
╚═══════════════════════╝

> Crea un *sub-bot* con *#qr* o *#code*

╔══⩽⚔️⩾══╗
「 ${conn.user.jid == global.conn.user.jid ? '𝗕𝗼𝘁 𝗢𝗳𝗶𝗰𝗶𝗮𝗹' : '𝗦𝘂𝗯𝗕𝗼𝘁'} 」
╚══⩽⚔️⩾══╝

*L I S T A  D E  C O M A N D O S*

⚔️⸻⸻⸻⸻⸻⸻⸻⸻⚔️
↷ 𝗜𝗡𝗙𝗢
⚔️⸻⸻⸻⸻⸻⸻⸻⸻⚔️
┣ ⚔️ *#help • #menu*
> Ver la lista de comandos.
┣ ⚔️ *#uptime • #runtime*
> Ver tiempo activo del bot.
┣ ⚔️ *#sc • #script*
> Link del repositorio oficial.
┣ ⚔️ *#ping • #p*
> Ver velocidad de respuesta.
┣ ⚔️ *#owner*
> Contacto del creador.
┣ ⚔️ *#qr • #code*
> Crear una sesión de Sub-Bot.
┣ ⚔️ *#bots • #sockets*
> Ver Sub-Bots activos.

⚔️⸻⸻⸻⸻⸻⸻⸻⸻⚔️
↷ 𝗗𝗘𝗦𝗖𝗔𝗥𝗚𝗔𝗦
⚔️⸻⸻⸻⸻⸻⸻⸻⸻⚔️
┣ ⚔️ *#play • #playvid*
> Descargar música/video de YouTube.
┣ ⚔️ *#tiktok • #tt*
> Descargar videos de TikTok.
┣ ⚔️ *#mediafire • #mf*
> Descargar archivos de MediaFire.
┣ ⚔️ *#fb • #facebook*
> Descargar videos de Facebook.
┣ ⚔️ *#ig • #instagram*
> Descargar contenido de Instagram.
┣ ⚔️ *#twitter • #x*
> Descargar videos de Twitter/X.
┣ ⚔️ *#mega • #mg*
> Descargar archivos de MEGA.
┣ ⚔️ *#gdrive • #drive*
> Descargar desde Google Drive.
┣ ⚔️ *#apk • #modapk*
> Descargar APKs (Aptoide).

⚔️⸻⸻⸻⸻⸻⸻⸻⸻⚔️
↷ 𝗕𝗨𝗦𝗤𝗨𝗘𝗗𝗔𝗦
⚔️⸻⸻⸻⸻⸻⸻⸻⸻⚔️
┣ ⚔️ *#google*
> Buscar en Google.
┣ ⚔️ *#ytsearch • #yts*
> Buscar en YouTube.
┣ ⚔️ *#tiktoksearch • #tiktoks*
> Buscar videos de TikTok.
┣ ⚔️ *#animesearch • #animess*
> Buscar animes en TioAnime.
┣ ⚔️ *#animeinfo • #animeinfoo*
> Info de anime/manga.
┣ ⚔️ *#pokedex*
> Info de Pokémon.
┣ ⚔️ *#githubsearch*
> Buscar usuarios de GitHub.

⚔️⸻⸻⸻⸻⸻⸻⸻⸻⚔️
↷ 𝗘𝗖𝗢𝗡𝗢𝗠𝗜𝗔
⚔️⸻⸻⸻⸻⸻⸻⸻⸻⚔️
┣ ⚔️ *#work • #w*
> Trabaja para ganar ${m.moneda}.
┣ ⚔️ *#crime • #crimen*
> Trabaja como ladrón.
┣ ⚔️ *#daily • #diario*
> Reclama tu recompensa diaria.
┣ ⚔️ *#bal • #wallet*
> Ver tus ${m.moneda}.
┣ ⚔️ *#bank • #banco*
> Ver tu banco.
┣ ⚔️ *#deposit • #depositar*
> Depositar al banco.
┣ ⚔️ *#withdraw • #retirar*
> Retirar del banco.
┣ ⚔️ *#transfer • #pay*
> Transferir ${m.moneda} a otros.
┣ ⚔️ *#mining • #minar*
> Trabajar como minero.
┣ ⚔️ *#steal • #rob*
> Intentar robar ${m.moneda}.
┣ ⚔️ *#shop • #tienda*
> Ver la tienda.
┣ ⚔️ *#inv • #inventario*
> Ver tu inventario.
┣ ⚔️ *#eboard • #baltop*
> Ranking de ${m.moneda}.

⚔️⸻⸻⸻⸻⸻⸻⸻⸻⚔️
↷ 𝗦𝗧𝗜𝗖𝗞𝗘𝗥𝗦
⚔️⸻⸻⸻⸻⸻⸻⸻⸻⚔️
┣ ⚔️ *#sticker • #s*
> Crear sticker de imagen/video.
┣ ⚔️ *#setmeta*
> Establecer pack y autor del sticker.
┣ ⚔️ *#delmeta*
> Eliminar metadatos del sticker.

⚔️⸻⸻⸻⸻⸻⸻⸻⸻⚔️
↷ 𝗚𝗥𝗨𝗣𝗢𝗦
⚔️⸻⸻⸻⸻⸻⸻⸻⸻⚔️
┣ ⚔️ *#tag • #everyone*
> Mencionar a todos en el grupo.
┣ ⚔️ *#promote • #admin*
> Promover a admin.
┣ ⚔️ *#demote • #unadmin*
> Quitar admin.
┣ ⚔️ *#ban • #kick*
> Expulsar del grupo.
┣ ⚔️ *#add*
> Agregar al grupo.
┣ ⚔️ *#setprimary • #setbot*
> Establecer bot primario del grupo.

⚔️⸻⸻⸻⸻⸻⸻⸻⸻⚔️
↷ 𝗛𝗘𝗥𝗥𝗔𝗠𝗜𝗘𝗡𝗧𝗔𝗦
⚔️⸻⸻⸻⸻⸻⸻⸻⸻⚔️
┣ ⚔️ *#clima • #weather*
> Ver el clima de una ciudad.
┣ ⚔️ *#traducir • #translate*
> Traducir texto.
┣ ⚔️ *#qr*
> Crear código QR.
┣ ⚔️ *#calc*
> Calculadora.
┣ ⚔️ *#chiste • #joke*
> Chiste aleatorio.
┣ ⚔️ *#frase • #quote*
> Frase aleatoria.

> ⚔️ *Toji Fushiguro Bot* — Sin magia maldita, solo poder bruto.
`.trim();

  // Intentar enviar con video, si no hay video mandar como imagen
  let mediaOpts;
  const menuDir = path.join(cwd, 'src', 'menu');
  const hasMenu = fs.existsSync(menuDir);
  const mp4Files = hasMenu
    ? fs.readdirSync(menuDir).filter(f => f.endsWith('.mp4'))
    : [];

  try {
    if (mp4Files.length > 0) {
      const randomMp4 = mp4Files[Math.floor(Math.random() * mp4Files.length)];
      await conn.sendMessage(m.chat, {
        video: fs.readFileSync(path.join(menuDir, randomMp4)),
        caption: txt,
        gifPlayback: true,
        contextInfo: {
          mentionedJid: [m.sender],
          forwardedNewsletterMessageInfo: {
            newsletterJid: global.newsletterJid,
            newsletterName: global.newsletterName,
            serverMessageId: -1
          },
          isForwarded: true,
          forwardingScore: 999,
          externalAdReply: {
            title: global.botname,
            body: '⚔️ Sin magia maldita, solo poder bruto.',
            mediaType: 1,
            sourceUrl: global.rcanal,
            mediaUrl: global.rcanal,
            renderLargerThumbnail: false
          }
        }
      }, { quoted: m });
    } else {
      // Sin videos: mandar como imagen con URL de Toji
      await conn.sendMessage(m.chat, {
        image: { url: randomImg },
        caption: txt,
        contextInfo: {
          mentionedJid: [m.sender],
          forwardedNewsletterMessageInfo: {
            newsletterJid: global.newsletterJid,
            newsletterName: global.newsletterName,
            serverMessageId: -1
          },
          isForwarded: true,
          forwardingScore: 999,
          externalAdReply: {
            title: global.botname,
            body: '⚔️ Sin magia maldita, solo poder bruto.',
            mediaType: 1,
            sourceUrl: global.rcanal,
            mediaUrl: global.rcanal,
            renderLargerThumbnail: false
          }
        }
      }, { quoted: m });
    }
  } catch (e) {
    // Fallback: solo texto
    await conn.reply(m.chat, txt, m);
  }
};

handler.help = ['menu', 'help'];
handler.tags = ['info'];
handler.command = ['menu', 'help', 'menú', 'start'];

function clockString(ms) {
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000);
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60;
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60;
  return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':');
}

export default handler;
