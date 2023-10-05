const { EventEmitter } = require('events');

class MessageEmmiter extends EventEmitter {
    constructor() {
        super();
        this.message = null;
        this.status = null;
        this.wa_id = null;
        this.wam_id = null;
        this.type = null;
        this.created_at = null;
        this.caption = null;
        this.data = null;
        this.outgoing = null;
        this.change = null;
        this.bot = null;
    }

    setMessage(message, status, wa_id, wam_id, type, created_at, caption, data, outgoing, change, bot) {
        this.message = message;
        this.status = status;
        this.wa_id = wa_id;
        this.wam_id = wam_id;
        this.type = type;
        this.created_at = created_at;
        this.caption = caption;
        this.data = data;
        this.outgoing = outgoing;
        this.change = change;
        this.bot = bot;

        this.emit('newMessage', message, status, wa_id, wam_id, type, created_at, caption, data, outgoing, change, bot);
    }

    getMessage() {
        return this.message, this.status, this.wa_id, this.wam_id, this.type, this.created_at, this.caption, this.data, this.outgoing, this.change, this.bot;
    }
}

function eventEmmitMessage(text, status, number, messageid, type, date, caption, data, outgoing, changeStatus, bot){
    messageEmmiter.setMessage(text, status, number, messageid, type, date, caption, data, outgoing, changeStatus, bot);
}

const messageEmmiter = new MessageEmmiter ();

module.exports = {
    eventEmmitMessage,
    messageEmmiter,
};