let { pool } = require('../config');

pool.connect((e, client, release) => {
    if (e) {
      return console.log('Error acquiring client', e.stack)
    }
    console.log('Connected to database');
    release();
});

// Back-end
// Verify if Number is in the database
async function verifyNum(number){

    const client = await pool.connect();
    let value = [number];

    const iSaved = await client.query('SELECT phone_number FROM clients WHERE phone_number = $1',value);
    if (iSaved.rows.length > 0 && iSaved.rows[0].phone_number == number){
        client.release();
        return true;
    } else {
        client.release();
        return false;
    }
}

// Save Number in database for first time
async function saveNum(number){

    const client = await pool.connect();
    let values = [number];
    await client.query('INSERT INTO clients (phone_number) VALUES ($1) RETURNING *',values);
    client.release();
    return;
}

// Verify what language is in the database
async function GetLanguage(number){

    const client = await pool.connect();
    let values = [number];

    let lang = await client.query('SELECT language FROM clients WHERE phone_number = $1',values);
    let result = lang.rows[0].language;
    client.release();

    return result;
    
}

// Verify if language question asked to the user
async function verifyLanguage(number){

    const client = await pool.connect();
    let values = [number];

    // Validations[0] is the question about the language
    let question = await client.query('SELECT validations[0] FROM clients WHERE phone_number = $1',values);
    if (question.rows.length > 0 && (question.rows[0].validations == false || question.rows[0].validations == null || question.rows[0].validations == "")) {
        question = false;
    } else {
        question = true;
    }
    client.release();

    return question;
}

// Set question asked to true when the function is called
async function setLanguageQuestionAsked(number) {
    const client = await pool.connect();
    let values = [number];

    await client.query('UPDATE clients SET validations[0] = true WHERE phone_number = $1', values);
    client.release();
}

// save language in database
async function saveLanguage(number, language) {

    const client = await pool.connect();
    let values = [language,number];

    await client.query('UPDATE clients SET language = $1 WHERE phone_number = $2 RETURNING *',values);

    client.release();
    return;
}

async function saveName(number, textuser) {

    const client = await pool.connect();
    // textuser.charAt(0).toUpperCase() + textuser.slice(1) is to capitalize the first letter of the name
    let values = [textuser,number];

    await client.query('UPDATE clients SET name = $1 WHERE phone_number = $2 RETURNING *',values);

    client.release();
    return;
}

async function GetName(number){

    const client = await pool.connect();
    let values = [number];

    let lang = await client.query('SELECT name FROM clients WHERE phone_number = $1',values);
    let result = lang.rows[0].name;

    client.release();
    return result;
    
}

async function saveLastName(number,textuser) {

    const client = await pool.connect();
    let values = [textuser,number];

    await client.query('UPDATE clients SET last_name = $1 WHERE phone_number = $2 RETURNING *',values);

    client.release();
    return;
}

async function GetLastName(number){

    const client = await pool.connect();
    let values = [number];

    let lang = await client.query('SELECT last_name FROM clients WHERE phone_number = $1',values);
    let result = lang.rows[0].last_name;

    client.release();
    return result;
    
}

async function verifyStart(number){

    const client = await pool.connect();
    let values = [number];

    let question = await client.query('SELECT validations[1] FROM clients WHERE phone_number = $1',values);
    if (question.rows.length > 0 && (question.rows[0].validations == false || question.rows[0].validations == null || question.rows[0].validations == "")) {
        question = false;
    } else {
        question = true;
    }
    client.release();

    return question;
}

// Set question asked to true when the function is called
async function setStartQuestionAsked(number) {
    const client = await pool.connect();
    let values = [number];

    await client.query('UPDATE clients SET validations[1] = true WHERE phone_number = $1', values);
    client.release();
}

module.exports = {
    //Back end Functions
    verifyNum,
    saveNum,
    // Language
    verifyLanguage,
    GetLanguage,
    setLanguageQuestionAsked,
    saveLanguage,
    // Name
    saveName,
    GetName,
    // Last Name
    saveLastName,
    GetLastName,
    verifyStart,
    setStartQuestionAsked,
};

