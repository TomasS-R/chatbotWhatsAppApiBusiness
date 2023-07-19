const config = require("../config");
const processMessage = require("../shared/processMessage");
const database = require("../databaseFiles/database");
const messagesSave = require("../databaseFiles/tableChats");
const waFront = require("../libraries/whatsappFrontResponse");

// Front end api

async function show (wa_id,req, res) {
    try {
        // The wa_id pass in the file routes.js
        console.log("Number show: " + wa_id);
        const allMessages = await database.getMessagesOfNumber(wa_id); // Extract most recent messages from user to database
        //const result = allMessages.rows;
        res.status(200).json({
            success: true,
            data: allMessages,
        });
    } catch (e) {
        res.status(500).json({
            success: false,
            error: error.allMessages,
        });
        console.log(e);
    }
};

// Obtain a especific message
async function getMessage (req, res) {
    try {
        const messages = await database.getMessage(); // Extract most recent messages from users to database
        //const jsonResult = JSON.stringify(messages);
        res.status(200).json({
            success: true,
            data: messages,
        });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
};
/*
// Actualizate a especific message
const updateMessage = (req, res) => {
    // Lógica para actualizar un mensaje específico
    res.send('Actualizando un mensaje específico');
};
  
// Eliminate a specific message
const deleteMessage = (req, res) => {
    // Lógica para eliminar un mensaje específico
    res.send('Eliminando un mensaje específico');
};
*/
async function sendMessageUser (body, wa_id, res) {
    try {
        const sendMessage = await waFront.sendTextFront(body,wa_id);
        const response = JSON.parse(sendMessage);

        var wa_idresponse = response['contacts'][0]['wa_id'];
        var messageId = response['messages'][0]['id'];
        var type = 'text';
        var outgoing = "true";
        var status = "sent";
        var caption = '';
        var data = '';
        // Date formating
        var timestamp = new Date().getTime();
        var datenoformat = new Date(timestamp);
        var date = datenoformat.toISOString();

        // save the message in supabase
        await database.saveMessageSendedUser(wa_idresponse, messageId, type, outgoing, body, status, caption, data, date);
        
        res.status(200).json({
            success: true,
            data: response,
        });
        //return sendMessage;
    } catch (e) {
        res.status(500).json({
            success: false,
            error: "Error to send the message "+e,
        });
        console.log(e);
    }
};

// Back end
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

async function ReceivedMessage (req, res) {
    try {
        var entry = (req.body["entry"])[0];
        var changes = (entry["changes"])[0];
        var value = changes["value"];
        var messageObject = value["messages"];
        var statuses = value["statuses"];

        if (Array.isArray(messageObject) && messageObject.length > 0) {
            var messages = messageObject[0];
            var number = messages["from"]; // This is the same for wa_id
            var type = messages["type"];
            var timestamp = messages["timestamp"];
            //console.log(messages);
        }

        if (Array.isArray(statuses) && statuses.length > 0) {
            var statusvalue = statuses[0];
            var status = statusvalue.status; // sent, delivered, read, failed
            var statusid = statusvalue.id;
            var statusactual = await database.verifyStatusMessage(statusid);
            if (statusactual != status)
            {
                await database.updateStatusMessage(statusid,status);
            }
        }

        if(typeof messageObject != "undefined"){
            // Data of the messages
            var date = new Date(timestamp * 1000);
            var status = "sent";
            var caption = '';
            var data = '';
            var outgoing = "false"; // Entry = false / Exit = true

            // I check if the number is correct, if not remove the 9. (Problem in Argentina phone)
            var num = processMessage.numero(number);

            //Receives the user's message
            var text = GetTextUser(messages);

            // Obtain the user name
            var userName = value.contacts[0].profile.name;

            // Obtain the message id to mark as read
            var messageid = messages["id"];

            // Create table in supabase
            await messagesSave.createTable();
            // Save the messages and info in supabase
            /*
            console.log("Saving message in supabase: "+
                        "\t Id de chat: "+ number +
                        "\t Id de mensaje: "+messageid+
                        "\t Tipo: "+ type +
                        "\t outgoing: "+ outgoing +
                        "\t body: "+ text +
                        "\t status: "+ status +
                        "\t caption: "+ caption +
                        "\t data: "+ data +
                        "\t Fecha: "+ date)
            */
            await database.saveMessage(number, messageid, type, outgoing, text, status, caption, data, date);
            /*
            if (Array.isArray(statuses) && statuses.length > 0) {
                var statusvalue = statuses[0];
                var status = statusvalue.status; // sent, delivered, read, failed
                var statusid = statusvalue.id;
                await database.verifyStatusMessage(statusid);
                //console.log(statusid);
                
                /*
                if (status == "read") {
                }
                if (status == "delivered") {
                }
                if (status == "sent") {
                }
                */
                //console.log(status);
            //}
            
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
            //await waFront.makeRequest("texto",541156903459);
        }

        res.send("EVENT_RECEIVED");
    }catch(e) {
        console.log(e);
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
    // Front end
    show,
    getMessage,
    //updateMessage,
    //deleteMessage,
    sendMessageUser,

    // Back end
    VerifyToken,
    //proccessProducts,
    ReceivedMessage,
    
}