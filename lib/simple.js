import { proto } from '@whiskeysockets/baileys'

export function smsg(conn, m) {
    if (!m) return m

    if (m.key) {
        m.id        = m.key.id
        m.isBaileys = m.id?.startsWith('BAE5') && m.id.length === 16
        m.chat      = m.key.remoteJid
        m.fromMe    = m.key.fromMe
        m.isGroup   = m.chat?.endsWith('@g.us')
        m.sender    = m.fromMe
            ? conn.user.id
            : m.isGroup
            ? m.key.participant
            : m.key.remoteJid

        if (m.sender?.includes(':')) {
            m.sender = m.sender.split(':')[0] + '@s.whatsapp.net'
        }
    }

    if (m.message) {

        // ✅ CRÍTICO: Baileys moderno envuelve TODO en messageContextInfo
        // Si el primer key es ese, lo saltamos para llegar al tipo real
        let keys = Object.keys(m.message)
        if (keys[0] === 'messageContextInfo' && keys.length > 1) {
            // reconstruir sin messageContextInfo para que mtype sea el correcto
            const { messageContextInfo, ...rest } = m.message
            m.message = rest
        }

        m.mtype = Object.keys(m.message)[0]

        // Desempaquetar ephemeral
        if (m.mtype === 'ephemeralMessage') {
            m.message = m.message.ephemeralMessage?.message || m.message
            m.mtype   = Object.keys(m.message)[0]
        }

        // Desempaquetar viewOnce v1
        if (m.mtype === 'viewOnceMessage') {
            m.message = m.message.viewOnceMessage?.message || m.message
            m.mtype   = Object.keys(m.message)[0]
        }

        // Desempaquetar viewOnce v2
        if (m.mtype === 'viewOnceMessageV2') {
            m.message = m.message.viewOnceMessageV2?.message || m.message
            m.mtype   = Object.keys(m.message)[0]
        }

        // Desempaquetar documentWithCaption (Baileys 6+)
        if (m.mtype === 'documentWithCaptionMessage') {
            m.message = m.message.documentWithCaptionMessage?.message || m.message
            m.mtype   = Object.keys(m.message)[0]
        }

        // Desempaquetar interactiveResponseMessage
        if (m.mtype === 'interactiveResponseMessage') {
            const body = m.message.interactiveResponseMessage?.nativeFlowResponseMessage?.paramsJson
            if (body) {
                try {
                    m._interactiveParams = JSON.parse(body)
                } catch {}
            }
        }

        m.msg = m.message[m.mtype]

        // ✅ Extraer body/text del mensaje
        m.body = extractBody(m)
        // Asignar m.text = m.body para que el handler lo detecte
        m.text = m.body || ''

        m.pushName = m.pushName || ''

        // ── Quoted message ─────────────────────────────────────────────────
        m.quoted = null
        const contextInfo =
            m.mtype === 'extendedTextMessage'
                ? m.message.extendedTextMessage?.contextInfo
                : m.msg?.contextInfo || null

        if (contextInfo?.quotedMessage) {
            const q = {}

            // Unwrap el mensaje citado también
            let qMsg = contextInfo.quotedMessage
            let qKeys = Object.keys(qMsg)
            if (qKeys[0] === 'messageContextInfo' && qKeys.length > 1) {
                const { messageContextInfo, ...rest } = qMsg
                qMsg = rest
            }

            q.message = qMsg
            q.sender  = contextInfo.participant || contextInfo.remoteJid || ''

            if (q.sender?.includes(':')) {
                q.sender = q.sender.split(':')[0] + '@s.whatsapp.net'
            }

            q.key = {
                remoteJid:   m.chat,
                fromMe:      q.sender === (conn.user.id?.split(':')[0] + '@s.whatsapp.net'),
                id:          contextInfo.stanzaId,
                participant: contextInfo.participant
            }

            q.mtype = Object.keys(q.message)[0]
            q.msg   = q.message[q.mtype]
            q.body  = extractBodyFromRaw(q.message, q.mtype)
            q.text  = q.body || ''

            q.reply    = text => conn.sendMessage(m.chat, { text: String(text) }, { quoted: m })
            q.download = ()   => conn.downloadMediaMessage(q)

            m.quoted = q
        }

        // ── Menciones ──────────────────────────────────────────────────────
        m.mentionedJid =
            contextInfo?.mentionedJid ||
            m.msg?.contextInfo?.mentionedJid ||
            m.message?.extendedTextMessage?.contextInfo?.mentionedJid ||
            []
    }

    // ── Métodos del mensaje ────────────────────────────────────────────────
    m.reply    = text  => conn.sendMessage(m.chat, { text: String(text) }, { quoted: m })
    m.react    = emoji => conn.sendMessage(m.chat, { react: { text: emoji, key: m.key } })
    m.delete   = ()    => conn.sendMessage(m.chat, { delete: m.key })
    m.download = ()    => conn.downloadMediaMessage(m)

    return m
}

// ── Extraer body del objeto m completo ────────────────────────────────────────
function extractBody(m) {
    return extractBodyFromRaw(m.message, m.mtype)
}

// ── Extraer body desde message + mtype crudos ─────────────────────────────────
function extractBodyFromRaw(message, mtype) {
    if (!message || !mtype) return ''

    switch (mtype) {
        case 'conversation':
            return message.conversation || ''

        case 'extendedTextMessage':
            return message.extendedTextMessage?.text || ''

        case 'imageMessage':
            return message.imageMessage?.caption || ''

        case 'videoMessage':
            return message.videoMessage?.caption || ''

        case 'documentMessage':
            return message.documentMessage?.caption || ''

        case 'documentWithCaptionMessage':
            return message.documentWithCaptionMessage?.message?.documentMessage?.caption || ''

        case 'audioMessage':
            return ''

        case 'stickerMessage':
            return ''

        case 'reactionMessage':
            return message.reactionMessage?.text || ''

        case 'buttonsResponseMessage':
            return message.buttonsResponseMessage?.selectedButtonId || ''

        case 'templateButtonReplyMessage':
            return message.templateButtonReplyMessage?.selectedId || ''

        case 'listResponseMessage':
            return message.listResponseMessage?.singleSelectReply?.selectedRowId || ''

        case 'interactiveResponseMessage': {
            try {
                const params = JSON.parse(
                    message.interactiveResponseMessage?.nativeFlowResponseMessage?.paramsJson || '{}'
                )
                return params.id || ''
            } catch { return '' }
        }

        case 'ephemeralMessage': {
            const inner = message.ephemeralMessage?.message
            if (!inner) return ''
            return extractBodyFromRaw(inner, Object.keys(inner)[0])
        }

        case 'viewOnceMessage': {
            const inner = message.viewOnceMessage?.message
            if (!inner) return ''
            return extractBodyFromRaw(inner, Object.keys(inner)[0])
        }

        case 'viewOnceMessageV2': {
            const inner = message.viewOnceMessageV2?.message
            if (!inner) return ''
            return extractBodyFromRaw(inner, Object.keys(inner)[0])
        }

        default:
            return ''
    }
}
