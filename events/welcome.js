export const event = 'group-participants.update'

const getThumb = async () => {
    try {
        let iconUrl = ''
        if (Array.isArray(global.icono)) {
            iconUrl = global.icono[Math.floor(Math.random() * global.icono.length)]
        } else {
            iconUrl = global.icono || global.banner || ''
        }
        const res = await fetch(iconUrl)
        if (!res.ok) return null
        return Buffer.from(await res.arrayBuffer())
    } catch { return null }
}

const getProfilePic = async (conn, jid) => {
    try {
        const url = await conn.profilePictureUrl(jid, 'image')
        const res = await fetch(url)
        return Buffer.from(await res.arrayBuffer())
    } catch {
        return await getThumb()
    }
}

export const run = async (conn, update) => {
    try {
        const { id, participants, action } = update
        if (!id?.endsWith('@g.us')) return

        // ── Forzado: Se salta la configuración de la base de datos para que no se pueda desactivar ──
        // const { database } = await import('../lib/database.js')
        // const group = database.data?.groups?.[id]
        // if (action === 'add'    && !group?.welcome) return
        // if (action === 'remove' && !group?.goodbye) return

        let groupName    = id
        let groupDesc    = ''
        let totalMembers = 0
        try {
            const meta   = await conn.groupMetadata(id)
            groupName    = meta.subject || id
            groupDesc    = meta.desc    || ''
            totalMembers = meta.participants?.length || 0
        } catch {}

        const thumb = await getThumb()

        for (const jid of participants) {
            const num   = jid.split('@')[0]
            const ppBuf = await getProfilePic(conn, jid)

            // ── BIENVENIDA (ESTILO TOJI) ──────────────────────────────────────
            if (action === 'add') {
                const txt =
                    `> 🩸 *[ NUEVO INGRESO ]*\n` +
                    `> *Un nuevo rostro aparece por aquí: @${num}*\n` +
                    `> *Lugar:* _${groupName}_\n` +
                    `> *Recuento:* _${totalMembers} personas en total._\n` +
                    (groupDesc ? `> *Nota de la zona:* _${groupDesc.slice(0, 80)}_\n` : '') +
                    `>\n` +
                    `> *“No me importa quién seas ni tus ideales. Mientras no te metas en mi camino ni me hagas perder dinero, sobreviviremos en este sitio.”*`

                await conn.sendMessage(id, {
                    image: ppBuf,
                    caption: txt,
                    mentions: [jid],
                    contextInfo: {
                        isForwarded: true,
                        forwardedNewsletterMessageInfo: {
                            newsletterJid:   global.newsletterJid,
                            serverMessageId: -1,
                            newsletterName:  global.newsletterName
                        },
                        externalAdReply: {
                            title:                 `🩸 NUEVO CONTRATO`,
                            body:                  '𝐇𝐄𝐀𝐕𝐄𝐍𝐋𝐘 𝐑𝐄𝐒𝐓𝐑𝐈𝐂𝐓𝐈𝐎𝐍',
                            mediaType:             1,
                            thumbnail:             thumb,
                            renderLargerThumbnail: false,
                            sourceUrl:             global.rcanal || ''
                        }
                    }
                })

            // ── DESPEDIDA (ESTILO TOJI) ──────────────────────────────────────
            } else if (action === 'remove') {
                const txt =
                    `> 🩸 *[ BAJA CONFIRMADA ]*\n` +
                    `> *@${num} dejó de ser útil y se marchó del lugar.*\n` +
                    `> *Miembros restantes:* _${totalMembers} objetivos en el radar._\n` +
                    `>\n` +
                    `> *“Uno menos del que preocuparse. Al final del día, las bajas no afectan el valor de mi comisión. El dinero sigue valiendo lo mismo.”*`

                await conn.sendMessage(id, {
                    image: ppBuf,
                    caption: txt,
                    mentions: [jid],
                    contextInfo: {
                        isForwarded: true,
                        forwardedNewsletterMessageInfo: {
                            newsletterJid:   global.newsletterJid,
                            serverMessageId: -1,
                            newsletterName:  global.newsletterName
                        },
                        externalAdReply: {
                            title:                 `🩸 BAJA REGISTRADA`,
                            body:                  '𝐇𝐄𝐀𝐕𝐄𝐍𝐋𝐘 𝐑𝐄𝐒𝐓𝐑𝐈𝐂𝐓𝐈𝐎𝐍',
                            mediaType:             1,
                            thumbnail:             thumb,
                            renderLargerThumbnail: false,
                            sourceUrl:             global.rcanal || ''
                        }
                    }
                })
            }
        }
    } catch (e) {
        console.error('[WELCOME EVENT ERROR]', e.message)
    }
}
