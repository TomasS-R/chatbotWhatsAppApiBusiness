require('./workers');
const { Queue } = require('bullmq');
const config = require('../config');
const redisManager = require('./redisManager');
// Do not import the worker file here because the server get Error: connect ECONNREFUSED

// Create a new connection to ioredis
if (redisManager.isConnected()) {
  const redisconnection = config.redisConnection;

  redisconnection.on('error', (err) => {
    console.error('Error with the conection to Redis:', err);
  });

  // Global queue
  const unifiedQueue = new Queue('unifiedQueue', {
    connection: redisconnection,
  });

  async function enqueueWork(type, data) {
    console.log('Enqueuing work of type: ', type, ' with data: ', data);
    try {
      const job = await unifiedQueue.add(type, {data});
      if (!job) {
        console.log('Error enqueuing the job');
      }
    } catch (e) {
      console.log('Error enqueuing job:', e);
      throw e;
    }
  }
  module.exports = {
    enqueueWork,
  };
} else {
  console.error('Redis is not connected. Queue cannot be initialized.');
  /*
  module.exports = {
      enqueueWork: async () => {
          console.error('enqueueWork called without Redis connection.');
      },
  };
  */
}