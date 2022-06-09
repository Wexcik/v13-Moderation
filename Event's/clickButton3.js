const sunucuVeri = require("../Helper's/MongooseSchema/_setup")
const Settings = require("../Helper's/Settings.json")
const Register = require("../Helper's/MongooseSchema/Registery")
const Database = require("../Helper's/MongooseSchema/ExecutorModel")

const { MessageEmbed, Discord } = require("discord.js");
const moment = require("moment")
module.exports = async (interaction) => {  let Server = await sunucuVeri.findOne({ guildID: client.guilds.cache.get(Settings.guildID) })
        const member = await client.guilds.cache.get(Settings.guildID).members.fetch(interaction.member.user.id)
        let Embed = new MessageEmbed().setAuthor(member.user.tag, member.user.avatarURL({dynamic: true})).setFooter(Settings["Client.Bot.Footer"]).setColor("ORANGE");
        let nickname = member.displayName == member.username ? "" + member.username + " [Yok] " : member.displayName
        const roles = member.roles.cache.filter(role => role.id !== interaction.guild.id).sort((a, b) => b.position - a.position).map(role => `<@&${role.id}>`);
        const rolleri = [];
        if (roles.length > 6) { const lent = roles.length - 6; let itemler = roles.slice(0, 6); itemler.map(x => rolleri.push(x)); rolleri.push(`${lent}...`); } else { roles.map(x => rolleri.push(x));};    
        if (interaction.customId === 'serverProfileUser') {await interaction.reply({ embeds: [Embed.setDescription(`**❯ Kullanıcı Bilgisi**\n\`•\` Hesap: ${member}\n\`•\` Kullanıcı ID: \`${member.id}\`\n\`•\` Kuruluş Tarihi: \`${moment(member.user.createdTimestamp).locale("tr").format("LLL")}\` - (<t:${Math.floor(Math.floor(member.user.createdTimestamp) / 1000)}:R>)\n\n**❯ Sunucu Bilgisi**\n\`•\` Sunucu İsmi: \`${nickname}\`\n\`•\` Katılım Tarihi: \`${moment(member.joinedAt).locale("tr").format("LLL")}\` -(<t:${Math.floor(Math.floor(member.joinedAt) / 1000)}:R>)\n\`•\` Rolleri (${rolleri.length}): ${rolleri.join(", ")}`)], ephemeral: true})}
        if (interaction.customId === 'serverNameHistroy') {
        Register.findOne({guildID: interaction.guild.id, victimID: member.id}, (err, res) => {
        if(!res) { return interaction.reply({content: `${client.emojis.cache.find(x => x.name === "wex_carpi") || "Emoji Bulunamadı"} Databasede kayıtlı bir isim geçmişi bulunamadı.`, ephemeral: true})} else { const History = res.nicknames.reverse().map((e, i) => ` \`${i + 1}.\` \`${e.isimler}\` (**${e.rol}**) - <@${e.execID}> - <t:${Math.floor(Math.floor(e.date) / 1000)}:R>`).slice(0, 30); interaction.reply({ embeds: [Embed.setDescription(`**${interaction.guild.name}** sunucusuna ait son \`30\` isim geçmişiniz aşağıda listelenmiştir.\n\n${History.join("\n")}\n\n${client.emojis.cache.find(x => x.name === "wex_carpi") || "Emoji Bulunamadı"} üyenin \`${History.length}\` adet geçmiş ismi görüntülendi.`)], ephemeral: true})}})}
                
        if (interaction.customId === 'serverStatsUser') {
        await interaction.reply({ embeds: [Embed.setDescription(``)], ephemeral: true})}
        if (interaction.customId === 'serverDavetUser') {
        await interaction.reply({ embeds: [Embed.setDescription(``)], ephemeral: true})}
        if (interaction.customId === 'serverSicilUser') {
                Database.find({victimID: member.id}, async (err, res) => {
                        if (res.length <= 0) return interaction.reply({content: `${client.emojis.cache.find(x => x.name === "wex_carpi") || "Emoji Bulunamadı"} Databasede kayıtlı bir ceza-i işlem geçmişi bulunamadı.`, ephemeral: true})
                        let listed = res.reverse();
                      let History = listed.map((x, index) => `Ceza Durumu  => ${x.activity == true ? "🟢 (Devam Ediyor)" : x.Bitis == "null" ? "🔴 (Bitti)" : "🔴 (Bitti)"}\nID => ${x.cezaID}\nTür => ${x.Type}\nYetkili => ${interaction.guild.members.cache.get(x.execID) ? interaction.guild.members.cache.get(x.execID).displayName : x.execID } (${x.execID})\nTarih => ${moment(Number(x.dateNow)).locale("tr").format("LLL")}\nBitiş Tarihi => ${x.finishDate == "null" ? "KALICI" : x.finishDate == "KALICI" ? "KALICI" : moment(Number(x.finishDate)).locale("tr").format("LLL")}\nSebep => ${x.Reason} `, "").slice(0,1) 
                      let History2 = listed.map((x, index) => `\n \`${index + 1}.\` **[${x.Type}]** <@${x.execID}>  tarafından **${x.Reason}** sebebiyle cezalandırıldı.\`(#${x.cezaID})\``).slice(0,20) 
                      if (res.length > 20) return interaction.reply({content: `${client.emojis.cache.find(x => x.name === "wex_carpi") || "Emoji Bulunamadı"} Databasede 20'den fazla ceza-i işlemin bulundugu için cezalarını listeyemiyorum.`, ephemeral: true})                
        await interaction.reply({ embeds: [Embed.setDescription(`Sunucu İçerisinde Toplam \`${res.length}\` ceza-i işlemin bulunmakta.\n**SON CEZASI**\`\`\`php\n${History}\`\`\`${History2}`)], ephemeral: true})})}

        }
  


module.exports.conf = { name: "interactionCreate"}