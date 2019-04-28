const Discord = require("discord.js");
const mysql = require('mysql');
const fs = require("fs");
const config = JSON.parse(fs.readFileSync('./bin/config.json', 'utf8'));
module.exports = function execute(data,GuildsConfigs,client) {
    const type = ((data.guild!=null)? "guild":"private");
    const guild = ((type==="guild")? data.guild:null);
    const message = data.content;
    const sender = ((data.member!=null)? data.member : data.author);
    const req_usr = ((data.mentions.members.first()!==undefined)? data.mentions.members.first():sender);

    require("../data/levels.js").getlevel(req_usr.user,function(d){
        if(d["exp"]===0){return false;}
        const embed = new Discord.RichEmbed()
            .setColor(config.bot_colour)
            .setAuthor(req_usr.displayName, req_usr.user.avatarURL)
            .addField("Rank",d['position']+"/"+d['total'],true)
            .addField("Experience", d['exp'],true);
        data.channel.send(embed);
    });
};