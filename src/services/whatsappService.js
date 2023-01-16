const fs = require("fs");
const https = require("https");
const myConsole = new console.Console(fs.createWriteStream("./logsService.txt"));

function SendMessageWhatsApp(data){

    const options = {
        host:"graph.facebook.com",
        //Cambiar ID de telefono para produccion o desarrollo
        path:"/v15.0/{ID de telefono}/messages",
        method:"POST",
        body:data,
        headers: {
            "Content-Type":"application/json",
            Authorization:"Bearer {TOKEN PERMANENTE O TEMPORAL}"
        }
    };
    const req = https.request(options, res => {
        myConsole.log("https status code", res.statusCode);
        myConsole.log("---------------------------------------------");
        myConsole.log("headers",res.headers);
        myConsole.log("---------------------------------------------");
        myConsole.log("data:",data);
        myConsole.log("---------------------------------------------");
        myConsole.log("options:",options);
        myConsole.log("---------------------------------------------");
        res.on("data", d=> {
            process.stdout.write(d);
        });
    });

    req.on("error", error => {
        console.error(error);
    });

    req.write(data);
    req.end();
}

module.exports = {
    SendMessageWhatsApp
};