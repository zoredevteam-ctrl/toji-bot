# ⚔️ Toji Fushiguro Bot

> *"No necesito el Ojo de los Seis Ojos para ser el más fuerte."*
> — Toji Fushiguro

Bot de WhatsApp basado en **Toji Fushiguro** de Jujutsu Kaisen.
Construido con **Baileys** + **Node.js** con arquitectura de plugins modular.

---

## 🗡️ Características

- ⚔️ Sistema de economía completo (`#daily`, `#work`, `#crime`, `#rob`)
- 🎮 Sistema RPG con clases y aventuras
- 🎵 Reproductor de música (`#play`, `#playvid`)
- 🤖 Sistema de Sub-Bots (hasta 30 sesiones simultáneas)
- 👥 Gestión de grupos (`#tag`, `#promote`, `#demote`, `#ban`)
- 🛠️ Herramientas (`#clima`, `#traducir`, `#qr`, `#calc`, `#pokedex`)
- 🔥 Plugin hot-reload sin reiniciar

---

## 🚀 Instalación

```bash
git clone https://github.com/tuusuario/toji-fushiguro-bot
cd toji-fushiguro-bot
npm install
```

### Iniciar con QR
```bash
npm run qr
```

### Iniciar con código de vinculación
```bash
npm run code
```

---

## ⚙️ Configuración

Edita `settings.js` y configura:

```js
global.botNumber = 'TU_NUMERO'
global.owner = [['TU_NUMERO', 'Tu Nombre', true]]
global.newsletterJid = 'TU_NEWSLETTER_JID@newsletter'
global.rcanal = 'https://whatsapp.com/channel/TU_CANAL'
```

---

## 📁 Estructura

```
toji-fushiguro-bot/
├── index.js
├── handler.js
├── settings.js
├── package.json
├── lib/
│   ├── simple.js
│   ├── respuesta.js
│   ├── print.js
│   ├── database.js
│   ├── levelling.js
│   ├── jobs.js
│   └── ...
├── plugins/
│   └── index/
│       ├── economy.js
│       ├── rpg.js
│       ├── tools1.js
│       ├── tools2.js
│       ├── grupos.js
│       └── ...
└── src/
    ├── catalogo.jpg
    └── database/
        └── database.json
```

---

## 📜 Licencia

MIT — Hecho por **Aarom**
```

---

**.gitignore:**
```
# Node
node_modules/
.npm/
npm-debug.log*
yarn-error.log*

# Sesiones del bot
Toji-Sessions/
TojiJadiBots/
src/database/backups/
tmp/
*.tmp

# Archivos de entorno
.env

# Instaladores
*.exe
*.msi

# Sistemas
.DS_Store
Thumbs.db
```

