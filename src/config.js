require('dotenv').config({path: './src/.env'});
const redisManager = require('./bullmqQueue/redisManager');
const databaseManager = require('./databaseFiles/databaseManager');

const ACCESSTOKEN=process.env.ACCESSTOKEN || `YOUR ACCESSTOKEN OF FACEBOOK HERE FOR JOBS IN LOCAL ENVIRONMENT`;
const TOKEN=process.env.TOKEN || `YOUR TOKEN OF FACEBOOK HERE FOR JOBS IN LOCAL ENVIRONMENT`;
const IDPHONE=process.env.IDPHONE || `YOUR IDPHONE OF FACEBOOK HERE FOR JOBS IN LOCAL ENVIRONMENT`;
const VERSION=process.env.VERSION || `YOUR VERSION OF FACEBOOK HERE FOR JOBS IN LOCAL ENVIRONMENT`;

// Connect postgres
const postgresConnection = databaseManager.connectToPostgres(true);

// Connect storage supabase
const storageSupabase = databaseManager.connectToSupabase(true);

// Connect redis
const redisConnection = redisManager.connect(false);

module.exports = {
    ACCESSTOKEN,
    TOKEN,
    IDPHONE,
    VERSION,
    postgresConnection,
    storageSupabase,
    redisConnection,
};