import { watchFile, unwatchFile } from 'fs' 
import chalk from 'chalk'
import { fileURLToPath } from 'url'

//*⋯⭒⋯⭒⋯⭒⋯⭒⋯⭒⋯⭒⋯⭒⋯⭒⋯⭒⋯⭒⋯⭒⋯⭒⋯⭒⋯⭒⋯⭒⋯⭒⋯⭒⋯⭒⋯⭒⋯*

global.mods = []
global.prems = []
global.owner = [
  ['51939658716', 'Samsito', true],
]

//*⋯⭒⋯⭒⋯⭒⋯⭒⋯⭒⋯⭒⋯⭒⋯⭒⋯⭒⋯⭒⋯⭒⋯⭒⋯⭒⋯⭒⋯⭒⋯⭒⋯⭒⋯⭒⋯⭒⋯*

global.libreria = 'Baileys'
global.baileys = 'V 6.7.8'
global.vs = '1.0.0'
global.languaje = 'Español'
global.nameqr = 'Anya Forger'
global.sessions = 'AnyaSession'
global.jadi = 'AnyaJadiBot'
global.AnyaJadibts = true

//*⋯⭒⋯⭒⋯⭒⋯⭒⋯⭒⋯⭒⋯⭒⋯⭒⋯⭒⋯⭒⋯⭒⋯⭒⋯⭒⋯⭒⋯⭒⋯⭒⋯⭒⋯⭒⋯⭒⋯*

global.packname = ``
global.author = 'Samsito'
global.botname = 'Anya Forger'

//*⋯⭒⋯⭒⋯⭒⋯⭒⋯⭒⋯⭒⋯⭒⋯⭒⋯⭒⋯⭒⋯⭒⋯⭒⋯⭒⋯⭒⋯⭒⋯⭒⋯⭒⋯⭒⋯⭒⋯*

global.namecanal = 'Team | Starslloud'
global.idcanal = '120363274577422945@newsletter'
global.canal = 'https://whatsapp.com/channel/0029VaeQcFXEFeXtNMHk0D0n'

//*⋯⭒⋯⭒⋯⭒⋯⭒⋯⭒⋯⭒⋯⭒⋯⭒⋯⭒⋯⭒⋯⭒⋯⭒⋯⭒⋯⭒⋯⭒⋯⭒⋯⭒⋯⭒⋯⭒⋯*

global.multiplier = 69 
global.maxwarn = '2'

//*⋯⭒⋯⭒⋯⭒⋯⭒⋯⭒⋯⭒⋯⭒⋯⭒⋯⭒⋯⭒⋯⭒⋯⭒⋯⭒⋯⭒⋯⭒⋯⭒⋯⭒⋯⭒⋯⭒⋯*

let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
  unwatchFile(file)
  console.log(chalk.redBright("Update 'config.js'"))
  import(`${file}?update=${Date.now()}`)
})
