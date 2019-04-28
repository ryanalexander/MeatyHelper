var Discord = require("discord.js");
var fs = require("fs");
var config = JSON.parse(fs.readFileSync('./bin/config.json', 'utf8'));
module.exports = function execute(data,GuildsConfigs,client) {
    var type = ((data.guild!=null)? "guild":"private");
    var guild = ((type==="guild")? data.guild:null);
    var message = data.content;
    var sender = ((data.member!=null)? data.member : data.author);

    if(GuildsConfigs.plugins.music.dispatcher&&GuildsConfigs.plugins.music.dispatcher.paused==false){
        GuildsConfigs.plugins.music.dispatcher.pause();
        data.channel.send(new Discord.RichEmbed()
            .setColor(config.bot_colour)
            .addField(":musical_note:  DJ","Now paused, feel free to do ``"+config.bot_prefix+"resume`` when you are ready!"));
    }else {
        data.channel.send(new Discord.RichEmbed()
            .setColor(config.bot_colour_error)
            .addField(":musical_note:  DJ","I'm not currently playing a song, :sob:"));
    }
};