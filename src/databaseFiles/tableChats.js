const databaseManager = require('./databaseManager');

// In this file we create the table of chats to save the history of the chats work with messages file
const tableName = 'messages';

const columns = [
    {name: 'id', type: 'bigserial', primaryKey: true},
    {name: 'wa_id', type: 'text', notNull: true}, // Id number
    {name: 'wam_id', type: 'text', notNull: true}, // Message id
    {name: 'type', type: 'text', notNull: true}, // The type of the message (15)
    {name: 'outgoing', type: 'boolean', notNull: true}, // Entry = false / Exit = true
    {name: 'body', type: 'text', notNull: true}, // Message
    {name: 'status', type: 'text',notNull: true}, // Sent / Received / Read / failed (15)
    {name: 'caption', type: 'text', null: true}, // Caption the type is longtext, but supabase support text thats is similar
    {name: 'data', type: 'bytea', notNull: true}, // Data of message (image, audio, video, document, sticker, location, contacts) type is binary or bytea its equals
    {name: 'bot', type: 'boolean'}, // If the message is from the bot or not
    {name: 'created_at', type: 'timestamptz', notNull: true}, // Timestamp
    {name: 'updated_at', type: 'timestamptz', notNull: true}, // Timestamp
]

// Function thats create the table and verify if exists
async function createTable() {

    try {
        // Verify if the table exists
        const res = await databaseManager.query('select exists (select * from information_schema.tables where table_name = $1)', [tableName]);

        const verifyTable = res.rows[0].exists;
        // If not exists create the table in supabase
        if (!verifyTable) {
            const columnsQuery = columns.map(column => {
                return `${column.name} ${column.type}`;
            }).join(', ');

            const createTableQuery = `CREATE TABLE ${tableName} (${columnsQuery})`;

            try {
                await databaseManager.query(createTableQuery);
                console.log("Table created successfully");

                // Enable row level security basic to supabase table
                const enableRLSQuery = `ALTER TABLE ${tableName} ENABLE ROW LEVEL SECURITY`;
                await databaseManager.query(enableRLSQuery);
                console.log('Row level security enabled');

            } catch (error) {
                console.log("Error to create the table: ",error);
            }
        
        } else {
            console.log("Table message already exists");
        }
    } catch (e) {
        console.log("Error to entablish comunication to supabase:",e);
    }
}

module.exports = {
    createTable,
}