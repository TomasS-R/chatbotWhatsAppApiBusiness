const databaseManager = require('./databaseManager');

if (databaseManager.isPostgresConnected()) {
    // Back-end
    // Verify if Number is in the database
    async function verifyNum(number){

        let value = [number];

        const iSaved = await databaseManager.query('SELECT phone_number FROM clients WHERE phone_number = $1',value);
        if (iSaved.rows.length > 0 && iSaved.rows[0].phone_number == number){
            return true;
        } else {
            return false;
        }
    }

    // Save Number in database for first time
    async function saveNum(number){
        const now = new Date().toISOString();

        let values = [number, now];
        await databaseManager.query('INSERT INTO clients (phone_number, created_at) VALUES ($1, $2) RETURNING *',values);
        return;
    }

    // -------------- You can modify the functions below this line --------------

    // Verify what language is in the database
    async function GetLanguage(number){

        let values = [number];

        let lang = await databaseManager.query('SELECT language FROM clients WHERE phone_number = $1',values);
        let result = lang.rows[0].language;

        return result;
        
    }

    // Verify if language question asked to the user
    async function verifyLanguage(number){

        let values = [number];

        // Validations[0] is the question about the language
        let question = await databaseManager.query('SELECT validations[0] FROM clients WHERE phone_number = $1',values);
        if (question.rows.length > 0 && (question.rows[0].validations == false || question.rows[0].validations == null || question.rows[0].validations == "")) {
            question = false;
        } else {
            question = true;
        }

        return question;
    }

    // Set question asked to true when the function is called
    async function setLanguageQuestionAsked(number) {
        let values = [number];

        await databaseManager.query('UPDATE clients SET validations[0] = true WHERE phone_number = $1', values);
    }

    // save language in database
    async function saveLanguage(number, language) {

        let values = [language,number];

        await databaseManager.query('UPDATE clients SET language = $1 WHERE phone_number = $2 RETURNING *',values);

        return;
    }

    async function saveName(number, textuser) {

        // textuser.charAt(0).toUpperCase() + textuser.slice(1) is to capitalize the first letter of the name
        let values = [textuser,number];

        await databaseManager.query('UPDATE clients SET name = $1 WHERE phone_number = $2 RETURNING *',values);

        return;
    }

    async function GetName(number){

        let values = [number];

        let lang = await databaseManager.query('SELECT name FROM clients WHERE phone_number = $1',values);
        let result = lang.rows[0].name;

        return result;
        
    }

    async function saveLastName(number,textuser) {

        let values = [textuser,number];

        await databaseManager.query('UPDATE clients SET last_name = $1 WHERE phone_number = $2 RETURNING *',values);

        return;
    }

    async function GetLastName(number){

        let values = [number];

        let lang = await databaseManager.query('SELECT last_name FROM clients WHERE phone_number = $1',values);
        let result = lang.rows[0].last_name;

        return result;
        
    }

    async function verifyStart(number){

        let values = [number];

        let question = await databaseManager.query('SELECT validations[1] FROM clients WHERE phone_number = $1',values);
        if (question.rows.length > 0 && (question.rows[0].validations == false || question.rows[0].validations == null || question.rows[0].validations == "")) {
            question = false;
        } else {
            question = true;
        }

        return question;
    }

    // Set question asked to true when the function is called
    async function setStartQuestionAsked(number) {
        let values = [number];

        await databaseManager.query('UPDATE clients SET validations[1] = true WHERE phone_number = $1', values);
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
}