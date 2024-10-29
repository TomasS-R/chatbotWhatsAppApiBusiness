const eventManager = require("./eventManager");
const messagesDB = require('./databaseFiles/messages');
const redisManager = require('./bullmqQueue/redisManager');
const queueMessage = require("./bullmqQueue/messageQueue");
const databaseManager = require('./databaseFiles/databaseManager');

async function savePushAndView (wa_id,wam_id,type,outgoing,body,status,caption,data,date,changeStatus,bot ) {

    if (redisManager.isConnected() && databaseManager.isPostgresConnected()) {
        // Save the message in the database with queue
        queueMessage.enqueueWork('DBMessageSend',{wa_id,wam_id,type,outgoing,body,status,caption,data,date,bot});

    } else if (!redisManager.isConnected() && databaseManager.isPostgresConnected()) {
        // Save the message in the database without queue
        await messagesDB.saveMessageSendedUser(wa_id, wam_id, type, outgoing, body, status, caption, data, date, bot);
        
    }
    // Poll the message to the front end if this is connected
    eventManager.eventEmmitMessage(body, status, wa_id, wam_id, type, date, caption, data, outgoing, changeStatus, bot);
}

module.exports = {
    savePushAndView,
}