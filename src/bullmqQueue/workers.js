const messagesDB = require('../databaseFiles/messages');
const whatsappService = require('../services/whatsappService');
const { Worker } = require('bullmq');
const config = require('../config');
const redisManager = require('./redisManager');
const databaseManager = require('../databaseFiles/databaseManager');

// Connection with queue
if (redisManager.isConnected()) {
  const redisconnection = config.redisConnection;

  redisconnection.on('error', (err) => {
    console.error('Error with the conection to Redis in the workerDB:', err);
  });

  // Global worker
  const worker = new Worker('unifiedQueue', async (job) => {
    switch (job.name) {
      case 'DBMessageSend':
        try {
          const { wa_idresponse, messageId, type, outgoing, body, status, caption, data, date, bot } = job.data;

          console.log('wa_idresponse: ', wa_idresponse, 'messageId: ', messageId, 'type: ', type, 'outgoing: ', outgoing, 'body: ', body, 'status: ', status, 'caption: ', caption, 'data: ', data, 'date: ', date, 'bot: ', bot);

          // Save the message in the database
          if (databaseManager.isConnected()) {
            await messagesDB.saveMessageSendedUser(wa_idresponse, messageId, type, outgoing, body, status, caption, data, date, bot);
          }

          //console.log('Job done succesfull! ', job.id);
        } catch (e) {
          console.log('Error in the worker: ', e);
          throw e;
        }
        break;
      case 'DBMessageStatus':
        try {
          const { statusid,status,updated_at } = job.data;

          console.log('statusid: ', statusid, 'status: ', status, 'updated_at: ', updated_at);

          // Save the status of the message in the database
          if (databaseManager.isConnected()) {
            const response = await messagesDB.updateStatusMessage(statusid,status,updated_at);
          }

        } catch (e) {
          console.log('Error in the worker: ', e);
          throw e;
        }
        break;
      case 'sendMessageBot':
        try {
            const { message } = job.data;

            console.log('message: ', message);
            
            if (databaseManager.isConnected()) {
              const result = await whatsappService.SendMessageWhatsApp(message);
            }
            
            if (result == 'error') {
              console.log('Error in the workerSendMessageChatBot: ', result, 'Message: ', message);
              throw result;
            }
            else
            {
              console.log('Message sended!');
            }
      
            return result;
        
          //console.log('Job done succesfull! ', job.id);
        } catch (e) {
          console.log('Error in the worker: ', e);
          throw e;
        }
    }
  },
  {
      connection: redisconnection,
  });

  worker.on('failed', (job, err) => console.log(`Job failed send message chatbot worker: ${job.id} ${job.name}, error: ${err}`));

  module.exports = {
    worker,
  }
} else {
  console.error('Redis is not connected. Worker cannot be initialized.');

  module.exports = {
      worker: {
          on: () => console.error('Worker dummy called without Redis connection.')
      },
  };
}