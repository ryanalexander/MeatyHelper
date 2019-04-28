const Discord = require("discord.js");
const fs = require("fs");
const config = JSON.parse(fs.readFileSync('./bin/config.json', 'utf8'));
module.exports = function execute(data,GuildsConfigs,client) {
    const type = ((data.guild!=null)? "guild":"private");
    const guild = ((type==="guild")? data.guild:null);
    const message = data.content;
    const sender = ((data.member!=null)? data.member : data.author);
    var joindate = data.member.joinedAt;
    joindate = joindate;

    const embed = new Discord.RichEmbed()
        .setColor(config.bot_colour)
        .setAuthor(data.member.displayName,data.author.avatarURL)
        .addField("Joined",joindate,true);
    data.channel.send(embed);
};