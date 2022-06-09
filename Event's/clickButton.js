const sunucuVeri = require("../Helper's/MongooseSchema/_setup")
const Settings = require("../Helper's/Settings.json")
module.exports = async (interaction) => {  let Server = await sunucuVeri.findOne({ guildID: client.guilds.cache.get(Settings.guildID) })
        let member = await client.guilds.cache.get(Settings.guildID).members.fetch(interaction.member.user.id)
        let menu = interaction.customId
        if (menu === "renks") {
          let color = new Map([
            ["kirmizi", Server.renkKırmızı],
            ["turuncu", Server.renkTuruncu],
            ["mor", Server.renkMor],
            ["kahverengi", Server.renkKahverengi],
            ["yesil", Server.renkYesil],
            ["sari", Server.renkSarı],


          ])
          let role = color.get(interaction.values[0])
          let renkroller = [Server.renkKırmızı, Server.renkTuruncu, Server.renkMor, Server.renkSarı, Server.renkKahverengi, Server.renkYesil]
          if (!member.roles.cache.has(Server.familyRole) && !member.roles.cache.has(Server.boosteRole) && !member.permissions.has("ADMINISTRATOR")) {
            interaction.reply({ content: `Bu sistemden sadece isminde \`${Server.sunucuTag}\` bulunan ve Booster üyelerimiz yararlanabilmektedir.`, ephemeral: true })
        } else {
            if (interaction.values[0] === "rolsil") {
              await member.roles.remove(renkroller)
            } else if (role) {
              if (renkroller.some(m => member.roles.cache.has(m))) {
                await member.roles.remove(renkroller)
              }
              await member.roles.add(role)
            }
            interaction.reply({ content: "Rolleriniz düzenlendi.", ephemeral: true })
          }
        } 
    }
  

module.exports.conf = { name: "interactionCreate"}