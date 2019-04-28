module.exports = function execute(data,GuildsConfigs,client){
    const guildata=data.guild;
    if(GuildsConfigs.dispatcher.voiceConnection!=null){
        if(data.member.voiceChannel===GuildsConfigs.dispatcher.voiceConnection.channel) {
            const vc = GuildsConfigs.dispatcher.voiceConnection;
            if(vc)

                vc.disconnect();
            data.channel.send("Disconnected.");
        } else {
            data.channel.send("You must be in the same voice channel as the BOT");
        }
    }else {
        data.channel.send("The bot is not in a Voice Channel");
    }
};