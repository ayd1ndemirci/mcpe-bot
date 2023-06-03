const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');
const Gamedig = require('gamedig');

const bot = new Client({ intents: [GatewayIntentBits.Guilds] });

const token = "your_bot_token";
const serverIP = 'play.craftersmc.net';
const serverPort = 19132;

bot.on('ready', () => {
  console.log(`Bot başarıyla giriş yaptı: ${bot.user.tag}`);
  checkServerStatus();
  setInterval(checkServerStatus, 5000);
});

async function checkServerStatus() {
  try {
    const response = await Gamedig.query({
      type: 'minecraftpe',
      host: serverIP,
      port: serverPort,
    });
    const playerCount = response.players.length;
    const status = `Sunucuda ${playerCount} kişi`;
    bot.user.setActivity(status);
   // console.log(status)
  } catch (error) {
    console.error('Sunucu durumu kontrol edilemedi.', error);
    bot.user.setActivity('Sunucu durumu kontrol edilemedi.');
  }
}

bot.login(token);
