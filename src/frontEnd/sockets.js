const { Server } = require("socket.io");
const eventManager = require("../eventManager");

function socket (httpServer){
    const io = new Server(httpServer, {
        cors: { origin: '*' },
        allowEIO3: true,
    });
    try {
        io.on('connection', (socket) => {
            console.log('New Connection from', socket.id);

            eventManager.messageEmmiter.on('newMessage', (body, status, wa_id, wam_id, type, created_at, caption, data, outgoing, changeStatus, bot) => {
                socket.emit('Webhook', { type: 'message', message: {
                    body,
                    status,
                    wa_id,
                    wam_id,
                    type,
                    created_at,
                    caption,
                    data,
                    outgoing,
                    changeStatus,
                    bot,
                } });
            });

            socket.on('disconnect', () => {
                console.log(`The ${socket.id} are disconnected`);
            });
        });
    } catch (e){
        console.log(e);
    }
    return io;
}

module.exports = {
    socket
};