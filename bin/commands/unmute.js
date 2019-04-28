const Discord = require("discord.js");
const fs = require("fs");
const config = JSON.parse(fs.readFileSync('./bin/config.json', 'utf8'));
module.exports = function execute(data,GuildsConfigs,client) {
    const type = ((data.guild!=null)? "guild":"private");
    const guild = ((type==="guild")? data.guild:null);
    const message = data.content;
    const victom = data.mentions.members.first();
    const sender = ((data.member!=null)? data.member : data.author);
    const args = message.split(" ");


    if(victom.member===null){return false;}
    try {
        data.guild.channels.forEach(function(channel,snowflake){
            try {
                channel.permissionOverwrites.get(victom.id).delete();

            }catch(e){
                return false;
            }

        });
        guild.channels.get("555423178608869376").send(new Discord.RichEmbed()
            .setColor(config.bot_colour)
            .addField("Moderation",`${victom} is no longer muted. `));
    }catch(e){
        console.log(e);
        data.channel.send("Failed to un-mute ``"+args[1]+"``");
    }
};