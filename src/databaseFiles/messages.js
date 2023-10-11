let { pool } = require('../config');

pool.connect((e, client, release) => {
    if (e) {
      return console.log('Error acquiring client', e.stack)
    }
    release();
});

// Front-end

// Get messages of the database to the front-end
async function getMessage() {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM messages m WHERE id in (SELECT MAX(id) FROM messages m2 GROUP BY wa_id) order by m.id desc');
        client.release();
        return result;
    } catch (e) {
        console.log(e);
    }
}

async function getMessagesOfNumber(wa_id) {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM messages m WHERE wa_id = $1 order by created_at', [wa_id]);
        client.release();
        return result;
    } catch (e) {
        console.log(e);
    }
}

// Save logs for messages recived of the user
async function saveMessage(wa_id,wam_id,type,outgoing,body,status,caption,data,timestamptz, bot) {

    const client = await pool.connect();

    try {
        if (data == "") {
            data = null;
        }
        // timestamptz day of the message was created
        // updated_at day of the message was updated, but need to save the first time when this sended to the user
        const updated_at = timestamptz;
        let values = [wa_id,wam_id,type,outgoing,body,status,caption,data,bot,timestamptz,updated_at];

        await client.query('INSERT INTO messages (wa_id,wam_id,type,outgoing,body,status,caption,data,bot,created_at,updated_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)',values);

        //console.log('Message saved successfully in the database.');
    } catch (e) {
        console.error('Error to save the message in the database:', e)
    }
    client.release();
    return;
}

// Query to obtain username of the user
async function GetUsername(number){
    
    const client = await pool.connect();
    let values = [number];

    let lang = await client.query('SELECT wa_name FROM messages WHERE wa_id = $1 ORDER BY id ASC LIMIT 1',values);
    let result = lang.rows[0].wa_name;
    if (result == null || result == "" || result == undefined) {
        result = number;
    }

    client.release();
    return result;
        
}

// Save messages for messages sended to the user and the bot
async function saveMessageSendedUser(wa_id,wam_id,type,outgoing,body,status,caption,data,timestamptz,bot) {

    const client = await pool.connect();

    try {
        if (data == "") {
            data = null;
        }
        // timestamptz day of the message was created
        // updated_at day of the message was updated, but need to save the first time when this sended to the user
        const updated_at = timestamptz;
        let values = [wa_id,wam_id,type,outgoing,body,status,caption,data,bot,timestamptz,updated_at];

        await client.query('INSERT INTO messages (wa_id,wam_id,type,outgoing,body,status,caption,data,bot,created_at,updated_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)',values);

        //console.log('Message saved successfully in the database.');
    } catch (e) {
        console.error('Error to save the message sended to the user in the database:', e)
    }
    client.release();
    return;
}

// Verify if the status message is in the database
async function verifyStatusMessage(statusid) {
    const client = await pool.connect();
    try {
        let values = [statusid];

        var response = await client.query('SELECT status FROM messages WHERE wam_id = $1',values);

        if (response.rows.length > 0) {
            response = response.rows[0].status;
            if (!response) {
                client.release();
                return "sent";
            };
            client.release();
            return response;
        } else {
            client.release();
            return "sent";
        }
    } catch (e) {
        console.error('Error to verify the status of the message', e.message, e.stack)
    }
    client.release();
    return;
}

// Update the status of the message
async function updateStatusMessage(statusid,status,updated_at){
    const client = await pool.connect();
    try {
        let values = [status,updated_at,statusid];

        await client.query('UPDATE messages SET status = $1, updated_at = $2 WHERE wam_id = $3',values);
        
    } catch (e) {
        console.error('Error to update the status of the message', e.message, e.stack)
    }
    client.release();
    return;
}

async function verifyPolicy() {
    const client = await pool.connect();
    try {

        const result = await client.query(`select count(*) from pg_policy where polname = 'Allow bucket creation'`);

        // const resultJSON = JSON.stringify(result, null, 2)
        const rowCount = result.rows[0].count;

        if (rowCount >= 1){
            client.release();
            return true;
        } else {
            client.release();
            return false;
        }
        
    } catch (e) {
        console.error('Error to verify Policy of bucket storage', e.message, e.stack)
    }
    client.release();
}

// Verify if bucket exist
async function verifyBucket(bucketName) {
    const client = await pool.connect();
    try {

        const result = await client.query(`select * from storage.buckets where name = $1`,[bucketName]);

        // const resultJSON = JSON.stringify(result, null, 2);

        // console.log("Verify Bucket: "+resultJSON);

        return result.rowCount > 0;
        
    } catch (e) {
        console.error('Error to verify bucket storage has created', e.message, e.stack)
    }
    client.release();
    return;
}

module.exports = {
    // Front end Functions
    getMessage,
    getMessagesOfNumber,
    // Messages
    saveMessage,
    GetUsername,
    saveMessageSendedUser,
    verifyStatusMessage,
    updateStatusMessage,
    // Bucket storage
    verifyPolicy,
    verifyBucket,
};