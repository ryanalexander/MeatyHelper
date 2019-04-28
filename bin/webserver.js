var net = require('net');
var fs = require("fs");
var logger = console;
var colors = {
    "red":"\u001b[31m",
    "reset":"\u001b[0m",
    "green":"\u001b[32m",
    "yellow":"\u001b[33m",
    "blue":"\u001b[34m",
    "magenta":"\u001b[35m",
    "cyan":"\u001b[36m",
    "white":"\u001b[37m"
};

var sockets = [];
var port = 2340;

exports.start = function(logger) {
    var server = net.createServer(function(socket) {
        socket.on('data', function(data) {
            let headers = headerparse(data);

            if(headers['url']===undefined||headers['url']===null){return;}

            let dir = headers['url'];
            //headers['url'] = ((headers['url'].indexOf("?")<=-1)?headers['url']:headers['url'].split("?")[0]);
            var args={};
            try {
                if (!(dir.split("?").length <= 1)) {
                    for (i = 0; i < dir.split("?")[1].split("&").length; i++) {
                        var arg = dir.split("?")[1].split("&")[i];
                        arg = arg.split("=");
                        args[arg[0]] = arg[1];
                    }
                }
            }catch(e){console.error(e.toString());}

            dir = headers['url'].split('?')[0].toLowerCase().split("/");

            socket.write("HTTP/1.1 200 Success\r\n"+
                "Server: sws\r\n"+
                "X-Frame-Options: none\r\n"+
                "Content-Encoding: none\r\n" +
                "Content-Type: application/json\r\n");
            // /{APPLICATION_INSTANCE}/{QUERY}
            console.log(dir);
            switch(dir[3]){
                case "dashboard":
                    // /dashboard/{QUERY}
                    switch(dir[4]){
                    }
                    break;
                case "data":
                    // /data/{QUERY}
                    switch(dir[2]){

                    }
                    break;
                case "0auth":
                    socket.write(`Set-Cookie: Authentication=${args['code']}; Expires=${Date.now()+60000};\r\n`);
                    socket.write(`Location: /?auth=true\r\n`);
                    socket.write("\r\n\r\n");
                    socket.end(function(){
                        socket.destroy();
                    });
                    break;
                default:
                    socket.write("\r\n"+JSON.stringify({'error':"Invalid endpoint requested",code:500}));
                    break;
            }


            socket.write("test\r\n\r\n");
            socket.end(function(){
                socket.destroy();
            });

        });

        socket.on('end', function() {
            removeSocket(socket);
        });
        socket.on('error', function(error) {
            console.log("["+colors.red+"ERROR"+colors.reset+"] " + error.message);
        });
    });
    function removeSocket(socket) {
        sockets.splice(sockets.indexOf(socket), 1);
    }
    server.on('error', function(error) {
        console.log("["+colors.red+"ERROR"+colors.reset+"] " + error.message);
    });
    server.listen(port, function() {
        console.log("["+colors.green+"STARTED"+colors.reset+"] " + "HTTP Handler has started on port "+port+" and is accepting connections.\r\n");
    });
};

sendReply = (socket,data) => {

};

headerparse = (headers) =>{
    headers=(headers+"\r\n").split("\r\n");

    found_get=false;
    req = {};
    for(i=0;headers.length>i;i++){
        if(headers[i].toString().split(" ")[0]==="GET"){req['url']=headers[i].toString().split(" ")[1];}

        var header = headers[i].toString().split(":")[0];
        var value = headers[i].toString().split(":")[1];
        if(value===undefined){continue;}else{header=header.toLowerCase().replace(" ","");value=value.toLowerCase().replace(' ','');}
        req[header.toLowerCase()]=value.toLowerCase();
    }

    return req;
};