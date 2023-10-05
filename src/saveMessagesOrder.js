const eventManager = require("./eventManager");
const queueMessage = require("./bullmqQueue/messageQueue");

async function savePushAndView (wa_id,wam_id,type,outgoing,body,status,caption,data,date,changeStatus,bot ) {
    // Save the message in the database with queue
    queueMessage.enqueueSendMessage(wa_id,wam_id,type,outgoing,body,status,caption,data,date,bot);
    // Poll the message to the front end if this is connected
    eventManager.eventEmmitMessage(body, status, wa_id, wam_id, type, date, caption, data, outgoing, changeStatus, bot);
}

module.exports = {
    savePushAndView,
}