const Discord = require("discord.js");
const fs = require("fs");
const config = JSON.parse(fs.readFileSync('./bin/config.json', 'utf8'));
module.exports = (data,GuildsConfigs,client)=>{
    var type = ((data.guild!=null)? "guild":"private");
    var guild = ((type==="guild")? data.guild:null);
    var message = data.content;
    var sender = ((data.member!=null)? data.member : data.author);
    var args = message.split(" ");

    if(sender.id!=="317236321099710467"){
        data.channel.send(new Discord.RichEmbed().addField("No Permission","Only Bot Administrators may execute this command.").setColor(config.bot_colour_error));
        return false;
    }
    let users;
    let i;
    switch(args[1].toLowerCase()){
        case "clearroles":
            process.setMaxListeners(0);
            require('events').EventEmitter.prototype._maxListeners = 0;
            users = [];
            i = 0;
            guild.roles.get("556486285540458507").members.forEach((snowflake,_)=>{
                snowflake.removeRole("556486285540458507").then(()=>{
                    console.log(`[Updating Roles] Updated role for ${snowflake.user.username}`);
                }).catch((e)=>{
                    i++;
                    setTimeout(()=>{
                        snowflake.removeRole("556486285540458507").then(()=>{
                            console.log(`[Updating Roles] Updated role for ${snowflake.user.username}`);
                        }).catch((e)=>{
                            console.log(`[Updating Roles] Failed to update role for ${snowflake.user.username}`);
                        });
                    },i*1000);
                });
            });
            data.channel.send(new Discord.RichEmbed().addField("Updating Roles","Finished").setColor(0xf4ad42));
            break;
        case "updateroles":
            process.setMaxListeners(0);
            require('events').EventEmitter.prototype._maxListeners = 0;
            users = [];
            i = 0;
            guild.members.forEach((snowflake,_)=>{
                if(!snowflake.roles.has("556486285540458507")){
                    snowflake.addRole("556486285540458507");
                    data.channel.send(new Discord.RichEmbed().addField("Updating Roles","Updated role for "+snowflake.user.username).setColor(0xf4ad42));

                }
            });
            data.channel.send(new Discord.RichEmbed().addField("Updating Roles","Checking all roles, applying new roles if required.").setColor(0xf4ad42));
            break;
        case "listroles":
            guild.roles.forEach((snowflake,_)=>{
                console.log(`NAME: ${snowflake.name} ID: ${snowflake.id}`);
            });
    }
};