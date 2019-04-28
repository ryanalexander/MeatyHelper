const Discord = require("discord.js");
const client = new Discord.Client();

//const http = require('./bin/webserver').start({});

const EventHandler =  require("./bin/events.js");
const GuildsConfigs = require("./bin/data/guild.js");
const fs = require("fs");
const config = JSON.parse(fs.readFileSync('./bin/config.json', 'utf8'));
let log_cache = "";

client.on("ready",function(){EventHandler.onready(GuildsConfigs,client);log_cache=fs.readFileSync("./logs.txt");});
client.on("message",function(message){EventHandler.onmessage(message,GuildsConfigs(message.guild.id),client)});
client.on("guildMemberAdd",function(member){EventHandler.guildmemberadd(GuildsConfigs(member.guild.id), client, member);});
client.on("raw",(data)=>{
    if(data['t']==="PRESENCE_UPDATE"||data['t']==="USER_UPDATE"||data['t']==="TYPING_START"){return;}
    log_cache+=JSON.stringify(objToString(data))+"\r\n";
    fs.writeFileSync("./logs.txt",log_cache);
    switch(data['t']){
        case "MESSAGE_REACTION_ADD":
            EventHandler.onreact(client,GuildsConfigs(data['guild_id']),{d:data['d']['emoji'],action:"ADD",channel:client.channels.get(data['d']['channel_id']),guild:data['d']['guild_id']},client.users.get(data['d']['user_id']));
            break;
        case "MESSAGE_REACTION_REMOVE":
            EventHandler.onreact(client,GuildsConfigs(data['guild_id']),{d:data['d']['emoji'],action:"REMOVE",channel:client.channels.get(data['d']['channel_id']),guild:data['d']['guild_id']},client.users.get(data['d']['user_id']));
            break;
    }
});
client.login(config.bot_token);

function objToString (obj) {
    var str = {};
    for (var p in obj) {
        if (obj.hasOwnProperty(p)) {
            str[p]=obj[p];
        }
    }
    return str;
}