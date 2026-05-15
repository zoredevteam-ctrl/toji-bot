// ╔══════════════════════════════════════════════════════════╗
// ║        TOJI FUSHIGURO BOT — LIB/JOBS.JS                  ║
// ╚══════════════════════════════════════════════════════════╝

const jobs = {
  mercenario: {
    name:    '⚔️ Mercenario',
    salario: [200, 500],
    cooldown: 3600000, // 1h
    desc:    'Cumples contratos sin hacer preguntas.',
    frases:  [
      'Eliminaste el objetivo. El cliente está satisfecho.',
      'Misión completada. Sin testigos.',
      'Trabajo sucio, pago limpio.',
    ],
  },
  cazador: {
    name:    '🌀 Cazador de Maldiciones',
    salario: [150, 400],
    cooldown: 3600000,
    desc:    'Exterminas maldiciones por encargo.',
    frases:  [
      'Exorcizaste tres maldiciones de Grado 2.',
      'La maldición fue eliminada antes del amanecer.',
      'Otro trabajo rutinario para alguien de tu nivel.',
    ],
  },
  comerciante: {
    name:    '💰 Comerciante del Submundo',
    salario: [100, 350],
    cooldown: 3600000,
    desc:    'Vendes artefactos y herramientas malditas.',
    frases:  [
      'Vendiste un artefacto maldito a buen precio.',
      'El cliente pagó sin regatear. Raro.',
      'Buen margen en esta transacción.',
    ],
  },
  entrenador: {
    name:    '🥋 Entrenador de Élite',
    salario: [120, 300],
    cooldown: 3600000,
    desc:    'Entrenas reclutas para combate.',
    frases:  [
      'Los reclutas aprendieron más de lo esperado.',
      'Dos horas de entrenamiento brutal. Se lo merecen.',
      'Nadie murió hoy. Consideralo un éxito.',
    ],
  },
  espía: {
    name:    '🕵️ Espía',
    salario: [250, 600],
    cooldown: 7200000, // 2h - riesgo mayor
    desc:    'Obtienes información de alto valor.',
    frases:  [
      'Infiltraste la organización sin ser detectado.',
      'Los documentos están en tu poder.',
      'Informacion valiosa. El cliente pagará bien.',
    ],
  },
}

function getJob(key) {
  return jobs[key] || null
}

function getAllJobs() {
  return jobs
}

function getJobSalary(key) {
  const job = getJob(key)
  if (!job) return 0
  const [min, max] = job.salario
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function getJobFrase(key) {
  const job = getJob(key)
  if (!job) return '...'
  return job.frases[Math.floor(Math.random() * job.frases.length)]
}

module.exports = { getJob, getAllJobs, getJobSalary, getJobFrase }
