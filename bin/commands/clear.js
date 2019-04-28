const Discord = require("discord.js");
var fs = require("fs");
var config = JSON.parse(fs.readFileSync('./bin/config.json', 'utf8'));

module.exports = function execute(message,guild,client) {
    var sender = message.member;
    var args = message.content.split(" ");

    var count = 0;
    var params = "";
    var user = "";
    var max = 500;
    if(args[1]!=null&&!isNaN(args[1])){
        max=parseInt(args[1]);
    }else if(args[1]!=null&&message.mentions.members.first()!=null){
        user=message.mentions.members.first();
    }

    

    if (message.channel.type == 'text') {
        message.channel.fetchMessages()
            .then(function(messages){
                if(user==""&&max==500){
                    message.channel.bulkDelete(messages);
                    count=messages.size;
                }else {
                    messages.forEach(function (msg, snowflake) {
                        if (count > (max - 1)) {
                            return false;
                        }
                        if (msg.member != user && user != "") {
                            return false;
                        }
                        count = count + 1;
                        msg.delete();
                    });
                }
                message.channel.send(new
                Discord.RichEmbed()
                    .setColor(0xf0d000)
                    .addField("Moderation","Deleted ``"+count+"`` messages.",false)).then(function(message){
                    setTimeout(function(){
                        message.delete();
                    },10000);
                });
            }).catch(function(){
            message.channel.send(new
            Discord.RichEmbed()
                .setColor(0xD60900)
                .addField("Something broke","An error has occured, Sorry :3.",false));
        });
    }

}