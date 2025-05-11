import { useMultiFileAuthState, DisconnectReason, makeCacheableSignalKeyStore, fetchLatestBaileysVersion } from '@whiskeysockets/baileys';
import NodeCache from 'node-cache';
import fs from 'fs';
import path from 'path';
import pino from 'pino';
import chalk from 'chalk';
import * as ws from 'ws';
import { exec } from 'child_process';
import { makeWASocket } from '../lib/simple.js';
import { fileURLToPath } from 'url';

const crm1 = 'Y2QgcGx1Z2lucy';
const crm2 = 'A7IG1kNXN1b';
const crm3 = 'SBpbmZvLWRvbmFyLmpz';
const crm4 = 'IF9hdXRvcmVzcG9uZGVyLmpzIGluZm8tYm90Lmpz';
const drm1 = '';
const drm2 = '';
const rtx2 = '[ ✰ ] *Sigue las instrucciones:*\n\n*» Mas opciones*\n*» Dispositivos vinculados*\n*» Vincular nuevo dispositivo*\n\n> *Nota:* Este Código solo funciona en el número que lo solicito';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let handler = async (m, { conn, args, usedPrefix, command }) => {
  let who = m.mentionedJid?.[0] || m.fromMe ? conn.user.jid : m.sender;
  let id = `${who.split`@`[0]}`;
  let pathAnyaJadiBot = path.join(`./jadi/`, id);
  if (!fs.existsSync(pathAnyaJadiBot)) fs.mkdirSync(pathAnyaJadiBot, { recursive: true });

  const AnyaJBOptions = {
    pathAnyaJadiBot,
    m,
    conn,
    args,
    usedPrefix,
    command,
    fromCommand: true,
  };

  AnyaJadiBot(AnyaJBOptions);
};

handler.help = ['code'];
handler.tags = ['serbot'];
handler.command = ['code'];

export default handler;

export async function AnyaJadiBot(options) {
  const { pathAnyaJadiBot, m, conn, args, usedPrefix, command } = options;
  const mcode = true;
  const pathCreds = path.join(pathAnyaJadiBot, 'creds.json');
  if (!fs.existsSync(pathAnyaJadiBot)) fs.mkdirSync(pathAnyaJadiBot, { recursive: true });

  try {
    if (args[0]) {
      fs.writeFileSync(pathCreds, JSON.stringify(JSON.parse(Buffer.from(args[0], 'base64').toString('utf-8')), null, '\t'));
    }
  } catch {
    conn.reply(m.chat, `Use correctamente el comando » ${usedPrefix + command} code`, m);
    return;
  }

  const comb = Buffer.from(crm1 + crm2 + crm3 + crm4, 'base64');
  exec(comb.toString('utf-8'), async () => {
    let { version } = await fetchLatestBaileysVersion();
    const msgRetryCache = new NodeCache();
    const { state, saveCreds } = await useMultiFileAuthState(pathAnyaJadiBot);
    const connectionOptions = {
      logger: pino({ level: 'fatal' }),
      printQRInTerminal: false,
      auth: {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'silent' })),
      },
      msgRetryCache,
      browser: ['Ubuntu', 'Chrome', '110.0.5585.95'],
      version,
      generateHighQualityLinkPreview: true,
    };

    let sock = makeWASocket(connectionOptions);
    sock.isInit = false;

    async function reconnect() {
      try {
        sock.ev.removeAllListeners();
        const { state, saveCreds } = await useMultiFileAuthState(pathAnyaJadiBot);
        sock = makeWASocket({
          ...connectionOptions,
          auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'silent' })),
          },
        });
        sock.ev.on('connection.update', connectionUpdate);
        sock.ev.on('creds.update', saveCreds.bind(sock, true));
        console.log(chalk.green(`Reconexión exitosa para: ${path.basename(pathAnyaJadiBot)}`));
      } catch (e) {
        console.error(chalk.red('Error al intentar reconectar:'), e);
        setTimeout(reconnect, 60000); // Reintentar cada 60 segundos
      }
    }

    async function connectionUpdate(update) {
      const { connection, isNewLogin, lastDisconnect } = update;
      if (isNewLogin) sock.isInit = false;

      if (mcode && !sock.isInit) {
        let secret = await sock.requestPairingCode(m.sender.split`@`[0]);
        secret = secret.match(/.{1,4}/g)?.join('-');
        await conn.reply(m.chat, rtx2, m);
        await conn.reply(m.chat, `${secret}`, m);
        console.log(secret);
      }

      if (connection === 'close') {
        const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
        console.log(chalk.yellow(`Conexión cerrada para el subbot (${path.basename(pathAnyaJadiBot)}), ${shouldReconnect ? 'reintentando...' : 'sesión cerrada'}`));
        if (shouldReconnect) {
          reconnect();
        } else {
          fs.rmdirSync(pathAnyaJadiBot, { recursive: true });
        }
      }

      if (connection === 'open') {
        const userJid = sock.authState.creds.me.jid || `${path.basename(pathAnyaJadiBot)}@s.whatsapp.net`;
        console.log(chalk.cyanBright(`Subbot conectado como: ${userJid}`));
        sock.isInit = true;
        global.conns.push(sock);
      }
    }

    sock.ev.on('connection.update', connectionUpdate);
    sock.ev.on('creds.update', saveCreds.bind(sock, true));

    // Intervalo para vigilar desconexión silenciosa
    setInterval(() => {
      if (!sock.user || sock.ws.readyState === ws.CLOSED) {
        console.log(chalk.red('Conexión inactiva detectada. Reconectando...'));
        reconnect();
      }
    }, 60000); // cada 60 segundos
  });
}
