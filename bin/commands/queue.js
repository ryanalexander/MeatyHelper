const Discord = require("discord.js");
var fs = require("fs");
var config = JSON.parse(fs.readFileSync('./bin/config.json', 'utf8'));

module.exports = function execute(data,GuildsConfigs,client) {
    var queue = GuildsConfigs.plugins.music.queue;
    var queuepos = GuildsConfigs.plugins.music.queuepos;

    const embed = new Discord.RichEmbed()
        .setColor(config.bot_colour)
        .setTitle("Current Queue");

    var count = 0;

    queue.forEach(function(value){
        count++;
        embed.addField("Title",value);
    });
    if(count==0){
        data.channel.send(new Discord.RichEmbed()
            .setColor(config.bot_colour_error)
            .addField(":musical_note: DJ Queue","There is currently nothing in the queue."));
    }
};