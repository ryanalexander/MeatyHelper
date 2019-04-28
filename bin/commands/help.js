const Discord = require("discord.js");
const fs = require("fs");
const config = JSON.parse(fs.readFileSync('./bin/config.json', 'utf8'));
module.exports = function execute(data,GuildsConfigs,client) {
    const type = ((data.guild!=null)? "guild":"private");
    const guild = ((type==="guild")? data.guild:null);
    const message = data.content;
    const sender = ((data.member!=null)? data.member : data.author);


    const embed = new Discord.RichEmbed()
        .setColor(config.bot_colour)
        .addField(config.bot_title+" | Help Menu","\u200B",false)
        .addField("Guild Owner",guild.owner,true)
        .addField("Guild Size",guild.memberCount,true)
        .addField("Guild Name",guild.name,true)

        .addField("\u200B","**General Commands**",false)
        .addField(config.bot_prefix+"help","Display the help menu",true);
    if(GuildsConfigs.plugins.music.enabled===true) {
        embed.addField("\u200B", "**Music Commands**", false)
            .addField(config.bot_prefix+"play", "Play any song you can think of. [URL | NAME]", true)
            .addField(config.bot_prefix+"pause", "Pause any playing song.", true)
            .addField(config.bot_prefix+"stop", "Used to skip the playing song", true)
            .addField(config.bot_prefix+"skip", "Starts playing the next song in the queue.", true)
            .addField(config.bot_prefix+"resume", "Resume a paused song.", true);
    }
    if(GuildsConfigs.plugins.levels.enabled===true){
        embed.addField("\u200B","**Levels Commands**",false)
            .addField(config.bot_prefix+"rank","Display you own rank, or someone else's. {@USER}",true)
            .addField(config.bot_prefix+"leaderboard","Show the current top 5 members of the Discord.",true)
    }
    if(GuildsConfigs.plugins.moderation.enabled===true&&data.member.hasPermission("MANAGE_MESSAGES")){
        embed.addField("\u200B","**Moderation Commands**",false)
            .addField(config.bot_prefix+"clear","Clear the messages in this channel. {@USER | COUNT}",true)
            .addField(config.bot_prefix+"mute","Mute a specific member. [@USER]",true)
            .addField(config.bot_prefix+"unmute","Unmute a specific member. [@USER]",true);
    }
    embed.addBlankField(true);
    embed.addField("MeatyHelper was provided by","https://stelch.com/",true);
    embed.addBlankField(true);
    data.channel.send(embed);
};