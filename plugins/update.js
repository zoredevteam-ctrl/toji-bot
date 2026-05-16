
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

let handler = async (m, { conn, isOwner }) => {
    if (!isOwner) return m.reply('Solo el Amo del Clan puede actualizar el sistema.')

    await m.reply('⚔️ *Sincronizando con el repositorio...*')

    try {
        const { stdout, stderr } = await execAsync('git pull --ff-only', {
            cwd: process.cwd(),
            maxBuffer: 1024 * 1024 * 10,
        })

        const result = `${stdout || ''}\n${stderr || ''}`.trim()

        if (/Already up to date|Already up-to-date/i.test(result)) {
            return m.reply('🛡️ *El sistema ya está al día.*')
        }

        await m.reply(`✅ *Actualización completada con éxito.*\n\n*Logs:*\n${result || 'Sin salida.'}`)

        setTimeout(() => process.exit(0), 1500)
    } catch (err) {
        const errorMsg = [
            err?.stdout,
            err?.stderr,
            err?.message
        ].filter(Boolean).join('\n')

        return m.reply(`❌ *Error al actualizar:*\n${errorMsg || 'Error desconocido.'}`)
    }
}

handler.command = ['update', 'actualizar']
handler.owner = true

export default handler