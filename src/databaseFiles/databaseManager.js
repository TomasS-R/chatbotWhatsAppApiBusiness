const { Pool } = require('pg');
const { createClient } = require('@supabase/supabase-js');

class DatabaseManager {
    constructor() {
        this.pgPool = null;
        this.supabaseClient = null;
    }

    // Postrgres is from messages
    connectToPostgres(shouldConnect = true) {
        if (shouldConnect && !this.pgPool) {
            this.pgPool = new Pool({
                user: process.env.DATABASEUSER,
                password: process.env.DATABASEPASS,
                host: process.env.DATABASEHOST,
                port: process.env.DATABASEPORT,
                database: process.env.DATABASENAME,
                ssl: {
                    rejectUnauthorized: false,
                }
            });
            console.log('Connected to PostgreSQL');
        }
        return this.pgPool;
    }

    // This supabase connection is from storage
    connectToSupabase(shouldConnect = true) {
        if (shouldConnect && !this.supabaseClient) {
            this.supabaseClient = createClient(
                process.env.SUPABASE_URL, 
                process.env.SUPABASE_ANON_KEY
            );
            console.log('Connected to Supabase');
        }
        return this.supabaseClient;
    }

    disconnectFromPostgres() {
        if (this.pgPool) {
            this.pgPool.end();
            this.pgPool = null;
            console.log('Disconnected from PostgreSQL');
        }
    }

    isPostgresConnected() {
        return this.pgPool != null;
    }

    isSupabaseConnected() {
        return this.supabaseClient != null;
    }

    async query(sql, params) {
        const client = await this.pgPool.connect();
        try {
            const res = await client.query(sql, params);
            return res;
        } catch (err) {
            console.error('Error in the query to the data base: ', err);
            throw err;
        } finally {
            client.release();
        }
    }

}

module.exports = new DatabaseManager();