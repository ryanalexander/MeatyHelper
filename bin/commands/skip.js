const Discord = require("discord.js");
const fs = require("fs");
const config = JSON.parse(fs.readFileSync('./bin/config.json', 'utf8'));
module.exports = function execute(data,GuildsConfigs,client) {
    const type = ((data.guild!=null)? "guild":"private");
    const guild = ((type==="guild")? data.guild:null);
    const message = data.content;
    const sender = ((data.member!=null)? data.member : data.author);
    data.channel.send(new Discord.RichEmbed()
        .setColor(config.bot_colour)
        .addField(":musical_note: DJ","Skipped ``"+GuildsConfigs.plugins.music.queue[((GuildsConfigs.plugins.music.queuepos-1!==-1)?GuildsConfigs.plugins.music.queuepos-1:GuildsConfigs.plugins.music.queuepos)]['snippet']['title']+"``"));
    GuildsConfigs.plugins.music.dispatcher.end();
};