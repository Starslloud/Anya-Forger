const { DisconnectReason, useMultiFileAuthState, MessageRetryMap, fetchLatestBaileysVersion, Browsers, makeCacheableSignalKeyStore, jidNormalizedUser, PHONENUMBER_MCC } = await import('@whiskeysockets/baileys')
import moment from 'moment-timezone'
import NodeCache from 'node-cache'
import readline from 'readline'
import qrcode from "qrcode"
import fs from "fs"
import pino from 'pino'
import * as ws from 'ws'
const { CONNECTING } = ws
import { Boom } from '@hapi/boom'
import { makeWASocket } from '../lib/simple.js'

if (global.conns instanceof Array) console.log()
else global.conns = []

let handler = async (m, { conn: star, args, usedPrefix, command, isOwner }) => {
  let parent = args[0] && args[0] == 'plz' ? _conn : await global.conn
  if (!((args[0] && args[0] == 'plz') || (await global.conn).user.jid == _conn.user.jid)) {
    return m.reply(`Este comando solo puede ser usado en el bot principal! wa.me/${global.conn.user.jid.split`@`[0]}?text=${usedPrefix}code`)
  }

  async function serbot() {

    let authFolderB = m.sender.split('@')[0]

    if (!fs.existsSync("./serbot/" + authFolderB)) {
        fs.mkdirSync("./serbot/" + authFolderB, { recursive: true })
    }
    args[0] ? fs.writeFileSync("./serbot/" + authFolderB + "/creds.json", JSON.stringify(JSON.parse(Buffer.from(args[0], "base64").toString("utf-8")), null, '\t')) : ""

    const { state, saveState, saveCreds } = await useMultiFileAuthState(`./serbot/${authFolderB}`)
    const msgRetryCounterMap = (MessageRetryMap) => { }
    const msgRetryCounterCache = new NodeCache()
    const { version } = await fetchLatestBaileysVersion()
    let phoneNumber = m.sender.split('@')[0]

    const methodCodeQR = process.argv.includes("qr")
    const methodCode = !!phoneNumber || process.argv.includes("code")
    const MethodMobile = process.argv.includes("mobile")

    const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
    const question = (texto) => new Promise((resolver) => rl.question(texto, resolver))

    const connectionOptions = {
      logger: pino({ level: 'silent' }),
      printQRInTerminal: false,
      mobile: MethodMobile, 
      browser: [ "Ubuntu", "Chrome", "20.0.04"], 
      auth: {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: "fatal" })),
      },
      markOnlineOnConnect: true, 
      generateHighQualityLinkPreview: true, 
      getMessage: async (clave) => {
        let jid = jidNormalizedUser(clave.remoteJid)
        let msg = await store.loadMessage(jid, clave.id)
        return msg?.message || ""
      },
      msgRetryCounterCache,
      msgRetryCounterMap,
      defaultQueryTimeoutMs: undefined,   
      version
    }

    let conn = makeWASocket(connectionOptions)

    if (methodCode && !conn.authState.creds.registered) {
        if (!phoneNumber) {
            process.exit(0)
        }
        let cleanedNumber = phoneNumber.replace(/[^0-9]/g, '')
        if (!Object.keys(PHONENUMBER_MCC).some(v => cleanedNumber.startsWith(v))) {
            process.exit(0)
        }

        setTimeout(async () => {
            let codeBot = await conn.requestPairingCode(cleanedNumber)
            codeBot = codeBot?.match(/.{1,4}/g)?.join("-") || codeBot
            let txt = `✿ *Vincula tu cuenta usando el codigo.*\n\n`
                txt += `[ ✰ ] Sigue las instrucciones:\n`
                txt += `*» Mas opciones*\n`
                txt += `*» Dispositivos vinculados*\n`
                txt += `*» Vincular nuevo dispositivo*\n`
                txt += `*» Vincular usando numero*\n\n`
                txt += `> *Nota:* Este Código solo funciona en el número que lo solicito`
            let pp = "./storage/mp4/serbot.mp4"
            let sendTxt = await star.reply(m.chat, txt, m, rcanal)
            let sendCode = await star.reply(m.chat, codeBot, m, rcanal)
        
            setTimeout(() => {
                star.sendMessage(m.chat, { delete: sendTxt })
                star.sendMessage(m.chat, { delete: sendCode })
            }, 30000)
            rl.close()
        }, 3000)
    }

    conn.isInit = false
    let isInit = true

    async function connectionUpdate(update) {
        const { connection, lastDisconnect, isNewLogin, qr } = update
        if (isNewLogin) conn.isInit = true
        const code = lastDisconnect?.error?.output?.statusCode || lastDisconnect?.error?.output?.payload?.statusCode;
        if (code && code !== DisconnectReason.loggedOut && conn?.ws.socket == null) {
            let i = global.conns.indexOf(conn)
            if (i < 0) return console.log(await creloadHandler(true).catch(console.error))
            delete global.conns[i]
            global.conns.splice(i,