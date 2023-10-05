const { Queue } = require('bullmq');
const config = require('../config');
const { workerSendMessageChatBot } = require('./workers');
require('./workers');
// Do not import the worker file here because the server get Error: connect ECONNREFUSED

// Create a new connection to ioredis
const redisconnection = config.redisConnection;

redisconnection.on('error', (err) => {
  console.error('Error with the conection to Redis:', err);
});

redisconnection.set('foo', 'bar')
  .then(() => {
    console.log('Connection and operations with Redis successful!');
  })
  .catch((err) => {
    console.error('Error in the operatión with Redis:', err);
  });

// Create a new instance with ioredis client
const webhookQueue = new Queue('queueDBMessageSend', {
  connection: redisconnection,
});

async function enqueueSendMessage(wa_idresponse, messageId, type, outgoing, body, status, caption, data, date, bot) {
  try {
    // console.log('Enqueuing a new job');
    const queue = await webhookQueue.add('DBMessageSend', {wa_idresponse,messageId,type,outgoing,body,status,caption,data,date,bot});

    if (!queue) {
      console.log('Error enqueuing the job');
    }
  } catch (e) {
    console.log('Error enqueuing sendMessage:', e);
    throw e;
  }
}


const queueStatusMessage = new Queue('queueDBMessageStatus', {
  connection: redisconnection,
});

async function enqueueSaveStatus(statusid,status,updated_at) {
  try {
    // console.log('Enqueuing a new job status');
    const queue = await queueStatusMessage.add('DBMessageStatus', {statusid,status,updated_at});

    if (!queue) {
      console.log('Error enqueuing the job status');
    }
  } catch (e) {
    console.log('Error enqueuing saveStatus:', e);
    throw e;
  }
}


// Queue to send the message of the chatbot to the frontend
const queueSendMessageBot = new Queue('queueSendMessageChatBot', {
  connection: redisconnection,
});

async function enqueueSendMessageBot(message) {
  try {
    // console.log('Enqueuing a new job sendMessageBot');
    const queue = await queueSendMessageBot.add('sendMessageBot', {message});

    if (!queue) {
      console.log('Error enqueuing the job status');
    }

    return new Promise((resolve) => {
      workerSendMessageChatBot.on('completed', (job, result) => {
        resolve(result);
      });

      workerSendMessageChatBot.on('failed', (job, err) => {
        console.log(`Job failed: ${job.id}, error: ${err}`);
        resolve(null);
      });
    });
  } catch (e) {
    console.log('Error enqueuing saveStatus:', e);
    throw e;
  }
}


module.exports = {
  enqueueSendMessage,
  enqueueSaveStatus,
  enqueueSendMessageBot,
};