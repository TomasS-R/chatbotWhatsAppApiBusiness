const config = require("../config");
const eventManager = require("../eventManager");
const messagesDB = require("../databaseFiles/messages");
const processMessage = require("../shared/processMessage");
const redisManager = require('../bullmqQueue/redisManager');
const messagesSave = require("../databaseFiles/tableChats");
const queueMessage = require("../bullmqQueue/messageQueue");
const waFront = require("../libraries/whatsappFrontResponse");
const messageUserFiles = require("../frontEnd/messageTypeRecived");
const receivedChatBotMessage = require("../chatbotManage/recivedChatBotMessage");
const databaseManager = require("../databaseFiles/databaseManager");
const personalTable = require("../databaseFiles/personalTable");

// Front end api
async function show(wa_id,req, res) {
    if (databaseManager.isPostgresConnected()) {
        try {
            // The wa_id pass in the file routes.js
            //console.log("Number show: " + wa_id);
            const allMessages = await messagesDB.getMessagesOfNumber(wa_id); // Extract most recent messages from user to database
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
    }
};

// Obtain a especific message
async function getMessage (req, res) {
    try {
        const messages = await messagesDB.getMessage(); // Extract most recent messages from users to database
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

let sharedBodyMessageSend = null;

async function sendMessageUser (body, wa_id, res) {
    try {
        // const username = await messagesDB.GetUsername(wa_id);
        const sendMessage = await waFront.sendTextFront(body,wa_id);
        const response = JSON.parse(sendMessage);

        sharedBodyMessageSend = body;

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

        var updated_at = datenoformat.toISOString();
        var bot = false;

        const result = JSON.stringify({
            "body": body,
            "caption": caption,
            "created_at": date,
            "data": data,
            "outgoing": outgoing,
            "status": status,
            "type": type,
            "updated_at": updated_at,
            "wa_id": wa_idresponse,
            "wam_id": messageId,
        });
        const resultjson = JSON.parse(result);
        // save the message in supabase with queue
        if (redisManager.isConnected() && databaseManager.isPostgresConnected()) {
            queueMessage.enqueueWork('DBMessageSend',{wa_idresponse,messageId,type,outgoing,body,status,caption,data,date,bot});
        }
        else if (!redisManager.isConnected() && databaseManager.isPostgresConnected()) {
            await messagesDB.saveMessageSendedUser(wa_idresponse, messageId, type, outgoing, body, status, caption, data, date, bot);
        }

        res.status(200).json({
            success: true,
            data: resultjson,
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

async function extractMessageData(req) {
    try {
        var entry = (req.body["entry"])[0];
        var changes = (entry["changes"])[0];
        var value = changes["value"];
        var messageObject = value["messages"];
        var messages = messageObject?.[0];
        var statuses = value?.["statuses"];

        var username = value?.contacts?.[0]?.profile?.name;
        var messagesId = messages?.["id"];
        var caption = '';
        var data = '';
        var outgoing = 'false' // Entry = false / Exit = true

        var messages = messageObject?.[0];
        var wa_id = messages?.["from"];
        var type = messages?.["type"];
        var timestamp = messages?.["timestamp"];

        var bot = false;
        
        if (Array.isArray(statuses) && statuses.length > 0) {
            var statusvalue = statuses?.[0];

            var status = statusvalue?.status; // sent, delivered, read, failed, deleted
            var status_id = statusvalue?.id; // id of the status message
            var date = statusvalue?.timestamp; // catch the moment of the message change status
            var recipient = statusvalue?.recipient_id; // wa_id

            var updated_at = new Date(date * 1000);
            var statusactual = await messagesDB.verifyStatusMessage(status_id);
            
            if (statusactual != status && (status == "read" || status == "delivered" || status == "failed"))
            {
                if (redisManager.isConnected() && databaseManager.isPostgresConnected()) {

                    queueMessage.enqueueWork('DBMessageStatus',{status_id,status,updated_at});

                } else if (!redisManager.isConnected && databaseManager.isPostgresConnected()) {

                    await messagesDB.updateStatusMessage(status_id,status,updated_at);

                }

                const changeStatus = true;
                eventManager.eventEmmitMessage(sharedBodyMessageSend, status, recipient, status_id, type, updated_at, caption, data, outgoing, changeStatus, bot);
                
            }
            else if (status == "sent"){
                const changeStatus = false;
                eventManager.eventEmmitMessage(sharedBodyMessageSend, status, recipient, status_id, type, updated_at, caption, data, outgoing, changeStatus, bot);
            }
            
        }
    } catch (e) {
        console.log(e);
    }

    const messageData = {
        userName: username, // Obtain the user name
        caption: caption,
        data: data,
        outgoing: outgoing ? outgoing == null : 'false',
        datamessage: messageObject,
        number: wa_id,
        type: type,
        timestamp : timestamp, // This is the same for created_at
        messageid: messagesId, // This is the same for wam_id
        messages: messages, // This is the same for body or text
        // Status control
        status: statuses ? statuses == null : 'sent',
        bot: bot,
    };
  
    return messageData;
}

async function ReceivedMessage (req, res) {
    try {

        const messageData = await extractMessageData(req);

        const {
            userName,
            caption,
            data,
            outgoing,
            datamessage,
            number,
            type,
            timestamp,
            messageid,
            messages,
            // Status control to check status in front end
            status,
            bot,
        } = messageData;

        if(typeof datamessage != "undefined"){
            try {
                // Data of the messages
                var date = new Date(timestamp * 1000);

                // I check if the number is correct, if not remove the 9. (Problem in Argentina phone)
                var num = processMessage.numero(number);

                var text = GetTextUser(messages); //Receives the user's message
                const changeStatus = false;
                eventManager.eventEmmitMessage(text, status, number, messageid, type, date, caption, data, outgoing, changeStatus, bot); // Emmit message to the front-end

                if (databaseManager.isPostgresConnected()){
                    await messagesSave.createTable();
                }

                // Save the messages and info in supabase
                if (type != "unsupported" && (type == "text" || type == "interactive" || type == "order")) {
                    if (type == "order") {
                        // Process the order message to the front end
                        console.log("Data message: ", datamessage);
                        await messageUserFiles.customerMakeOrder(datamessage);
                    } else {
                        if (databaseManager.isPostgresConnected()) {
                            await messagesDB.saveMessage(number, messageid, type, outgoing, text, status, caption, data, date, bot);
                        }
                    }
                }

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
                var messageTypeReceived = messageTypeKeys.find(key => messages.hasOwnProperty(key));

                if (!messageTypeReceived) {
                    messageTypeReceived = null;
                } else {
                    // Save the multimedia messages from user in supabase to send and show in front end
                    if (databaseManager.isPostgresConnected()) {
                        messageUserFiles.saveMediaFileReceived(messageTypeReceived,messages);
                    }
                }

                // Chatbot response
                receivedChatBotMessage.manageMessagesReceived(userName, type, messages, text, num, messageTypeReceived);
            } catch (e) {
                console.log(e);
            }

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
            console.log("No message text/interactive");
        }
    }else{
        console.log("No message, Type: ", typeMessage);
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
    extractMessageData,
    ReceivedMessage,
}