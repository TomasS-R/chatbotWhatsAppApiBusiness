require('ioredis');
const Redis = require('ioredis');

class RedisManager {
    constructor() {
        this.redisConnection = null;
    }

    connect(shouldConnect = true) {
        if (shouldConnect && !this.redisConnection) {
            this.redisConnection = new Redis({
                host: process.env.HOSTREDIS,
                family: 6,
                password: process.env.PASSWORDREDIS,
                maxRetriesPerRequest: null,
                enableReadyCheck: false,
            });
            console.log('Redis connected');
        }
        return this.redisConnection;
    }

    disconnect() {
        if (this.redisConnection) {
            this.redisConnection.disconnect();
            this.redisConnection = null;
            console.log('Redis disconnected');
        }
    }

    isConnected() {
        return this.redisConnection != null;
    }

}

module.exports = new RedisManager();