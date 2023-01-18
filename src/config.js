const dotenv = require('dotenv').config({path: './src/.env'});

const ACCESSTOKEN=process.env.ACCESSTOKEN;
const TOKEN=process.env.TOKEN;
const IDPHONE=process.env.IDPHONE;


module.exports = {
    ACCESSTOKEN,
    TOKEN,
    IDPHONE
};