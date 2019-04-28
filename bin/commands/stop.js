const Discord = require("discord.js");
const fs = require("fs");
const config = JSON.parse(fs.readFileSync('./bin/config.json', 'utf8'));
module.exports = function execute(data,GuildsConfigs,client) {
    const type = ((data.guild!=null)? "guild":"private");
    const guild = ((type==="guild")? data.guild:null);
    const message = data.content;
    const sender = ((data.member!=null)? data.member : data.author);

    GuildsConfigs.plugins.music.queue=[];
    GuildsConfigs.plugins.music.queuepos=0;
    GuildsConfigs.plugins.music.dispatcher.end();
    data.channel.send("Stopped");
};