const client = global.client;
const { MessageEmbed } = require("discord.js");
const Settings = require("../Helper's/Settings.json");
const sunucuVeri = require("../Helper's/MongooseSchema/_setup")
const moment = require('moment');
const Database = require("../Helper's/MongooseSchema/ExecutorModel")
const YasaklıTag = require("../Helper's/MongooseSchema/YasaklıTag")

const data = require("../Helper's/MongooseSchema/YasaklıTag")
module.exports = async (member) => {
    let Server = await sunucuVeri.findOne({ guildID: client.guilds.cache.get(Settings.guildID) })
    let WelcomeChannel = Server.registerChannel
    let unregisterRole = Server.unregisterRole
    let supheliRole = Server.suspiciousRole
    let cmuted = Server.mutedRole
    let kurallar = Server.kurallarchannel
    let sunucuTag = Server.sunucuTag

    if(member.user.bot) return

    let guild = client.guilds.cache.get(Settings.guildID)
    Database.find({guildID: guild.id, activity: true,Type: "JAIL",Temporary: true},async function(err, Cezali) {
        if ((!Cezali) || (Cezali.length < 1)) return null;
        for (var AnoraWex of Cezali) {
            let user = guild.members.cache.get(AnoraWex.victimID)
            if(!user)  return null
                    if(!user.roles.cache.has(Server.jailedRole)) {
                      user.roles.set([Server.jailedRole]);}}})
let suphelilik = true;
    if ((Date.now() - member.user.createdAt) > (1000 * 60 * 60 * 24 * 7)) suphelilik = false;
    let guildSize = member.guild.members.cache.size;
    if(suphelilik) {
        member.roles.add(supheliRole)
        if (WelcomeChannel) client.channels.cache.get(WelcomeChannel).send(`${member} katıldı. Fakat hesabı \`7\` günden yeni olduğu için onu \`Şüpheli\` kısmına gönderdim.`)
        member.setNickname(Settings["Guild.Süpheli.İsim"])
        } else {                   
        member.roles.add(unregisterRole)
        if (WelcomeChannel) client.channels.cache.get(WelcomeChannel).send(`
        ${member}, Medeniyet Sunucumuza Hoş Geldin
Seninle beraber sunucumuz **${member.guild.members.cache.size}** üye sayısına ulaştı.

Hesabını __${moment(member.user.createdTimestamp).locale("tr").format("LLL")}__ tarihinde (<t:${Math.floor(Math.floor(member.user.createdTimestamp) / 1000)}:R>) oluşturulmuş.
Kayıt işlemlerinden sonra <#${Settings.KurallarChannel}> kanalından sunucu kurallarımızı okuyabilirsin.

Sol tarafta bulunan kayıt odalarında kayıt işlemini gerçekleştirebilirsin, İyi Eğlenceler...`)
            member.setNickname(Settings["Guild.Unregister.İsim"])
            if(member.user.username.includes(sunucuTag)) member.roles.add(Server.familyRole)
        }
    }
        

module.exports.conf = {
    name: "guildMemberAdd"
}
