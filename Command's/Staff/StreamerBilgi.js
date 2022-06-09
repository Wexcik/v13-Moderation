const AutoReply = require("../../Helper's/AutoRepy")
const sunucuVeri = require("../../Helper's/MongooseSchema/_setup")
const Settings = require("../../Helper's/Settings.json")
const Database = require("../../Helper's/MongooseSchema/StreamerBilgi")
const { table } = require("table")
const { MessageEmbed, Discord, User } = require("discord.js");
const ms = require("ms")
const moment = require("moment")
module.exports = { name: "numara", aliases: ["stbilgi", "streamerbilgi"],  category: "Staff", desc: "StreamerNO ile yayın detaylayını görme komutus",
    execute: async (client, message, args, ClientEmbed, FlatEmbed) => {
    let Server = await sunucuVeri.findOne({ guildID: client.guilds.cache.get(Settings.guildID) })
    let KomutChannel = Server.komutChannels ? `${Server.komutChannels.length > 1 ? Server.komutChannels.slice(0, -1).map(x => `<#${x}>`).join(", ") + " ve " + Server.komutChannels.map(x => `<#${x}>`).slice(-1) : Server.komutChannels.map(x => `<#${x}>`).join("")}` : `${Settings.Warning}`
    if(!message.member.permissions.has("8") && !Server.yönetimRoles.some(rol => message.member.roles.cache.has(rol)) &&!Server.ownerRoles.some(rol => message.member.roles.cache.has(rol)) && !message.member.roles.cache.has(Server.botCommand)) return message.reply(AutoReply.YetersizYetki).then(e => setTimeout(() => e.delete().catch(() => { }), 10000)), message.react(`${client.emojis.cache.find(x => x.name === "wex_carpi")}`)
    if(!Server.komutChannels.some(kanal => message.channel.id.includes(kanal))) return message.reply(`${Settings.Warning} \`Hatalı Kullanım\` Komutları Yanlızca ${KomutChannel} kanallarında kullanabilirsin.`).then(e => setTimeout(() => e.delete().catch(() => { }), 10000)), message.react(`${client.emojis.cache.find(x => x.name === "wex_carpi")}`)
    let Embed = new MessageEmbed().setAuthor(message.author.tag, message.author.avatarURL({dynamic: true})).setFooter(`${Settings["Client.Bot.Footer"]}`).setColor("RANDOM");
    let sayi = args[0]
    if(!Number(sayi) && !sayi) return message.reply(AutoReply.SayıBelirt), message.react(`${client.emojis.cache.find(x => x.name === "wex_carpi")}`)
    Database.findOne({guildID: message.guild.id, StNumara: sayi }, async (err, yayıncı) => {
      if(yayıncı) {
        let veriler = await Database.find({ guildID: message.guild.id, StNumara: sayi })
        let sestekiler = veriler.map(x => `<@&${x.sestekiler}>`).join("\n")
        let sestekileerr = veriler.map((x, index) => `<@${x.sestekiler}>`).join("\n")
       const ses = yayıncı.sestekiler.map(x => `<@${x}> - \`${x}\``).join("\n")
        message.reply({ embeds: [Embed.setDescription(`
        ${client.emojis.cache.find(x => x.name === "wex_soru") || "Emoji Bulunamadı"} **${args[0]}** ceza numarasına ait yayın istatistikleri;\`\`\`js
🗣️ Kullanıcı: ${message.guild.members.cache.get(yayıncı.user) ? message.guild.members.cache.get(yayıncı.user).user.tag : yayıncı.user } (${yayıncı.user})
📺 Yayın Kanalı: ${message.guild.channels.cache.get(yayıncı.channelID) ? message.guild.channels.cache.get(yayıncı.channelID).name : yayıncı.channelID } (${yayıncı.channelID})
🗓️ Yayın Süresi: ${yayıncı.tarih} - ${moment(yayıncı.dateNow).locale("tr").format("LT")}\`\`\`
⏳ Kullanıcı <t:${Math.floor(Math.floor(yayıncı.date) / 1000)}:R> yayında idi.
👁️‍🗨️Yayın Sırasında Sesteki Kullanıcılar;
${ses}
`)]}), message.react(`${client.emojis.cache.find(x => x.name === "wex_tik")}`)
            } else {
                message.reply(AutoReply.CezaNoYok).then(e => setTimeout(() => e.delete().catch(() => { }), 10000)), message.react(`${client.emojis.cache.find(x => x.name === "wex_carpi")}`)
            }
          })
          }
        }
        function dateToUnixEpoch(date) {
    return `<t:${Math.floor(Math.floor(date) / 1000)}:R>`
  }


    
    