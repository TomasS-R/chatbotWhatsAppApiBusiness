const fs = require("fs");
const https = require("https");
const myConsole = new console.Console(fs.createWriteStream("./logsService.txt"));
const config = require("../config")

function SendMessageWhatsApp(data){

    const options = {
        host:"graph.facebook.com",
        //Cambiar ID de telefono para produccion o desarrollo
        path:"/v15.0/"+config.IDPHONE+"/messages",
        method:"POST",
        body:data,
        headers: {
            "Content-Type":"application/json",
            Authorization: "Bearer "+config.TOKEN
        }
    };
    const req = https.request(options, res => {
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