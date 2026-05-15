// ╔══════════════════════════════════════════════════════════╗
// ║        TOJI FUSHIGURO BOT — LIB/PRINT.JS                 ║
// ╚══════════════════════════════════════════════════════════╝

const chalk = require('chalk')

function getTimestamp() {
  return new Date().toLocaleTimeString('es-MX', { hour12: false })
}

const print = {
  cmd: (user, command, chat) => {
    console.log(
      chalk.gray(`[${getTimestamp()}]`) + ' ' +
      chalk.red('⚔️  CMD') + ' ' +
      chalk.white(`${user}`) + chalk.gray(' → ') +
      chalk.yellow(`#${command}`) +
      chalk.gray(` en ${chat}`)
    )
  },

  info: (msg) => {
    console.log(
      chalk.gray(`[${getTimestamp()}]`) + ' ' +
      chalk.cyan('ℹ  INFO') + ' ' +
      chalk.white(msg)
    )
  },

  error: (msg) => {
    console.log(
      chalk.gray(`[${getTimestamp()}]`) + ' ' +
      chalk.red('✖  ERROR') + ' ' +
      chalk.white(msg)
    )
  },

  warn: (msg) => {
    console.log(
      chalk.gray(`[${getTimestamp()}]`) + ' ' +
      chalk.yellow('⚠  WARN') + ' ' +
      chalk.white(msg)
    )
  },

  connect: (msg) => {
    console.log(
      chalk.gray(`[${getTimestamp()}]`) + ' ' +
      chalk.green('✔  CONN') + ' ' +
      chalk.white(msg)
    )
  },

  db: (msg) => {
    console.log(
      chalk.gray(`[${getTimestamp()}]`) + ' ' +
      chalk.blue('🗄  DB') + ' ' +
      chalk.white(msg)
    )
  },
}

module.exports = { print }
