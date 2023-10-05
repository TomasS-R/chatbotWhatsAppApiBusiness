const { Pool } = require('pg');
const dotenv = require('dotenv').config({path: './src/.env'});
const Redis = require('ioredis');
const { createClient } = require("@supabase/supabase-js");

const ACCESSTOKEN=process.env.ACCESSTOKEN || `YOUR ACCESSTOKEN OF FACEBOOK HERE FOR JOBS IN LOCAL ENVIRONMENT`;
const TOKEN=process.env.TOKEN || `YOUR TOKEN OF FACEBOOK HERE FOR JOBS IN LOCAL ENVIRONMENT`;
const IDPHONE=process.env.IDPHONE || `YOUR IDPHONE OF FACEBOOK HERE FOR JOBS IN LOCAL ENVIRONMENT`;
const VERSION=process.env.VERSION || `YOUR VERSION OF FACEBOOK HERE FOR JOBS IN LOCAL ENVIRONMENT`;

// Database with pool connection entablished
const PG_POOL_SETTINGS = {
    user: process.env.DATABASEUSER,
    password: process.env.DATABASEPASS,
    host: process.env.DATABASEHOST,
    port: process.env.DATABASEPORT,
    database: process.env.DATABASENAME,
    ssl: {
      rejectUnauthorized: false,
    },
    min: 1,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
};
const pool = new Pool(PG_POOL_SETTINGS);

// Connect storage supabase
const storageSupabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

const redisConnection = new Redis({
  host: process.env.HOSTREDIS,
  family: 6,
  password: process.env.PASSWORDREDIS,
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
})

module.exports = {
    ACCESSTOKEN,
    TOKEN,
    IDPHONE,
    VERSION,
    pool,
    storageSupabase,
    redisConnection,
};