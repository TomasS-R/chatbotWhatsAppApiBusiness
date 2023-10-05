const messagesDB = require('../databaseFiles/messages');
const whatsappService = require('../services/whatsappService');
const { Worker } = require('bullmq');
const config = require('../config');

// Connection with queue
const redisconnection = config.redisConnection;

redisconnection.on('error', (err) => {
  console.error('Error with the conection to Redis in the workerDB:', err);
});

redisconnection.set('foo', 'bar')
  .then(() => {
    console.log('WorkerDB ON');
  })
  .catch((err) => {
    console.error('Error in the WorkerDB:', err);
  });

// Worker to save the message in the DB
const workerMSDB = new Worker('queueDBMessageSend', async (job) => {
  try {
    if (job.name == 'DBMessageSend') {
        const { wa_idresponse, messageId, type, outgoing, body, status, caption, data, date, bot } = job.data;

        // Save the message in the database
        await messagesDB.saveMessageSendedUser(wa_idresponse, messageId, type, outgoing, body, status, caption, data, date, bot);
    }

    //console.log('Job done succesfull! ', job.id);
  } catch (e) {
    console.log('Error in the worker: ', e);
    throw e;
  }
},{
    connection: redisconnection,
});


// Worker to save the status of the message
const workerMStatus = new Worker('queueDBMessageStatus', async (job) => {
    try {
      if (job.name == 'DBMessageStatus') {
          const { statusid,status,updated_at } = job.data;
          //console.log('Status: ', statusid,status,updated_at);
  
          // Save the status of the message in the database
          const response = await messagesDB.updateStatusMessage(statusid,status,updated_at);
          //console.log('Response: ', response);
      }
    
      //console.log('Job done succesfull! ', job.id);
    } catch (e) {
      console.log('Error in the worker: ', e);
      throw e;
    }
  },{
      connection: redisconnection,
});

// Worker to send message of the chatbot to the user
const workerSendMessageChatBot = new Worker('queueSendMessageChatBot', async (job) => {
  try {
    if (job.name == 'sendMessageBot') {
      
      const { message } = job.data;

      const result = await whatsappService.SendMessageWhatsApp(message);

      return result;

    }
  
    //console.log('Job done succesfull! ', job.id);
  } catch (e) {
    console.log('Error in the worker: ', e);
    throw e;
  }
},{
    connection: redisconnection,
});

// workerMSDB.on('completed', job => console.log(`Job completed: ${job.id}`));
workerMSDB.on('failed', (job, err) => console.log(`Job failed: ${job.id}, error: ${err}`));

// workerMStatus.on('completed', job => console.log(`Job completed: ${job.id}`));
workerMStatus.on('failed', (job, err) => console.log(`Job failed : ${job.id}, error: ${err}`));

// workerSendMessageChatBot.on('completed', job => console.log(`Job completed: ${job.id}`));
workerSendMessageChatBot.on('failed', (job, err) => console.log(`Job failed send message chatbot worker: ${job.id}, error: ${err}`));


module.exports = {
  workerSendMessageChatBot,
}