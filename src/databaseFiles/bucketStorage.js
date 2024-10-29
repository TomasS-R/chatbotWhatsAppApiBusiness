const databaseQuery = require("../databaseFiles/messages")
const databaseManager = require("../databaseFiles/databaseManager")

// In this file we create the bucket storage of chats to save the images/audios/documents/stickers
if (databaseManager.isSupabaseConnected()) {
    async function createBucketStorage(bucketName) {

        try {
            const result = await databaseQuery.verifyBucket(bucketName);

            var response = await databaseQuery.verifyPolicy();

            if (!result || !response){

                if (response) {
                    console.log("Policy are in the storage!");
                }
                if (result) {
                    console.log("Bucket is in the storage!");
                }
                if (!response) {
                    // Create a policy that allows the insertion of new rows and can save files into the bucket
                    const createPolicyQuery = 
                    `create policy "Allow bucket creation" on storage.buckets for insert with check ( true );
                    create policy "Allow object creation" on storage.objects for insert with check (true);`;
                    const queryResponse = await databaseManager.query(createPolicyQuery);

                    if (queryResponse) {
                        console.log('Policy created successfully');
                    } else {
                        console.log('Error creating policy');
                    }
                }
                if (!result) {
                    // Create bucket in the storage
                    const supabaseUrl = process.env.SUPABASE_URL+'/storage/v1';
                    const supabaseKey = process.env.SUPABASE_ANON_KEY;

                    const responseBucket = await fetch(`${supabaseUrl}/bucket`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${supabaseKey}`
                        },
                        body: JSON.stringify({
                            "name": bucketName,
                            "public": true
                        })
                    })
                    const data = await responseBucket.json();

                    if (responseBucket.ok) {
                        console.log('Bucket created successfully:', data);
                    } else {
                        console.log('Error creating bucket:', data);
                    }
                }
                    
            } else {
                console.log("Policy and Bucket storage exists!")
            }

        } catch (e) {
            console.log("Error to create bucket storage in supabase: ",e);
        }
    }
    module.exports = {
        createBucketStorage,
    };
}