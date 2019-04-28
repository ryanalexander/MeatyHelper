var Discord = require("discord.js");
var fs = require("fs");
var config = JSON.parse(fs.readFileSync('./bin/config.json', 'utf8'));
var ytdl = require('ytdl-core');
var YouTube = require('youtube-node');
var youTube = new YouTube();
youTube.setKey(config.apis.youtube);


module.exports = function execute(data,GuildsConfigs,client) {
    var type = ((data.guild!=null)? "guild":"private");
    var guild = ((type==="guild")? data.guild:null);
    var message = data.content;
    var sender = ((data.member!=null)? data.member : data.author);
    var args = message.split(" ");

    if(args.length>1){
        var query="";
        for (i = 1; i < args.length; i++) {query+=args[i]+" ";}
        var youtube = /^(https?\:\/\/)?((www\.)?youtube\.com|youtu\.?be)\/.+$/;
        if(!sender.voiceChannel){            data.channel.send(new Discord.RichEmbed()
            .setColor(config.bot_colour)
            .addField(":musical_note:  DJ", "Seems you aren't in a voice channel!?!?!?")).then(function (embed) {
        });return false;}
        if(youtube.test(query)){
            data.channel.send(new Discord.RichEmbed()
                .setColor(config.bot_colour)
                .addField(":musical_note:  DJ", "Just checking ``" + query + "``")).then(function (embed) {
                    data.reply(query.replace(youtube, ""));
                });
        }else {
            data.channel.send(new Discord.RichEmbed()
                .setColor(config.bot_colour)
                .addField(":musical_note:  DJ", "Now searching for ``" + query + "``")).then(function (embed) {

                youTube.search(query, 2, function (error, result) {
                    if (error || result === undefined || result['items'][0] === undefined) {
                        console.log(error);
                        embed.delete();
                        data.channel.send(new Discord.RichEmbed()
                            .setColor(config.bot_colour_error)
                            .addField(":musical_note:  DJ", "I searched the far lands, but still couldn't find that song :sob:"));
                    } else {
                        if (GuildsConfigs.plugins.music.dispatcher) {
                            if (GuildsConfigs.plugins.music.queue) {
                                if (GuildsConfigs.plugins.music.dispatcher.ended || GuildsConfigs.plugins.music.paused) {

                                } else {
                                    GuildsConfigs.plugins.music.queue.push(result['items'][0]);
                                    embed.delete();
                                    data.channel.send(new Discord.RichEmbed()
                                        .setColor(config.bot_colour)
                                        .addField(":musical_note:  DJ", "I have now enqueued ``" + result['items'][0]['snippet']['title'] + "`` just for you :smile:"));
                                    return false;
                                }
                            } else {
                                GuildsConfigs.plugins.music.queue = [];
                                GuildsConfigs.plugins.music.queuepos = 0;
                            }
                        } else {
                            GuildsConfigs.plugins.music.queue = [];
                            GuildsConfigs.plugins.music.queuepos = 0;
                        }
                        playSong(GuildsConfigs.plugins.music.dispatcher, result['items'][0], sender, data, GuildsConfigs, function () {
                            embed.delete();
                        },client);
                    }
                });
            });
        }
    }else {
        if(GuildsConfigs.plugins.music.dispatcher&&GuildsConfigs.plugins.music.dispatcher.paused!=false){
            GuildsConfigs.plugins.music.dispatcher.resume();
            GuildsConfigs.plugins.music.dispatcher.paused=false;
            data.channel.send(new Discord.RichEmbed()
                .setColor(config.bot_colour)
                .addField(":musical_note:  DJ","Now resumed, enjoy!"));
            return true;
        }
        data.channel.send(new Discord.RichEmbed()
            .setColor(config.bot_colour_error)
            .addField(":musical_note:  DJ","Please specify a song. You can use a link or song title."));
    }
};

function playSong(dispatcher, song, sender, data, GuildsConfigs,callback,client) {
    if(song===undefined){
        data.channel.send(new Discord.RichEmbed()
            .setColor(config.bot_colour_error)
            .addField(":musical_note:  DJ","I searched the far lands, but still couldn't find that song :sob:"));
        return false;
    }
    if(GuildsConfigs.plugins.music.playing){return false;}
    var url = "https://www.youtube.com/watch?v="+song['id']['videoId'];
    var stream = ytdl("" + url + "", {filter: 'audioonly'});
        sender.voiceChannel.join().then(function(connection){
            console.log("Starting Connection");
           play(connection);
        });
    function play(connection){
        console.log("Connected");
        GuildsConfigs.plugins.music.dispatcher = connection.playStream(stream, {bitrate: 200000, volume: 0.5});
        GuildsConfigs.plugins.music.connection = connection;
        if(callback!==undefined){callback();}
        data.channel.send(new Discord.RichEmbed()
            .setColor(config.bot_colour)
            .addField(":musical_note:  DJ","Now playing ``"+song['snippet']['title']+"``"));
        data.channel.setTopic("Now playing : "+song['snippet']['title']);
        client.user.setPresence({ status: 'online', game: { name: song['snippet']['title'], type: 'ONLINE' } });
        GuildsConfigs.plugins.music.playing=true;
        GuildsConfigs.plugins.music.dispatcher.on('end', function() {
            GuildsConfigs.plugins.music.playing=false;
            if(GuildsConfigs.plugins.music.queue.length!==GuildsConfigs.plugins.music.queuepos){
                playSong(dispatcher,GuildsConfigs.plugins.music.queue[GuildsConfigs.plugins.music.queuepos],sender,data,GuildsConfigs,undefined,client);
                GuildsConfigs.plugins.music.queuepos=GuildsConfigs.plugins.music.queuepos+1;
            }else {
                GuildsConfigs.plugins.music.dispatcher=undefined;
                connection.disconnect();
                GuildsConfigs.plugins.music.queue=[];
                GuildsConfigs.plugins.music.queuepos=0;
                data.channel.send("No queue to play from");
            }
        });
    };
}