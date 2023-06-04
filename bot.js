const { Client, GatewayIntentBits, REST, Routes, EmbedBuilder } = require('discord.js');
const axios = require('axios');
const Gamedig = require('gamedig');

const bot = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMembers, GatewayIntentBits.MessageContent] });

const config = new require("./config.json");
const commands = [
  {
    name: "ip",
    description: "Sunucunun IP'sini görme komutu"
  },
  {
    name: "oy",
    description: "Oy site linki kısayolu"
  },
  {
    name: "yardim",
    description: "Yardım komutlarını gösterir"
  }
];

bot.on('ready', () => {
  console.log(`Bot başarıyla giriş yaptı: ${bot.user.tag}`);
  checkServerStatus();
  setInterval(checkServerStatus, 5000);
});
const rest = new REST({ version: '10' }).setToken(config.token);
(async () => {
  try {
    await rest.put(Routes.applicationCommands(config.clientID), { body: commands });
    console.log("Komutlar yükleniyor...");
  } catch (error) {
    console.error(error);
  }
})();

bot.on("messageCreate", async (message) => {
  if (message.content === "!ip") {
    const embed = ipEmbed();
    message.reply({ embeds: [embed] });
  }
});

function ipEmbed() {
  return new EmbedBuilder()
    .setTitle("**Sunucu Adı Sunucu Bilgileri**")
    .setDescription(`**IP Adresi:** \n${config.ip}\n\n**Port:** \n${config.port}`)
    .setColor("Random");
}

bot.on("interactionCreate", async (interaction) => {
  if (interaction.isChatInputCommand) {
    if (interaction.commandName === "ip") {
      const embed = ipEmbed();
      interaction.reply({ embeds: [embed], ephemeral: true });
    }
  }
});
function voteEmbed() {
  return new EmbedBuilder()
    .setTitle("Oy Sitesine gitmek için tıkla")
    .setColor("Random")
    .setURL(config.voteURL);
}
bot.on("interactionCreate", async interaction => {
  if (interaction.isChatInputCommand) {
    if (interaction.commandName === "oy") {
      embed = new voteEmbed();
      interaction.reply({ embeds: [embed], ephemeral: true });
    }
  }
});

bot.on("messageCreate", async (message) => {
  if (message.content === "!oy") {
    const embed = voteEmbed();
    message.reply({ embeds: [embed] });
  }
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
