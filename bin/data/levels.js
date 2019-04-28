var mysql = require('mysql2');
var noexp = [];

exports.getlevel = function(GuildMember,callback){
    var level = {id:0,discord_id:GuildMember.id,exp:0,level:0};
    var data = mysql.createConnection({
        host:'localhost',
        user:'root',
        password:'Garcia#02',
        database:'stelch',
        port:3306
    });
        var found = false;
        data.query("SELECT * FROM `ranks` ORDER BY `exp` DESC", function (err, result) {
            if(err){return false;}
            var user = result.find(function(v){
                return v['discord_id']===GuildMember.id;
            });

            if(user===undefined){
                console.log("Called insert");
                data.query("INSERT INTO `ranks` (discord_id) VALUES ("+GuildMember.id+")");
                level = {id:0,discord_id:GuildMember.id,exp:0,level:0,total:0,position:0};
            }else {
                console.log("Called select");
                if (err) throw err;
                count=0;
                found = true;
                level = (result.find(function(v){
                    count++;
                    v['position']=count;
                    v['total']=result.length;
                    return v['discord_id']===GuildMember.id;
                }));
                if (level === undefined) {
                    level = {id: 0, discord_id: GuildMember.id, exp: 0, level: 0};
                }
            }
            data.close();
            callback(level);
            return level;
        });
        callback(level);
        return level;
}

exports.onmessage = function(GuildMemeber, client){
    if(GuildMemeber==client.user){return false;}
    this.getlevel(GuildMemeber, function(response){
        if(response.id==0){return false;}
        if(noexp.indexOf(GuildMemeber.id) !== -1){console.log("Ignoring message by: "+GuildMemeber);return false;}
        var exp = response.exp+25;
        var level = Math.round(response.exp/((response.level+175))*2)+1;
        var data = mysql.createConnection({
            host:'localhost',
            user:'root',
            password:'Garcia#02',
            database:'stelch',
            port:3306
        });
        if(((response.level+175))*2 >= response.exp){
        }
        data.query("UPDATE `ranks` SET `exp`='"+exp+"' WHERE `id`='"+response.id+"';",function (err){
            if (err) throw err;
            console.log("Set "+GuildMemeber.id+" xp to be "+exp);
            noexp.push(GuildMemeber.id);
            setTimeout(function(){
                var search_term=GuildMemeber.id;
                for (var i=noexp.length-1; i>=0; i--) {
                    if (noexp[i] === search_term) {
                        noexp.splice(i, 1);
                        // break;       //<-- Uncomment  if only the first term has to be removed
                    }
                }
                console.log(GuildMemeber.id+" can now earn XP again");
            },60000);
            data.close();
        });

    })
}