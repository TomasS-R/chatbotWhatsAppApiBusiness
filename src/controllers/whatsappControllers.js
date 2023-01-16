const fs = require("fs");
const myConsole = new console.Console(fs.createWriteStream("./logs.txt"));
const whatsappService = require("../services/whatsappService")

const VerifyToken = (req, res) => {

    try {
        var accessToken = "456E7GRG46RH898H6H56T6H6HF6BF";
        var token = req.query["hub.verify_token"];
        var challenge = req.query["hub.challenge"];

        if(challenge != null && token != null && token == accessToken){
            res.send(challenge);
        }
        else{
            res.status(400).send();
        }
    } catch(e) {
        res.status(400).send();
    }
}

const ReceivedMessage = (req, res) => {
    try {
        var entry = (req.body["entry"])[0];
        var changes = (entry["changes"])[0];
        var value = changes["value"];
        var messageObject = value["messages"];

        if(typeof messageObject != "undefined"){
            var messages = messageObject[0];
            var text = GetTextUser(messages);
            var number = messages["from"];

            myConsole.log("Mensaje: " + text + " De: " + number);
            whatsappService.SendMessageWhatsApp("el usuario dijo: " + text, number);
            
            myConsole.log(messages);
            myConsole.log(messageObject);
        }

        res.send("EVENT_RECEIVED");
    }catch(e) {
        myConsole.log(e);
        res.send("EVENT_RECEIVED");
    }
}

function GetTextUser(messages){
    var text = "";
    var typeMessage = messages["type"];
    if(typeMessage == "text"){
        text = (messages["text"])["body"];
    }
    else if(typeMessage == "interactive"){
        var interactiveObject = messages["interactive"];
        var typeInteractive = interactiveObject["type"];

        if(typeInteractive == "button_reply"){
            text = (interactiveObject["button_reply"])["title"];
        }
        else if(typeInteractive == "list_reply"){
            text = (interactiveObject["list_reply"])["title"];
        }else{
            myConsole.log("sin mensaje");
        }
    }else{
        myConsole.log("sin mensaje");
    }
    return text;
}

module.exports = {
    VerifyToken,
    ReceivedMessage
}