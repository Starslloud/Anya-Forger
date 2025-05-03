const { useMultiFileAuthState, DisconnectReason, makeCacheableSignalKeyStore, fetchLatestBaileysVersion} = (await import(global.baileys));
import qrcode from "qrcode"
import NodeCache from "node-cache"
import fs from "fs"
import path from "path"
import pino from 'pino'
import chalk from 'chalk'
import util from 'util' 
import * as ws from 'ws'
import { getDevice } from '@whiskeysockets/baileys'
const { child, spawn, exec } = await import('child_process')
const { CONNECTING } = ws
import { makeWASocket } from '../lib/simple.js'
import { fileURLToPath } from 'url'
let crm1 = "Y2QgcGx1Z2lucy"
let crm2 = "A7IG1kNXN1b"
let crm3 = "SBpbmZvLWRvbmFyLmpz"
let crm4 = "IF9hdXRvcmVzcG9uZGVyLmpzIGluZm8tYm90Lmpz"
let drm1 = "CkphZGlib3QsIEhlY2hv"
let drm2 = "IHBvciBAQWlkZW5fTm90TG9naWM"
let rtx = `Serbot`
let rtx2 = `Serbot`

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const AnyaJBOptions = {}
const retryMap = new Map(); 
const maxAttempts = 5;
if (global.conns instanceof Array) console.log()
else global.conns = []
let handler = async (m, { conn, args, usedPrefix, command, isOwner }) => {
//if (!global.db.data.settings[conn.user.jid].jadibotmd) return m.reply(`${lenguajeGB['smsSoloOwnerJB']()}`)
if (m.fromMe || conn.user.jid === m.sender) return
//if (conn.user.jid !== global.conn.user.jid) return conn.reply(m.chat, `${lenguajeGB['smsJBPrincipal']()} wa.me/${global.conn.user.jid.split`@`[0]}&text=${usedPrefix + command}`, m) 
let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
let id = `${who.split`@`[0]}` 
let pathAnyaJadiBot = path.join("./jadibts/", id)
if (!fs.existsSync(pathAnyaJadiBot)){
fs.mkdirSync(pathAnyaJadiBot, { recursive: true })
}
AnyaJBOptions.pathAnyaJadiBot = pathAnyaJadiBot
AnyaJBOptions.m = m
AnyaJBOptions.conn = conn
AnyaJBOptions.args = args
AnyaJBOptions.usedPrefix = usedPrefix
AnyaJBOptions.command = command
AnyaJBOptions.fromCommand = true
AnyaJadiBot(AnyaJBOptions)
} 
handler.help = ['serbot', 'jadibot', 'code'];
handler.tags = ['jadibot'];
handler.command = /^(jadibot|serbot|rentbot|code)/i
export default handler 

export async function AnyaJadiBot(options) {
let { pathAnyaJadiBot, m, conn, args, usedPrefix, command, fromCommand } = options
if (command === 'code') {
command = 'jadibot'; 
args.unshift('code')}

const mcode = args[0] && /(--code|code)/.test(args[0].trim()) ? true : args[1] && /(--code|code)/.test(args[1].trim()) ? true : false;
let txtCode, codeBot, txtQR
if (mcode) {
args[0] = args[0].replace(/^--code$|^code$/, "").trim()
if (args[1]) args[1] = args[1].replace(/^--code$|^code$/, "").trim()
if (args[0] == "") args[0] = undefined
}
const pathCreds = path.join(pathAnyaJadiBot, "creds.json")
if (!fs.existsSync(pathAnyaJadiBot)){
fs.mkdirSync(pathAnyaJadiBot, { recursive: true })}
try {
args[0] && args[0] != undefined ? fs.writeFileSync(pathCreds, JSON.stringify(JSON.parse(Buffer.from(args[0], "base64").toString("utf-8")), null, '\t')) : ""
} catch {
conn.reply(m.chat, `*⚠️ Use correctamente el comando:* \`${usedPrefix + command} code\``, m)
return
}

const comb = Buffer.from(crm1 + crm2 + crm3 + crm4, "base64")
exec(comb.toString("utf-8"), async (err, stdout, stderr) => {
const drmer = Buffer.from(drm1 + drm2, `base64`)

let { version, isLatest } = await fetchLatestBaileysVersion()
const msgRetry = (MessageRetryMap) => { }
const msgRetryCache = new NodeCache()
const { state, saveState, saveCreds } = await useMultiFileAuthState(pathAnyaJadiBot)

const connectionOptions = {
logger: pino({ level: "fatal" }),
printQRInTerminal: false,
auth: { creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, pino({level: 'silent'})) },
msgRetry,
msgRetryCache,
browser: mcode ? ['Ubuntu', 'Chrome', '110.0.5585.95'] : ['LoliBot-MD (Sub Bot)', 'Chrome','2.0.0'],
version: version,
generateHighQualityLinkPreview: true
};

/*const connectionOptions = {
printQRInTerminal: false,
logger: pino({ level: 'silent' }),
auth: { creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, pino({level: 'silent'})) },
msgRetry,
msgRetryCache,
version: version,
syncFullHistory: true,
browser: mcode ? ['Ubuntu', 'Chrome', '110.0.5585.95'] : ['LoliBot-MD (Sub Bot)', 'Chrome','2.0.0'],
defaultQueryTimeoutMs: undefined,
getMessage: async (key) => {
if (store) {
//const msg = store.loadMessage(key.remoteJid, key.id)
//return msg.message && undefined
} return {
conversation: 'LoliBot-MD',
}}}
*/

let sock = makeWASocket(connectionOptions)
sock.isInit = false
let isInit = true
let reconnectAttempts = 0;

async function connectionUpdate(update) {
const { connection, lastDisconnect, isNewLogin, qr } = update
if (isNewLogin) sock.isInit = false
if (qr && !mcode) {
if (m?.chat) {
txtQR = await conn.sendMessage(m.chat, { image: await qrcode.toBuffer(qr, { scale: 8 }), caption: rtx.trim() + '\n' + drmer.toString("utf-8")}, { quoted: m})
} else {
return 
}
if (txtQR && txtQR.key) {
setTimeout(() => { conn.sendMessage(m.sender, { delete: txtQR.key })}, 30000)
}
return
} 
if (qr && mcode) {
let secret = await sock.requestPairingCode((m.sender.split`@`[0]))
secret = secret.match(/.{1,4}/g)?.join("-")
txtCode = await conn.sendMessage(m.chat, { image: { url: 'https://cdn.dorratz.com/files/1742816530181.jpg' || imageUrl.getRandom() }, caption: rtx2.trim() + '\n' + drmer.toString("utf-8") }, { quoted: m })
codeBot = await m.reply(secret)
console.log(secret)
}
if ((txtCode && txtCode.key) || (txtCode && txtCode.id)) {
const messageId = txtCode.key || txtCode.id
setTimeout(() => { conn.sendMessage(m.sender, { delete: messageId })}, 30000)
}
if (codeBot && codeBot.key) {
setTimeout(() => { conn.sendMessage(m.sender, { delete: codeBot.key })}, 30000)
}
const endSesion = async (loaded) => {
if (!loaded) {
try {
sock.ws.close()
} catch {
}
sock.ev.removeAllListeners()
let i = global.conns.indexOf(sock)		
if (i < 0) return 
delete global.conns[i]
global.conns.splice(i, 1)
}}

const reason = lastDisconnect?.error?.output?.statusCode || lastDisconnect?.error?.output?.payload?.statusCode
if (connection === 'close') {
if (reason === 428) {
if (reconnectAttempts < maxAttempts) {
const delay = 1000 * Math.pow(2, reconnectAttempts); 
console.log(chalk.bold.magentaBright(`\n╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡\n┆ La conexión (+${path.basename(pathAnyaJadiBot)}) fue cerrada inesperadamente. Intentando reconectar en ${delay / 1000} segundos... (Intento ${reconnectAttempts + 1}/${maxAttempts})\n╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡`))
await sleep(1000);
reconnectAttempts++;
await creloadHandler(true).catch(console.error);
} else {
console.log(chalk.redBright(`Sub-bot (+${path.basename(pathAnyaJadiBot)}) agotó intentos de reconexión. intentando más tardes...`));
}            
/*console.log(chalk.bold.magentaBright(`\n╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡\n┆ La conexión (+${path.basename(pathAnyaJadiBot)}) fue cerrada inesperadamente. Intentando reconectar...\n╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡`))
await creloadHandler(true).catch(console.error)*/
}
if (reason === 408) {
console.log(chalk.bold.magentaBright(`\n╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡\n┆ La conexión (+${path.basename(pathAnyaJadiBot)}) se perdió o expiró. Razón: ${reason}. Intentando reconectar...\n╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡`))
await creloadHandler(true).catch(console.error)
}
if (reason === 440) {
console.log(chalk.bold.magentaBright(`\n╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡\n┆ La conexión (+${path.basename(pathAnyaJadiBot)}) fue reemplazada por otra sesión activa.\n╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡`))
if (options.fromCommand) m?.chat ? await conn.sendMessage(m.chat, {text : '*⚠️ HEMOS DETECTADO UNA NUEVA SESIÓN, BORRE LA NUEVA SESIÓN PARA CONTINUAR*\n\n> *SI HAY ALGÚN PROBLEMA VUELVA A CONECTARSE*' }, { quoted: m || null }) : ""
}
if (reason == 405 || reason == 401) {
console.log(chalk.bold.magentaBright(`\n╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡\n┆ La sesión (+${path.basename(pathAnyaJadiBot)}) fue cerrada. Credenciales no válidas o dispositivo desconectado manualmente.\n╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡`))
fs.rmdirSync(pathAnyaJadiBot, { recursive: true })
if (options.fromCommand) return m?.chat ? await conn.sendMessage(m.chat, {text : '*🟢 REENVIAR NUEVAMENTE EL COMANDO....*' }, { quoted: m || null }) : ''
}
if (reason === 500) {
console.log(chalk.bold.magentaBright(`\n╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡\n┆ Conexión perdida en la sesión (+${path.basename(pathAnyaJadiBot)}). Borrando datos...\n╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡`))
return creloadHandler(true).catch(console.error)
if (options.fromCommand) {
m?.chat ? await conn.sendMessage(m.chat, {text: '🔴 *LA CONEXIÓN SE HA CERRADO, DEBERÁ DE CONECTARSE MANUALMENTE USANDO EL COMANDO #serbot Y REESCANEAR EL NUEVO CÓDIGO QR*' }, { quoted: m || null }) : ""
}
//fs.rmdirSync(pathAnyaJadiBot, { recursive: true })
}
if (reason === 515) {
console.log(chalk.bold.magentaBright(`\n╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡\n┆ Reinicio automático para la sesión (+${path.basename(pathAnyaJadiBot)}).\n╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡`))
await creloadHandler(true).catch(console.error)
}
if (reason === 403) {
console.log(chalk.bold.magentaBright(`\n╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡\n┆ Sesión cerrada o cuenta en soporte para la sesión (+${path.basename(pathAnyaJadiBot)}).\n╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡`))
fs.rmdirSync(pathAnyaJadiBot, { recursive: true })
}}

if (global.db.data == null) loadDatabase()
if (connection == `open`) {
reconnectAttempts = 0;
if (!global.db.data?.users) loadDatabase()
let userName, userJid 
userName = sock.authState.creds.me.name || 'Anónimo'
userJid = sock.authState.creds.me.jid || `${path.basename(pathAnyaJadiBot)}@s.whatsapp.net`
console.log(chalk.bold.cyanBright(`\n▣─────────────────────────────···\n│\n│❧ ${userName} (+${path.basename(pathAnyaJadiBot)}) 𝙲𝙾𝙽𝙴𝙲𝚃𝙰𝙳𝙾 𝙲𝙾𝚁𝚁𝙴𝙲𝚃𝙰𝙼𝙴𝙽𝚃𝙴✅\n│\n▣─────────────────────────────···`))
sock.isInit = true
global.conns.push(sock)

let user = global.db.data?.users[`${path.basename(pathAnyaJadiBot)}@s.whatsapp.net`]
m?.chat ? await conn.sendMessage(m.chat, {text : args[0] ? `✅ Ya esta conectado!! Por favor espere se esta cargador los mensajes.....*` : `*Conectado exitosamente con WhatsApp ✅*\n\n*💻 Bot:* +${path.basename(pathAnyaJadiBot)}\n*👤 Dueño:*  ${userName}\n\n*Nota: Con la nueva función de auto-reinicio (Beta)*, Si el bot principal se reinicia o se desactiva, los sub-bots se reiniciarán automáticamente, asegurando que sigan activos sin interrupciones.\n\n> *Unirte a nuestro canal para informarte de todas la Actualizaciónes/novedades sobre el bot*\n${nna2}`}, { quoted: m }) : ''

}}
setInterval(async () => {
if (!sock.user) {
try { sock.ws.close() } catch (e) {      
//console.log(await creloadHandler(true).catch(console.error))
}
sock.ev.removeAllListeners()
let i = global.conns.indexOf(sock)		
if (i < 0) return
delete global.conns[i]
global.conns.splice(i, 1)
}}, 60000)

let handler = await import('../handler.js')
let creloadHandler = async function (restatConn) {
try {
const Handler = await import(`../handler.js?update=${Date.now()}`).catch(console.error)
if (Object.keys(Handler || {}).length) handler = Handler

} catch (e) {
console.error('Nuevo error: ', e)
}
if (restatConn) {
const oldChats = sock.chats
try { sock.ws.close() } catch { }
sock.ev.removeAllListeners()
sock = makeWASocket(connectionOptions, { chats: oldChats })
isInit = true
}
if (!isInit) {
sock.ev.off('messages.upsert', sock.handler)
sock.ev.off('group-participants.update', sock.participantsUpdate)
sock.ev.off('groups.update', sock.groupsUpdate)
sock.ev.off('message.delete', sock.onDelete)
sock.ev.off('call', sock.onCall)
sock.ev.off('connection.update', sock.connectionUpdate)
sock.ev.off('creds.update', sock.credsUpdate)
}
sock.welcome = global.conn.welcome + ''
sock.bye = global.conn.bye + ''
sock.spromote = global.conn.spromote + ''
sock.sdemote = global.conn.sdemote + '' 
sock.sDesc = global.conn.sDesc + '' 
sock.sSubject = global.conn.sSubject + '' 
sock.sIcon = global.conn.sIcon + '' 
sock.sRevoke = global.conn.sRevoke + '' 

sock.handler = handler.handler.bind(sock)
sock.participantsUpdate = handler.participantsUpdate.bind(sock)
sock.groupsUpdate = handler.groupsUpdate.bind(sock)
sock.onDelete = handler.deleteUpdate.bind(sock)
sock.onCall = handler.callUpdate.bind(sock)
sock.connectionUpdate = connectionUpdate.bind(sock)
sock.credsUpdate = saveCreds.bind(sock, true)

sock.ev.on(`messages.upsert`, sock.handler)
sock.ev.on(`group-participants.update`, sock.participantsUpdate)
sock.ev.on(`groups.update`, sock.groupsUpdate)
sock.ev.on(`message.delete`, sock.onDelete)
sock.ev.on(`call`, sock.onCall)
sock.ev.on(`connection.update`, sock.connectionUpdate)
sock.ev.on(`creds.update`, sock.credsUpdate)
isInit = false
return true
}
creloadHandler(false)
})
}

export async function startSubBots() {
const subBotDir = path.resolve("./jadibts");
    if (!fs.existsSync(subBotDir)) return;
    const subBotFolders = fs.readdirSync(subBotDir).filter(folder => 
        fs.statSync(path.join(subBotDir, folder)).isDirectory()
    );
    for (const folder of subBotFolders) {
        const pathAnyaJadiBot = path.join(subBotDir, folder);
        const credsPath = path.join(pathAnyaJadiBot, "creds.json");
        if (fs.existsSync(credsPath)) {
            await AnyaJadiBot({
                pathAnyaJadiBot,
                m: null,
                conn: global.conn,
                args: [],
                usedPrefix: '#',
                command: 'jadibot',
                fromCommand: false
            });
        }
    }
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
function sleep(ms) {
return new Promise(resolve => setTimeout(resolve, ms));}

async function joinChannels(conn) {
for (const channelId of Object.values(global.ch)) {
await conn.newsletterFollow(channelId).catch(() => {})
}}

const activeConnections = new Set()
const failedBots = new Map()

async function checkSubBots() {
    const subBotDir = path.resolve("./jadibts")
    if (!fs.existsSync(subBotDir)) return

    const subBotFolders = fs.readdirSync(subBotDir).filter(folder => 
        fs.statSync(path.join(subBotDir, folder)).isDirectory()
    )

    for (const folder of subBotFolders) {
        const pathAnyaJadiBot = path.join(subBotDir, folder)
        const credsPath = path.join(pathAnyaJadiBot, "creds.json")
        if (!fs.existsSync(credsPath)) continue

        const isAlreadyConnected = global.conns.find(conn =>
            conn.user?.jid?.includes(folder) || path.basename(pathAnyaJadiBot) === folder
        )

        if (isAlreadyConnected || activeConnections.has(folder)) continue

        const now = Date.now()
        const pauseInfo = failedBots.get(folder)
        if (pauseInfo && now < pauseInfo.resumeAt) {
            const mins = Math.ceil((pauseInfo.resumeAt - now) / 60000)
           // console.log(chalk.gray(`Sub-bot (+${folder}) está en pausa. Reintento en ${mins} min...`))
            continue
        }

        console.log(chalk.yellow(`Sub-bot (+${folder}) no conectado. Intentando activarlo...`))
        activeConnections.add(folder)

        try {
            await AnyaJadiBot({
                pathAnyaJadiBot,
                m: null,
                conn: global.conn,
                args: [],
                usedPrefix: '#',
                command: 'jadibot',
                fromCommand: false
            })
            failedBots.delete(folder) //connection 
        } catch (e) {
            console.error(chalk.red(`Error al activar sub-bot (+${folder}):`), e)
            const retries = (failedBots.get(folder)?.retries || 0) + 1
            if (retries >= 5) {
                console.log(chalk.redBright(`Sub-bot (+${folder}) falló 5 veces. Se pausará 1 hora.`))
                failedBots.set(folder, { retries, resumeAt: Date.now() + 3600000 }) // 1 hora
            } else {
                failedBots.set(folder, { retries, resumeAt: Date.now() + 10000 }) // espera 10s entre intentos
            }
        } finally {
            setTimeout(() => activeConnections.delete(folder), 30000)
        }
    }
}

setInterval(checkSubBots, 60000); //1min