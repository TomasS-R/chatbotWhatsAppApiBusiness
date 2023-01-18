const fs = require("fs");
const myConsole = new console.Console(fs.createWriteStream("./logs.txt"));
const whatsappService = require("../services/whatsappService");
const models = require("../shared/models");
const config = require("../config")

const VerifyToken = (req, res) => {

    try {
        var accessToken = config.ACCESSTOKEN;
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
            var number = messages["from"];
            
            var num = models.numero(number);
            var text = GetTextUser(messages);
            
            if (text == "text"){
                var data = models.Text("Hola Internauta!",num);
                whatsappService.SendMessageWhatsApp(data);
            }
            else if (text == "image"){
                var data = models.Image(num);
                whatsappService.SendMessageWhatsApp(data);
            }
            else if (text == "video"){
                var data = models.Video(num);
                whatsappService.SendMessageWhatsApp(data);
            }
            else if (text == "audio"){
                var data = models.Audio(num);
                whatsappService.SendMessageWhatsApp(data);
            }
            else if (text == "button"){
                var data = models.Buttons(num);
                whatsappService.SendMessageWhatsApp(data);
            }
            else if (text == "list"){
                var data = models.List(num);
                whatsappService.SendMessageWhatsApp(data);
            }
            else if (text == "location"){
                var data = models.Location(num);
                whatsappService.SendMessageWhatsApp(data);
            }
            else{
                var data = models.Text("Ups! no entiendí lo que me quisiste decir.",num);
                whatsappService.SendMessageWhatsApp(data);
            }

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