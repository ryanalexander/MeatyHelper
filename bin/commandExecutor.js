const fs = require("fs");
const config = JSON.parse(fs.readFileSync('bin/config.json', 'utf8'));
const Discord = require("discord.js");
exports.commands = {
    "execute":"default",
    "clear":"moderation",
    "clear2":"moderation",
    "mute":"moderation",
    "unmute":"moderation",
    "cooldown":"moderation",
    "queue":"music",
    "play":"music",
    "resume":"music",
    "pause":"music",
    "leave":"music",
    "stop":"music",
    "skip":"music",
    "help":"default",
    "rank":"levels",
    "leaderboard":"levels",
    "whendidijoin":"default"
};
var cmd_config = null;
exports.isEnabled = function(guild_id, command,GuildsConfigs){
    switch (this.commands[command]){
        case "moderation":
            cmd_config = GuildsConfigs.plugins.moderation;
            return GuildsConfigs.plugins.moderation.enabled;
        case "music":
            cmd_config = GuildsConfigs.plugins.music;
            return GuildsConfigs.plugins.music.enabled;
        case "levels":
            cmd_config = GuildsConfigs.plugins.levels;
            return GuildsConfigs.plugins.levels.enabled;
        case "default":
            cmd_config = {"enabled":GuildsConfigs.plugins.default.enabled,"required_channel":""};
            return true;
    }
};
exports.canExecute = function (guild_id,data,GuildsConfig) {
    var permit = false;

    if(data.channel.id===cmd_config.required_channel||cmd_config.required_channel===""){
        if(cmd_config.access_requirement){
            switch(cmd_config.access_requirement.type){
                case "discord":
                    return data.member.hasPermission(cmd_config.access_requirement.args);
                case "role":
                    return data.member.roles.find("name", cmd_config.access_requirement.args);
                default:
                    return true;
            }
        }else{return true;}
    }


    return permit;
};

exports.oncommand = function(data,GuildsConfigs,client) {
    var args = data.content.replace(config.bot_prefix, "").split(" ");
    if(this.isEnabled(data.guild.id,args[0],GuildsConfigs)){
        if(this.canExecute(null,data,GuildsConfigs)) {
            require("./commands/" + args[0] + ".js")(data, GuildsConfigs, client);
            data.delete();
        }else {
            console.log("Command Disabled");
        }
    }else {
        console.log("Invalid Command");
        return false;
    }
};