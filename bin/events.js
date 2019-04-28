const fs = require("fs");
const config = JSON.parse(fs.readFileSync('bin/config.json', 'utf8'));
const commandExecutor = require("./commandExecutor.js");
const Discord = require("discord.js");
const levels = require("./data/levels");

const reacts = ['fakejake','storytime'];
const channels = ['557904900986765322','398564240006447115'];

exports.onmessage = function(data,GuildsConfigs,client){
    const type = ((data.guild!=null)? "guild":"private");
    const guild = ((type==="guild")? data.guild:null);
    const method_conf = ((type==="guild")? {}:{"permit":false});
    const message = data.content;
    const sender = ((data.member!=null)? data.member : data.author);

    const msg_type = ((message.startsWith(config.bot_prefix))? "command":"message");

    if(msg_type==="command"){commandExecutor.oncommand(data,GuildsConfigs,client);return false;}

    levels.onmessage(sender,client);
};

exports.onready = function(GuildsConfigs,client) {
    console.log(config.bot_title+" has now been started.");
    try {
        client.user.setUsername(config.bot_title).catch((reason)=>{console.log("Failed setting username: "+reason);});
        client.user.setAvatar(config.bot_favicon).catch((reason)=>{console.log("Failed setting Avatar: "+reason);});
        client.user.setPresence({ status: 'online', game: { name: config.bot_desc, type: 'ONLINE' } }).catch((reason)=>{console.log("Failed presence username: "+reason);});
    }catch (e){
        console.log("Failed to set Avatar, Username or Presence.");
    }

    setTimeout(()=>{
        process.exit(0);
    },(60*60*1000));

};

exports.onreact = function(client,GuildsConfig,reaction,member){
    if(!reaction||!member.id){return;}
    let guild=client.guilds.get(reaction.guild);
    let guildMember = guild.members.get(member.id);
    let add = (reaction.action==="ADD");

    // Custom for FakeJake's Discord
    if(reaction.guild==="220563856919887873"&&channels.indexOf(reaction.channel.id)>-1){
        if(reaction.d.name.toLowerCase()==="✅"&&reaction.channel.id==="398564240006447115"){
            if (add)guildMember.addRole(guild.roles.get("556486285540458507"),"Accepted TOS").then(()=>{
            });
            if (!add)guildMember.removeRole(guild.roles.get("556486285540458507"),"Denied TOS").then(()=>{});
            return true;
        }
		if(reacts.indexOf(reaction.d.name.toLowerCase())>-1){
            if(add) guildMember.addRole(guild.roles.find((role)=>{if(role.name===reaction.d.name.toLowerCase()) return role;}));
            if(!add) guildMember.removeRole(guild.roles.find((role)=>{if(role.name===reaction.d.name.toLowerCase()) return role;}));
		}
    }else {
        console.log(`Ignoring external emoji`);
    }
};

exports.guildmemberadd = function(GuildsConfigs,client,member) {
    if(GuildsConfigs.display_welcome===true) {
        var msg_channel = GuildsConfigs.welcome_channel;
        if(msg_channel===""||msg_channel===null){return false;}
        client.channels.get(msg_channel).send(new Discord.RichEmbed()
            .setColor(config.bot_colour)
            .addField("Hey You!",`Welcome ${member.displayName} to ${member.guild.owner.displayName}'s Discord Server!`)
        );
    }
};