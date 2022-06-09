
const { Client, Collection, Intents } = require("discord.js");
const client = global.client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_VOICE_STATES,
    Intents.FLAGS.GUILD_PRESENCES,
  ]
});
const { readdir } = require("fs");
client.channelTime = new Map()
const commands = client.commands = new Collection();
const Settings = require("./Helper's/Settings.json")
const aliases = client.aliases = new Collection();
let data = require("./Helper's/MongooseSchema/Komut-engel")
require("./Helper's/DatabaseHandler");
require("./Helper's/Function")(client)
client.Snipe = new Set()
client.blockedFromCommand = []
client.commandBlock = new Map()
client.snipe = new Map()
client.invites = global.invites = new Map();

const { MessageEmbed } = require("discord.js");
const moment = require("moment")
var logs = require("discord-logs")
logs(client)
const rollogg = require("./Helper's/MongooseSchema/roleLog");

readdir("./Command's/", (err, files) => {
  if (err) console.error(err)
  files.forEach(f => {
    readdir("./Command's/" + f, (err2, files2) => {
      if (err2) console.log(err2)
      files2.forEach(file => {
        let prop = require(`./Command's/${f}/` + file);
        commands.set(prop.name, prop);
        prop.aliases.forEach(alias => {
        aliases.set(alias, prop.name);
        });
      });
    });
    console.log("Eventler Yüklendi")
  });
});

readdir("./Event's/", (err, files) => {
  if (err) return console.error(err);
  files.filter((file) => file.endsWith(".js")).forEach((file) => {
    let prop = require(`./Event's/${file}`);
    if (!prop.conf) return;
    client.on(prop.conf.name, prop);
  });
  console.log("Eventler Yüklendi")
});

client.on("guildMemberRoleAdd", (member, role) => {
member.guild.fetchAuditLogs({ type: "MEMBER_ROLE_UPDATE"}).then(async (audit) => {
let ayar = audit.entries.first()
let hedef = ayar.target
let yapan = ayar.executor
let Embed = new MessageEmbed().setColor("GREEN").setFooter(Settings["Client.Bot.Footer"]).setAuthor(yapan.tag, yapan.avatarURL({dynamic: true}))
if (yapan.bot) return
new rollogg({Rol: role.id,ExecID: yapan.id, emoji: "EKLENDİ.",Date: Date.now(),victimID: member.id}).save()
client.channels.cache.find(a => a.name === "role-log").send({ embeds: [Embed.setDescription(`${member} üyesine bir rol **eklendi.**\n\n**Rolü ekleyen kişi:** ${yapan} (\`${yapan.id}\`)\n**Eklenen rol:** ${role} (\`${role.id}\`)\n**Eklenme Tarihi:** \`${moment(Date.now()).locale("tr").format("LLL")}\`\n\n\`.rollog ${hedef.id}\``)] });});})
//-
client.on("guildMemberRoleRemove", (member, role) => {
member.guild.fetchAuditLogs({ type: "MEMBER_ROLE_UPDATE"}).then(async (audit) => {
let ayar = audit.entries.first()
let hedef = ayar.target
let yapan = ayar.executor
let Embed = new MessageEmbed().setColor("RED").setFooter(Settings["Client.Bot.Footer"]).setAuthor(yapan.tag, yapan.avatarURL({dynamic: true}))
if (yapan.bot) return
new rollogg({Rol: role.id,ExecID: yapan.id, emoji: "ALINDI. ",Date: Date.now(),victimID: member.id}).save()
client.channels.cache.find(a => a.name === "role-log").send({ embeds: [Embed.setDescription(`${member} üyesinden bir rol **Alındı.**\n\n**Rolü alan kişi:** ${yapan} (\`${yapan.id}\`)\n**Alınan rol:** ${role} (\`${role.id}\`)\n**Alınma Tarihi:** \`${moment(Date.now()).locale("tr").format("LLL")}\`\n\n\`.rollog ${hedef.id}\``)] });});})
//-
client.on("guildMemberNicknameUpdate", (member, oldNickname, newNickname) => {
member.guild.fetchAuditLogs({
type: "MEMBER_UPDATE"}).then(async (audit) => {
let ayar = audit.entries.first()
let hedef = ayar.target
let yapan = ayar.executor
let Embed = new MessageEmbed().setColor("BLUE").setFooter(Settings["Client.Bot.Footer"]).setAuthor(yapan.tag, yapan.avatarURL({dynamic: true}))
client.channels.cache.find(a => a.name === "nickname-log").send({ embeds: [Embed.setDescription(`\`${hedef.tag}\` adlı kullanıcının sunucu içerisindeki kullanıcı adı değiştirildi.\n**ESKİ**: \`${oldNickname || member.user.username}\` - **YENİ**: \`${newNickname || member.user.username}\`\`\`\`Kullanıcı: ${hedef.tag} (${hedef.id})\nDeğiştirme Tarihi: \`${moment(Date.now()).locale("tr").format("LLL")}\`\nDeğiştiren: ${yapan.tag} (${yapan.id})\`\`\``)] });});})
//-
client.on('voiceStateUpdate', async (oldState, newState) => {
  if (!oldState.channelId && newState.channelId) { 
      //  let users = newState.guild.members.cache.get(newState.id)
  let member = newState.guild.members.cache.get(newState.id)
  let microphone = member.voice.selfMute ? "kapalı" : "açık";
  let headphones = member.voice.selfDeaf ? "kapalı" : "açık";
  let Embed = new MessageEmbed().setColor("GREEN")
  .setColor("GREEN")
  .setAuthor(oldState.member.user.username, oldState.member.user.displayAvatarURL({ dynamic: true, size: 1024 }))
  .setThumbnail(oldState.member.user.displayAvatarURL({ dynamic: true}))
  .setDescription(`<@${newState.member.user.id}> üyesi <#${newState.channel.id}> kanalına giriş yaptı.\n\n**Kanala girdiği anda:**\n\`•\` Mikrofon durumu: \`${microphone}\`.\n\`•\` Kulaklık durumu: \`${headphones}\`.\n\`\`\`Giridiği kanal: ${newState.channel.name} (${newState.channelId})\nKullanıcı: ${newState.member.user.tag} (${newState.member.user.id})\nEylem Gerçekleşme: ${moment(newState.createdAt).locale("tr").format('LLL')}\n\n\n\`\`\`\nGirdiği kanalda bulunan üyeler:\n${newState.channel.members.map(x => `${x.user} - \`${x.user.id}\``).join("\n")}`)   
  return client.channels.cache.find(a => a.name === "ses-log").send({ embeds: [Embed]})}});


  client.on('voiceStateUpdate', async (oldState, newState) => {
    if(oldState.channelId && !newState.channelId){
    let member = newState.guild.members.cache.get(newState.id);
    let microphone = member.voice.selfMute ? "kapalı" : "açık";
    let headphones = member.voice.selfDeaf ? "kapalı" : "açık";
    if(oldState.channel.members.map(x => x)[0]){
    var makro = oldState.channel.members.map(x => `${x.user} - \`${x.user.id}\``).join("\n")} else { var makro = "Maalesef bu kanalda üye bulunmamaktadır."; }
    let SesMicEmbed = new MessageEmbed()
    .setColor("RED")
    .setAuthor(oldState.member.user.username, oldState.member.user.displayAvatarURL({ dynamic: true, size: 1024 }))
    .setThumbnail(oldState.member.user.displayAvatarURL({ dynamic: true}))
    .setDescription(`<@${oldState.member.user.id}> üyesi <#${oldState.channel.id}> kanalından ayrıldı.\n\n**Kanaldan Çıktığı anda:**\n\`•\` Mikrofon durumu: \`${microphone}\`.\n\n\`•\` Kulaklık durumu: \`${headphones}\`.\n\n\`\`\`Çıktığı kanal: ${oldState.channel.name} (${oldState.channelId})\nKullanıcı: ${oldState.member.user.tag} (${oldState.member.user.id})\nEylem Gerçekleşme: ${moment(oldState.createdAt).locale("tr").format('LLL')}\`\`\`\nÇıktığı kanalda bulunan üyeler:\n${makro}`)   
    return client.channels.cache.find(a => a.name === "ses-log").send({ embeds: [SesMicEmbed]})}});
  
    client.on('voiceStateUpdate', async (oldState, newState) => {
      //console.log("sa") 
    if (oldState.channelId && newState.channelId && oldState.channel && newState.channel) {
    if (oldState.channelId !== newState.channelId) {
    //console.log("sam")
    let member = newState.guild.members.cache.get(newState.id);
    let microphone = member.voice.selfMute ? "kapalı" : "açık";
    let headphones = member.voice.selfDeaf ? "kapalı" : "açık";
    if(oldState.channel.members.map(x => x)[0]){
    var makro = oldState.channel.members.map(x => `${x.user} - \`${x.user.id}\``).join("\n")} else {
    var makro = "Maalesef bu kanalda üye bulunmamaktadır.";}
    let SesMicEmbed1 = new MessageEmbed()
    .setColor("ORANGE")
    .setAuthor(oldState.member.user.username, oldState.member.user.displayAvatarURL({ dynamic: true, size: 1024 }))
    .setThumbnail(oldState.member.user.displayAvatarURL({ dynamic: true}))
    .setDescription(`<@${oldState.member.user.id}> üyesi <#${oldState.channel.id}> kanalından <#${newState.channel.id}> kanalına geçiş yaptı.\n\n**Kanal Değiştirdiği Anda:**\n\`•\` Mikrofon durumu: \`${microphone}\`.\n\`•\` Kulaklık durumu: \`${headphones}\`.\n\n\`\`\`Çıktığı kanal: ${oldState.channel.name} (${oldState.channelId})\nKullanıcı: ${oldState.member.user.tag} (${oldState.member.user.id})\nEylem Gerçekleşme: ${moment(oldState.createdAt).locale("tr").format('LLL')}\`\`\`\n\nEski Kanalında Bulunan Üyeler:\n${makro}\n\nYeni Kanalında Bulunan Üyeler:\n${newState.channel.members.map(x => `${x.user} - \`${x.user.id}\``).join("\n")}`)   
    return client.channels.cache.find(a => a.name === "ses-log").send({embeds: [SesMicEmbed1]})}}});   
  
client
	.login(Settings["Client.Token"])
	.then(() => console.log("[BOT] Bot connected!"))
	.catch(() => console.log("[BOT] Bot can't connected!"));
