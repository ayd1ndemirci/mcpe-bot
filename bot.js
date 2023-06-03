const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');
const Gamedig = require('gamedig');

const bot = new Client({ intents: [GatewayIntentBits.Guilds] });

const config = new require("./config.json");

bot.on('ready', () => {
  console.log(`Bot başarıyla giriş yaptı: ${bot.user.tag}`);
  checkServerStatus();
  setInterval(checkServerStatus, 5000);
});

async function checkServerStatus() {
  try {
    const response = await Gamedig.query({
      type: 'minecraftpe',
      host: config.ip,
      port: config.port,
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

bot.login(config.token);
