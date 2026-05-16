import './settings.js';
import chalk from 'chalk';
import printLog from './lib/print.js';
import { smsg } from './lib/simple.js';
import { database } from './lib/database.js';
import { readdirSync } from 'fs';
import { join, resolve } from 'path';
import { pathToFileURL } from 'url';

// ... [Mantén tus funciones de normalización intactas] ...
const toNum         = v => (v + '').replace(/[^0-9]/g, '');
const localPart     = v => (v + '').split('@')[0].split(':')[0].split('/')[0].split(',')[0];
const normalizeCore = v => toNum(localPart(v));
const normalizeJid = v => {
    if (!v) return '';
    if (typeof v === 'number') v = String(v);
    v = (v + '').trim();
    if (v.startsWith('@')) v = v.slice(1);
    if (v.endsWith('@g.us')) return v;
    if (v.includes('@s.whatsapp.net')) {
        const n = toNum(v.split('@')[0]);
        return n ? n + '@s.whatsapp.net' : v;
    }
    const n = toNum(v);
    return n ? n + '@s.whatsapp.net' : v;
};

// ── Reply estilo TOJI FUSHIGURO ────────────────────────────────
const tojiReply = async (conn, m, txt) => {
    try {
        const thumb = await global.getIconThumb?.() || null;
        const ctx   = global.getNewsletterCtx?.(thumb, '⚔️ TOJI FUSHIGURO', 'El asesino de hechiceros') || {};
        await conn.sendMessage(m.chat, { text: txt, contextInfo: ctx }, { quoted: m });
    } catch {
        try { await m.reply(txt); } catch {}
    }
};

// ── Plantilla de Toji ──────────────────────────────────────────
const box = (title, lines) =>
    `⚔️  ──  T O J I  F U S H I G U R O  ──  ⚔️\n\n` +
    `✦ [ ${title} ]\n` +
    lines.map(l => `  ➢ ${l}`).join('\n');

// ... [loadEvents se mantiene igual] ...
const eventsLoadedFor = new WeakSet();
export const loadEvents = async (conn) => {
    if (!conn?.ev?.on) return;
    if (eventsLoadedFor.has(conn)) return;
    eventsLoadedFor.add(conn);
    const eventsPath = resolve('./events');
    let files = [];
    try { files = readdirSync(eventsPath).filter(f => f.endsWith('.js')); } catch { return; }
    for (const file of files) {
        try {
            const url = pathToFileURL(join(eventsPath, file)).href;
            const mod = await import(url);
            if (!mod.event || !mod.run) continue;
            conn.ev.on(mod.event, (data) => {
                const id = data?.id || data?.key?.remoteJid || null;
                if (mod.enabled && id && !mod.enabled(id)) return;
                mod.run(conn, data);
            });
        } catch (e) {}
    }
};

export const handler = async (m, conn, plugins) => {
    try {
        if (!m) return;
        await loadEvents(conn);
        m = await smsg(conn, m);

        // [Lógica existente, solo cambiamos los mensajes]
        
        if (!m.body) return;
        const prefix = getPrefix(m.body);
        if (m.body && !m.fromMe) printLog(!!prefix, m.sender, m.isGroup ? m.chat : null, m.body, m.pushName);

        // ... [Lógica de plugins.before igual] ...

        if (!prefix) return;
        const body        = m.body.slice(prefix.length).trim();
        const args        = body.split(/ +/).filter(Boolean);
        const commandName = args.shift()?.toLowerCase();
        if (!commandName) return;

        // ... [Lógica de sender y comandos igual] ...

        if (!cmd) {
            const allCommands = []; // ... (Igual)
            // ... [Lógica de sugerencias] ...
            let txt = `⚔️  ──  T O J I  F U S H I G U R O  ──  ⚔️\n\n✦ [ TRABAJO NO ENCONTRADO ]\n  ➢ El comando *${prefix + commandName}* no existe.\n  ➢ No me hagas perder el tiempo con cosas que no sé hacer.`;
            
            if (similares.length) {
                txt += `\n\n✦ [ ¿INTENTABAS BUSCAR ESTO? ]\n` + similares.map(s => `  ➢ ${prefix + s.cmd}`).join('\n');
            }
            return tojiReply(conn, m, txt);
        }

        // ── Validaciones de Sistema estilo TOJI ───────────────────────────

        if (isGroup && database.data.groups[m.chat]?.modoadmin && !isAdmin && !isOwner) {
            return tojiReply(conn, m, box('RESTRICCIÓN', ['Solo gente con autoridad aquí. Vuelve cuando seas admin.']));
        }

        if (database.data.settings?.modoowner && !isOwner) {
            return tojiReply(conn, m, box('SISTEMA BLOQUEADO', ['Estoy ocupado. Solo acepto órdenes de mi jefe.']));
        }

        if (database.data.users[senderJid]?.banned && !isOwner) {
            return tojiReply(conn, m, box('VETADO', ['Estás en mi lista negra. No me busques.']));
        }

        if (cmd.rowner && !isROwner) {
            return tojiReply(conn, m, box('ACCESO DENEGADO', ['Ese nivel de autoridad no está a tu alcance.']));
        }

        if (cmd.owner && !isOwner) {
            return tojiReply(conn, m, box('ACCESO DENEGADO', ['No eres mi jefe. No pierdas mi tiempo.']));
        }

        if (cmd.premium && !isPremium) {
            return tojiReply(conn, m, box('PAGO REQUERIDO', ['Este servicio no es gratis. Paga la suscripción.']));
        }

        if (cmd.register && !isRegistered) {
            return tojiReply(conn, m, box('IDENTIDAD DESCONOCIDA', ['¿Quién eres? Regístrate antes de pedir favores.']));
        }

        if (cmd.group && !isGroup) {
            return tojiReply(conn, m, box('ENTORNO', ['Esto no es un grupo. Hazlo en un chat grupal.']));
        }

        if (cmd.admin && !isAdmin) {
            return tojiReply(conn, m, box('PERMISOS INSUFICIENTES', ['Necesitas ser administrador. Deja de jugar a ser el jefe.']));
        }

        if (cmd.botAdmin && !isBotAdmin) {
            return tojiReply(conn, m, box('FALLO DE LOGÍSTICA', ['No soy admin aquí. No puedo hacer mi trabajo así.']));
        }

        if (cmd.limit && !isPremium && !isOwner) {
            if ((database.data.users[senderJid].limit ?? 0) < 1) {
                return tojiReply(conn, m, box('LÍMITE ALCANZADO', ['Te quedaste sin Zenis. Inténtalo después.']));
            }
            database.data.users[senderJid].limit -= 1;
        }

        // ── Ejecución del plugin ──────────────────────────────────────────────
        try {
            const fn = typeof cmd.run === 'function' ? cmd.run.bind(cmd) : cmd;
            await fn(m, { conn, args, text: args.join(' '), command: commandName, usedPrefix: prefix, isOwner, isROwner, isPremium, isRegistered, isAdmin, isBotAdmin, isGroup, who, db: database.data, prefix, plugins });
        } catch (e) {
            console.log(chalk.red('\n[!] ERROR EN PLUGIN:'), e);
            if (isOwner) await tojiReply(conn, m, box('ERROR EN EL CONTRATO', [String(e).slice(0, 200)]));
        }

    } catch (err) {
        console.log(chalk.red('[HANDLER ERROR]'), err);
    }
};

// ... [Tus funciones helper de prefix y similarity se quedan igual] ...
function getPrefix(body) { return ['#', '.', '/', '$'].find(p => body.startsWith(p)) || null; }
const similarity = (a, b) => { /* ... */ };
