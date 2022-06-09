const Settings = require("../../Helper's/Settings.json")
const AutoReply = require("../../Helper's/AutoRepy")
const sunucuVeri = require("../../Helper's/MongooseSchema/_setup")
const { MessageEmbed, Discord } = require("discord.js");
module.exports = { name: "say", aliases: ["sunucubilgi"],  category: "Co-owner", desc: "Sunucu İstatistiklerini Görüntüleme Komutu",
    execute: async (client, message, args, ClientEmbed, FlatEmbed) => { 
    let Server = await sunucuVeri.findOne({ guildID: client.guilds.cache.get(Settings.guildID) })
    if(!message.member.permissions.has("8") && !Server.yönetimRoles.some(rol => message.member.roles.cache.has(rol)) &&!Server.ownerRoles.some(rol => message.member.roles.cache.has(rol))) return message.reply(AutoReply.YetersizYetki).then(e => setTimeout(() => e.delete().catch(() => { }), 10000))
    let Embed = new MessageEmbed().setAuthor(message.guild.name, message.guild.iconURL({dynamic: true})).setColor("RANDOM");
    let Database = await sunucuVeri.findOne({});
    let Tag = Database.sunucuTag;
    let TaglıKullanıcı = await message.guild.members.cache.filter(member => member.user.username.includes(Tag)).size;
    let ses = message.guild.members.cache.filter(x => x.voice.channel).size
    let bot = message.guild.members.cache.filter(s => s.voice.channel && s.user.bot).size
    let AktifKullanıcı = message.guild.members.cache.filter(member => member.presence && (member.presence.status != "offline")).size
    let Boost = message.guild.premiumSubscriptionCount;
    let BoostLevel = message.guild.premiumTier;
    message.reply({ embeds: [Embed.setDescription(`\`❯\` Şu anda toplam **${ses-bot || "0"}** (**+${bot || "0"} bot**) kişi seslide.
\`❯\` Sunucumuzda şuanda **${TaglıKullanıcı}** kişi tagımızı alarak bizi destekliyor. (\`${Tag}\`)
\`❯\` Sunucuda **${message.guild.memberCount}** adet üye var (**${AktifKullanıcı}** Aktif).
\`❯\` Toplamda **${Boost}** adet boost basılmış! ve Sunucu **${BoostLevel}** seviye.
`)] });

    }
}