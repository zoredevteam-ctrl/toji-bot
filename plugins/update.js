import { exec } from 'child_process';

let handler = async (m, { conn, isOwner }) => {
    if (!isOwner) return m.reply('Solo el Amo del Clan puede actualizar el sistema.');
    
    m.reply('⚔️ *Sincronizando con el repositorio...*');

    exec('git pull', (err, stdout, stderr) => {
        if (err) {
            return m.reply(`❌ *Error al actualizar:* \n${stderr}`);
        }
        
        if (stdout.includes('Already up to date.')) {
            m.reply('🛡️ *El sistema ya está al día.*');
        } else {
            m.reply('✅ *Actualización completada con éxito.*\n\n*Logs:*\n' + stdout);
            // Al hacer git pull, el handler.js volverá a importar los archivos
            // usando la fecha actual, recargándolos en memoria automáticamente.
        }
    });
};

handler.command = ['update', 'actualizar'];
handler.owner = true;
export default handler;
