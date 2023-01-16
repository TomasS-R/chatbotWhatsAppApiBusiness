const fs = require("fs");
const https = require("https");
const myConsole = new console.Console(fs.createWriteStream("./logsService.txt"));
const {parse} = require('libphonenumber-js');

function SendMessageWhatsApp(textResponse, number){
    //parsear el numero y sacar el codigo de area (+54)
    let parsedNumber = parse("+"+number);
    let country= parsedNumber.country;
    myConsole.log("Código de país:", country );
    let numeroSin9 = number;
    if (country == "AR"){
        numeroSin9 = number.replace("9", "", 1);
    }
    const data = JSON.stringify({
        "messaging_product": "whatsapp",    
        "recipient_type": "individual",
        "to": numeroSin9,
        "type": "text",
        "text": {
            "preview_url": false,
            "body": textResponse
        }
    });

    const options = {
        host:"graph.facebook.com",
        //Cambiar ID de telefono para produccion o desarrollo
        path:"/v15.0/110624388589441/messages",
        method:"POST",
        body:data,
        headers: {
            "Content-Type":"application/json",
            Authorization:"Bearer EAAWNbICfuWEBAK5ObPbDborZC7VVjzDdaPYr4lcndFMGHhnEuWUJS9jDsSCbLMlAz5IwlxvnktZCWPRH9z2HynoEU1DWGVmwscndlhvUflj3rAGvjAFIWvZA9PZCKzyA0BYqd7Pwhd9uZBwCLlkDXj2rRmTIP0yAv0zQqGszJZCZAyW3hewYJbiVEvaEpFnNTxXPTV7SCZAQLwZDZD"
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