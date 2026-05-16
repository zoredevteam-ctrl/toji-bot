export const event = 'group-participants.update'

const getProfilePic = async (conn, jid) => {
    try {
        const url = await conn.profilePictureUrl(jid, 'image')
        const res = await fetch(url)
        return Buffer.from(await res.arrayBuffer())
    } catch {
        // Si no tiene foto de perfil, pasamos un buffer vacío o null para que use la del externalAdReply
        return null
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

        for (const jid of participants) {
            const num   = jid.split('@')[0]
            const ppBuf = await getProfilePic(conn, jid)
            
            // Obtenemos un icono aleatorio de tus settings para cada mensaje
            const iconUrl = typeof global.getRandomIconoToji === 'function' 
                ? global.getRandomIconoToji() 
                : (global.icono || global.banner || '')

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

                const msgOptions = {
                    caption: txt,
                    mentions: [jid],
                    contextInfo: {
                        isForwarded: true,
                        forwardedNewsletterMessageInfo: {
                            newsletterJid:   global.newsletterJid || '',
                            serverMessageId: -1,
                            newsletterName:  global.newsletterName || '𝐇𝐄𝐀𝐕𝐄𝐍𝐋𝐘 𝐑𝐄𝐒𝐓𝐑𝐈𝐂𝐓𝐈𝐎𝐍'
                        },
                        externalAdReply: {
                            title:                 `🩸 NUEVO CONTRATO`,
                            body:                  '𝐇𝐄𝐀𝐕𝐄𝐍𝐋𝐘 𝐑𝐄𝐒𝐓𝐑𝐈𝐂𝐓𝐈𝐎𝐍',
                            mediaType:             1,
                            thumbnailUrl:          iconUrl, // Forzamos URL directa para evitar cuadro negro
                            renderLargerThumbnail: false,
                            sourceUrl:             global.rcanal || ''
                        }
                    }
                }

                // Si se obtuvo la foto de perfil del usuario se manda, si no, se envía solo texto con el adReply
                if (ppBuf) {
                    msgOptions.image = ppBuf
                } else {
                    msgOptions.text = txt
                }

                await conn.sendMessage(id, msgOptions)

            // ── DESPEDIDA (ESTILO TOJI) ──────────────────────────────────────
            } else if (action === 'remove') {
                const txt =
                    `> 🩸 *[ BAJA CONFIRMADA ]*\n` +
                    `> *@${num} dejó de ser útil y se marchó del lugar.*\n` +
                    `> *Miembros restantes:* _${totalMembers - 1} objetivos en el radar._\n` +
                    `>\n` +
                    `> *“Uno menos del que preocuparse. Al final del día, las bajas no afectan el valor de mi comisión. El dinero sigue valiendo lo mismo.”*`

                const msgOptions = {
                    caption: txt,
                    mentions: [jid],
                    contextInfo: {
                        isForwarded: true,
                        forwardedNewsletterMessageInfo: {
                            newsletterJid:   global.newsletterJid || '',
                            serverMessageId: -1,
                            newsletterName:  global.newsletterName || '𝐇𝐄𝐀𝐕𝐄𝐍𝐋𝐘 𝐑𝐄𝐒𝐓𝐑𝐈𝐂𝐓𝐈𝐎𝐍'
                        },
                        externalAdReply: {
                            title:                 `🩸 BAJA REGISTRADA`,
                            body:                  '𝐇𝐄𝐀𝐕𝐄𝐍𝐋𝐘 𝐑𝐄𝐒𝐓𝐑𝐈𝐂𝐓𝐈𝐎停',
                            mediaType:             1,
                            thumbnailUrl:          iconUrl, // Forzamos URL directa para evitar cuadro negro
                            renderLargerThumbnail: false,
                            sourceUrl:             global.rcanal || ''
                        }
                    }
                }

                if (ppBuf) {
                    msgOptions.image = ppBuf
                } else {
                    msgOptions.text = txt
                }

                await conn.sendMessage(id, msgOptions)
            }
        }
    } catch (e) {
        console.error('[WELCOME EVENT ERROR]', e.message)
    }
}
