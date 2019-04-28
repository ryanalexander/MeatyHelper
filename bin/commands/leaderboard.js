var mysql = require('mysql2');
const Discord = require("discord.js");
const fs = require("fs");
const config = JSON.parse(fs.readFileSync('./bin/config.json', 'utf8'));

module.exports = function(msg,GuildsConfigs,client){
    var sender = msg.member;
    var guild = msg.guild;
    var args = msg.content.split(" ");
    var data = mysql.createConnection({
        host:'35.224.90.219',
        user:'root',
        password:'Garcia#02',
        database:'stelch',
        port:3306
    });
    var found = false;
    // SELECT * FROM stelch.ranks ORDER BY exp DESC LIMIT 3
    data.query("SELECT * FROM stelch.ranks ORDER BY exp DESC LIMIT 5", function (err, result) {
        console.log("Called select");
        if (err) throw err;
        found = true;
        level = result[0];
        if (level === undefined) {
            var embed = new Discord.RichEmbed()
                .setColor(config.bot_colour_error)
                .addField("FakeJake Leaderboard","Nothing to show, yet!");
            msg.channel.send(embed);
            return false;
        }
        data.close();
        var embed = new Discord.RichEmbed()
            .setColor(config.bot_colour)
            .setTitle("FakeJake Leaderboard");
        for (var i = 0; i < result.length; i++) {
            embed.addField("Name","<@"+result[i]['discord_id']+">",true);
            embed.addField("XP",result[i]['exp'],true)
            embed.addBlankField(true);
        }
        msg.channel.send(embed);
    });
};