const DatabaseManager = require('./databaseManager');

// In this file we create the table of your data clients to save and interact with them
// You can add more columns if you want or remove
// If you touch this file you need to change the file database.js file too
const tableName = 'clients';

const columns = [
    {name: 'id', type: 'bigserial', primaryKey: true},
    {name: 'name', type: 'text', notNull: true},
    {name: 'last_name', type: 'text', notNull: true},
    {name: 'phone_number', type: 'numeric', notNull: false},
    {name: 'language', type: 'text', notNull: true},
    {name: 'validations', type: 'boolean[]', notNull: false, define: 'ARRAY[false,false]'},
    {name: 'created_at', type: 'timestamptz', notNull: 'now()'},
]

// Function thats create the table and verify if exists
async function createPersonalDataTable() {

    try {
        // Verify if the table exists
        const res = await DatabaseManager.query('select exists (select * from information_schema.tables where table_name = $1)', [tableName]);

        const verifyTable = res.rows[0].exists;
        // If not exists create the table in supabase
        if (!verifyTable) {
            const columnsQuery = columns.map(column => {
                return `${column.name} ${column.type}`;
            }).join(', ');

            const createTableQuery = `CREATE TABLE ${tableName} (${columnsQuery})`;

            try {
                await DatabaseManager.query(createTableQuery);
                console.log("Table created successfully");

                // Enable row level security basic to supabase table
                const enableRLSQuery = `ALTER TABLE ${tableName} ENABLE ROW LEVEL SECURITY`;
                await DatabaseManager.query(enableRLSQuery);
                console.log('Row level security enabled');

                // Add primary key to id
                const addPrimaryKeyQuery = `ALTER TABLE ${tableName} ADD CONSTRAINT ${tableName}_pkey PRIMARY KEY (id)`;
                await DatabaseManager.query(addPrimaryKeyQuery);
                console.log('Primary key added');
            } catch (error) {
                console.log("Error to create the table: ",error);
            }
            
        } else {
            console.log("Table personal data already exists");
        }
    } catch (e) {
        console.log("Error to entablish comunication to supabase:",e);
    }
}

module.exports = {
    createPersonalDataTable,
}
