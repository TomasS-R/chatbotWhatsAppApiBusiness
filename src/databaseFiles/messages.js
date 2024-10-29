const databaseManager = require('./databaseManager');

if (databaseManager.isPostgresConnected()) {
    async function verifyPolicy() {
        try {

            const result = await databaseManager.query(`select count(*) from pg_policy where polname = 'Allow bucket creation'`);

            // const resultJSON = JSON.stringify(result, null, 2)
            const rowCount = result.rows[0].count;

            if (rowCount >= 1){
                return true;
            } else {
                return false;
            }
            
        } catch (e) {
            console.error('Error to verify Policy of bucket storage', e.message, e.stack)
        }
    }

    // Verify if bucket exist
    async function verifyBucket(bucketName) {
        try {

            const result = await databaseManager.query(`select * from storage.buckets where name = $1`,[bucketName]);

            // const resultJSON = JSON.stringify(result, null, 2);

            // console.log("Verify Bucket: "+resultJSON);

            return result.rowCount > 0;
            
        } catch (e) {
            console.error('Error to verify bucket storage has created', e.message, e.stack)
        }
        return;
    }

    // Front-end

    // Get messages of the database to the front-end
    async function getMessage() {
        try {
            const result = await databaseManager.query('SELECT * FROM messages m WHERE id in (SELECT MAX(id) FROM messages m2 GROUP BY wa_id) order by m.id desc');
            return result;
        } catch (e) {
            console.log(e);
        }
    }

    async function getMessagesOfNumber(wa_id) {
        try {
            const result = await databaseManager.query('SELECT * FROM messages m WHERE wa_id = $1 order by created_at', [wa_id]);
            return result;
        } catch (e) {
            console.log(e);
        }
    }

    // Save logs for messages recived of the user
    async function saveMessage(wa_id,wam_id,type,outgoing,body,status,caption,data,timestamptz, bot) {

        try {
            if (data == "") {
                data = null;
            }
            // timestamptz day of the message was created
            // updated_at day of the message was updated, but need to save the first time when this sended to the user
            const updated_at = timestamptz;
            let values = [wa_id,wam_id,type,outgoing,body,status,caption,data,bot,timestamptz,updated_at];

            await databaseManager.query('INSERT INTO messages (wa_id,wam_id,type,outgoing,body,status,caption,data,bot,created_at,updated_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)',values);

            //console.log('Message saved successfully in the database.');
        } catch (e) {
            console.error('Error to save the message in the database:', e)
        }
        return;
    }

    // Query to obtain username of the user
    async function GetUsername(number){
        
        let values = [number];

        let lang = await databaseManager.query('SELECT wa_name FROM messages WHERE wa_id = $1 ORDER BY id ASC LIMIT 1',values);
        let result = lang.rows[0].wa_name;
        if (result == null || result == "" || result == undefined) {
            result = number;
        }

        return result;
            
    }

    // Save messages for messages sended to the user and the bot
    async function saveMessageSendedUser(wa_id,wam_id,type,outgoing,body,status,caption,data,timestamptz,bot) {

        try {
            if (data == "") {
                data = null;
            }
            // timestamptz day of the message was created
            // updated_at day of the message was updated, but need to save the first time when this sended to the user
            const updated_at = timestamptz;
            let values = [wa_id,wam_id,type,outgoing,body,status,caption,data,bot,timestamptz,updated_at];

            await databaseManager.query('INSERT INTO messages (wa_id,wam_id,type,outgoing,body,status,caption,data,bot,created_at,updated_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)',values);

            //console.log('Message saved successfully in the database.');
        } catch (e) {
            console.error('Error to save the message sended to the user in the database:', e)
        }
        return;
    }

    // Verify if the status message is in the database
    async function verifyStatusMessage(statusid) {
        try {
            let values = [statusid];

            var response = await databaseManager.query('SELECT status FROM messages WHERE wam_id = $1',values);

            if (response.rows.length > 0) {
                response = response.rows[0].status;
                if (!response) {
                    return "sent";
                };
                return response;
            } else {
                return "sent";
            }
        } catch (e) {
            console.error('Error to verify the status of the message', e.message, e.stack)
        }
        return;
    }

    // Update the status of the message
    async function updateStatusMessage(statusid,status,updated_at){
        try {
            let values = [status,updated_at,statusid];

            await databaseManager.query('UPDATE messages SET status = $1, updated_at = $2 WHERE wam_id = $3',values);
            
        } catch (e) {
            console.error('Error to update the status of the message', e.message, e.stack)
        }
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
        verifyPolicy,
        verifyBucket,
    };
}