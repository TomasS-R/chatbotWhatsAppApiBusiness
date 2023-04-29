const fs = require("fs");
const myConsole = new console.Console(fs.createWriteStream("./logs.txt"));
const config = require("../config");
const processMessage = require("../shared/processMessage");


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

            // I check if the number is correct, if not remove the 9. (Problem in Argentina phone)
            var num = processMessage.numero(number);

            //Receives the user's message
            var text = GetTextUser(messages);

            // Obtain the user name
            var userName = value.contacts[0].profile.name;

            // Ortain the message id to mark as read
            var messageid = messages["id"];

            const messageTypes = {
                image: "image",
                audio: "audio",
                video: "video",
                document: "document",
                sticker: "sticker",
                location: "location",
                contacts: "contact"
            };

            const messageTypeKeys = Object.keys(messageTypes);
            // Obtain the type of message received
            const messageTypeReceived = messageTypeKeys.find(key => messages.hasOwnProperty(key));
            
            if (text != ""){
                processMessage.Process(text,num,userName,messageid);
            }
            else if (messageTypeReceived) {
                processMessage.ProcessMediaTypesReceived(messageTypes[messageTypeReceived], num);
            }
            else if (text == "") {
                // Orders cart
                var order = messages["order"];
                var product_items = order["product_items"];
                // Obtain product
                if (Array.isArray(product_items) && product_items.length > 0 && order) {
                    try {
                        //const products = processProductItems(product_items, num);
                        processMessage.ProcessProductCartLang(num, product_items);
                    } catch (e) {
                        console.log(e);
                    }
                    
                }
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
            console.log("No message");
        }
    }else{
        console.log("No message");
    }
    return text;
}

module.exports = {
    VerifyToken,
    //proccessProducts,
    ReceivedMessage,
}