const Discord = require("discord.js");
const fs = require("fs");
const config = JSON.parse(fs.readFileSync('./bin/config.json', 'utf8'));
module.exports = function execute(data,GuildsConfigs,client) {
    const guild = data.guild;
    const message = data;
    const sender = ((data.member!=null)? data.member : data.author);
    const args = message.content.split(" ");


    var victom = message.mentions.members.first();
    var seconds = 0;
    var end = 0;
    var type = 0;
    var global = true;

    if(args[2]!=null&&!isNaN(args[2])){
        end=new Date() + (args[2]*60);
        seconds= (args[2]*60);
    }

    if(!victom){
        message.channel.send(new Discord.RichEmbed()
            .setColor(config.bot_colour_error)
            .addField("Missing Arguments","Please specify a user to mute."));
        return false;
    }
    if(args.length>2){type=2;}else{type=1;}
    if(message.content.indexOf("here")>-1||message.content.indexOf("h")>-1)global=false;

    if(message.member===victom){
        message.channel.send(new Discord.RichEmbed()
            .setColor(config.bot_colour_error)
            .addField("You can't do that!!!","You can't mute yourself, just don't talk!"));
        return false;
    }
    if(victom.highestRole.calculatedPosition>(message.member.highestRole.calculatedPosition-1)) {
        message.channel.send(new Discord.RichEmbed()
            .setColor(config.bot_colour_error)
            .addField("You can't do that",`${victom.displayName} is higher than you!`));
        return false;
    }

    try {
        if(global===true){
            message.guild.channels.array().forEach(function(channel,snowflake){channel.overwritePermissions(victom,{"SEND_MESSAGES":false},"User has been muted globally");});
        }else {
            message.channel.overwritePermissions(victom,{"SEND_MESSAGES":false},"User has been muted here");
        }
        if(seconds!==0){
            console.log(victom.displayName+" has been muted for "+seconds+" seconds.");
            setTimeout(function(){
                if(victom.member===null){return false;}
                try {
                    message.guild.channels.forEach(function(channel,snowflake){
                        try {
                            channel.permissionOverwrites.get(victom.id).delete();

                        }catch(e){
                            return false;
                        }

                    });
                    guild.channels.get("555423178608869376").send(new Discord.RichEmbed()
                        .setColor(config.bot_colour)
                        .addField("Moderation",`${victom} has now been un muted. \`\``+((global===true)? "Globally":message.channel.name)+"``"));
                }catch(e){
                    console.log(e);
                    message.channel.send("Failed to unmute ``"+args[1]+"``");
                }
            },seconds*1000);
        }
        guild.channels.get("555423178608869376").send(new Discord.RichEmbed()
            .setColor(config.bot_colour)
            .addField("Moderation",`${victom} has now been muted. \`\``+((global===true)? "Globally":message.channel.name)+"``"));
    }catch(e){
        console.log(e);
        message.channel.send("Failed to mute ``"+victom.displayName+"``");
    }
};