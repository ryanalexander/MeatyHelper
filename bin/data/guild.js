var configs = {
    "220563856919887873":{
        "display_welcome":true,
        "welcome_channel":"220563856919887873",
        "plugins":{
            "default":{
                "enabled":false
            },
            "music":{
                "enabled":true,/*
                "access_requirement":{
                    "type":"role",
                    "args":"DJ"
                },*/
                "required_channel":"303544632825085952"
            },
            "levels":{
                "enabled":false,
                "required_channel":"398234961565581324"
            },
            "moderation":{
                "enabled":true,
                "access_requirement":{
                    "type":"discord",
                    "args":"MANAGE_MESSAGES"
                },
                "required_channel":""
            }
        }
    },
    "429898853580275723":{
        "display_welcome":false,
        "welcome_channel":"",
        "plugins":{
            "default":{
                "enabled":false
            },
            "music":{
                "enabled":false,/*
                "access_requirement":{
                    "type":"role",
                    "args":"DJ"
                },*/
                "required_channel":"303544632825085952"
            },
            "levels":{
                "enabled":false,
                "required_channel":"398234961565581324"
            },
            "moderation":{
                "enabled":false,
                "access_requirement":{
                    "type":"discord",
                    "args":"MANAGE_MESSAGES"
                },
                "required_channel":""
            }
        }
    }
};
var users = {};
module.exports = function(guild_id){
    return configs[guild_id];
};