const {parse} = require("libphonenumber-js");
const databaseAccess = require("../databaseFiles/database");
const whatsappService = require("../services/whatsappService");
const databaseManager = require("../databaseFiles/databaseManager");
// Import languages files for interaction
const whatsappModelES = require("../languages/Español/whatsappModelsES");
const whatsappModelEN = require("../languages/English/whatsappModelsEN");
const dictionaryModuleES = require("../languages/Español/dictionaryES");
const dictionaryModuleEN = require("../languages/English/dictionaryEN");
const processMessageEs = require("../languages/Español/processES");
const processMessageEn = require("../languages/English/processEN");
const whatsappModels = require("../shared/models");


function sendMessagesInOrder(modelsMessages) {
    let currentIndex = 0;
  
    function sendNextMessage() {
        if (currentIndex < modelsMessages.length) {
            setTimeout(() => {
                whatsappService.SendMessageWhatsApp(modelsMessages[currentIndex]);
                currentIndex++;
                sendNextMessage();
            }, 1000);
        }
    }
  
    sendNextMessage();
}

// Change number because in Argentina the number has a bug in the server of Meta and change 9 for 15 and the message never received
function numero(number){
    let parsedNumber = parse("+"+number);
    let country = parsedNumber.country;

    let numeroSin9 = number;
    if (country == "AR") {
        numeroSin9 = number.replace("549", "54");
    }
    else if(country == "MX"){
        numeroSin9 = number.replace("521", "52");
    }
    
    return numeroSin9;
}

async function numSavedVerify(number){
    // Check if the number is saved in the database
    if (databaseManager.isPostgresConnected()) {
        const verify = await databaseAccess.verifyNum(number);
        if (verify == false) {
            // Save number in database for first unique time
            await databaseAccess.saveNum(number);
        }
    }
}

// text,num,userName,messageid, type, outgoing, status, caption, data, date, bot
async function Process(textUser,number,user) {
    let originaltext = textUser;
    textUser = textUser.toLowerCase();

    // Array for save the messages to send
    let modelsMessages = [];

    await numSavedVerify(number);

    // If recived any message the bot catch any message
    if(textUser.match(/^.*$/)){
        // Validate data on database
        let validationLang = await databaseAccess.verifyLanguage(number);
        let validationStart = await databaseAccess.verifyStart(number);

        // Get data from database
        const languageFromDB = await databaseAccess.GetLanguage(number);
        const namefromDB = await databaseAccess.GetName(number);
        const lastnamefromDB = await databaseAccess.GetLastName(number);

        // console.log("Language from DB: " + (languageFromDB || "No language assigned"));

        let validLanguage = ["español", "english"];

        if (!validLanguage.includes(languageFromDB) && validationLang == false) {	
            // Language selection
            let modelLanguage = whatsappModelES.messageButtonLanguage(number);
            modelsMessages.push(modelLanguage);

            databaseAccess.setLanguageQuestionAsked(number);
        }
        // Important: in the database the column language set as Allow Nullable
        if (textUser.includes("español") && (languageFromDB == "" || languageFromDB == null)){
            await databaseAccess.saveLanguage(number, textUser);

            // Response communication in Spanish
            let answer = dictionaryModuleES.españolResponseSpanish(user);
            let model = whatsappModels.Text(answer,number);
            modelsMessages.push(model);

        }
        if (textUser.includes("english") && (languageFromDB == "" || languageFromDB == null)){
            await databaseAccess.saveLanguage(number, textUser);

            // Response communication in Spanish
            let answer = dictionaryModuleEN.englishResponseEnglish(user);
            let model = whatsappModels.Text(answer,number);
            modelsMessages.push(model);

        }
        if (languageFromDB == "español") {	
            // Name of the user saved in database
            if (namefromDB == null){
                await databaseAccess.saveName(number, originaltext);


                const namefromDB = await databaseAccess.GetName(number);
                let answer = dictionaryModuleES.españolResponseNameSpanish(namefromDB);
                let model = whatsappModels.Text(answer,number);
                modelsMessages.push(model);

            }
            // Last name of the user saved in database
            if (namefromDB != null && lastnamefromDB == null){
                await databaseAccess.saveLastName(number, originaltext);

                const lastnamefromDB = await databaseAccess.GetLastName(number);
                let model = whatsappModelES.messageButtonStart(number, namefromDB, lastnamefromDB);
                modelsMessages.push(model);

            }
            if (textUser.includes("comenzar") && validationStart == false) {
                databaseAccess.setStartQuestionAsked(number);
                let modelStart = whatsappModelES.messageStart(number);
                modelsMessages.push(modelStart);
            }	
        }
        if (languageFromDB == "english") {	
            // Name of the user saved in database
            if (namefromDB == null){
                await databaseAccess.saveName(number, originaltext);

                const namefromDB = await databaseAccess.GetName(number);
                let answer = dictionaryModuleEN.englishResponseNameEnglish(namefromDB);
                let model = whatsappModelEN.MessageText(answer,number);
                modelsMessages.push(model);

            }
            // Last name of the user saved in database
            if (namefromDB != null && lastnamefromDB == null){
                await databaseAccess.saveLastName(number, originaltext);

                const lastnamefromDB = await databaseAccess.GetLastName(number);
                let model = whatsappModelEN.messageButtonStart(number, namefromDB, lastnamefromDB);
                modelsMessages.push(model);

            }
            if (textUser.includes("get started") && validationStart == false) {
                databaseAccess.setStartQuestionAsked(number);
                let modelStart = whatsappModelEN.messageStart(number);
                modelsMessages.push(modelStart);
            }
        }

        if (languageFromDB != null && namefromDB != null && lastnamefromDB != null && validationStart == true) {
            // Redirect to the function of the language selected after select the language
            const languageFunctions = {
                español: processMessageEs.languageSpanish,
                english: processMessageEn.languageEnglish
            };
            const languageFunction = languageFunctions[languageFromDB];
            if (languageFunction) {
                await languageFunction(textUser, number, namefromDB /*user*/);
            };
        };
    };
    
    // Send messages in order
    sendMessagesInOrder(modelsMessages);

}

// Function to process the welcome message you need activate this function in https://business.facebook.com/wa/manage/phone-numbers
// Go to Account tools > Automatization > Welcome message (Activate)
async function ProcessWelcomeMessage(number){
    await numSavedVerify(number);
    let modelsMessages = [];

    let validationLang = await databaseAccess.verifyLanguage(number);
    const languageFromDB = await databaseAccess.GetLanguage(number);
    let validLanguage = ["español", "english"];

    if (!validLanguage.includes(languageFromDB) && validationLang == false) {	
        // Language selection
        let modelLanguage = whatsappModelES.messageButtonLanguage(number);
        modelsMessages.push(modelLanguage);

        databaseAccess.setLanguageQuestionAsked(number);
    } else {
        console.log("Language already selected, no welcome message!");
    }
    sendMessagesInOrder(modelsMessages);
}

// Function to process multimedia messages/files/documents/etc...
async function ProcessMediaTypesReceived(type,number){
    let validationStart = await databaseAccess.verifyStart(number);
    // Get data from database
    const languageFromDB = await databaseAccess.GetLanguage(number);
    const namefromDB = await databaseAccess.GetName(number);
    const lastnamefromDB = await databaseAccess.GetLastName(number);

    // Redirect to the function of the language selected after select the language
    if (languageFromDB != null && namefromDB != null && lastnamefromDB != null && validationStart == true) {
        const languageFunctions = {
            español: processMessageEs.responseMediatypeSpanish,
            english: processMessageEn.responseMediatypeEnglish
        };
        const languageFunction = languageFunctions[languageFromDB];
        if (languageFunction) {
            languageFunction(type, number);
        };
    };
}

// Function to process the cart of the user
async function ProcessProductCartLang(number,products){
    let validationStart = await databaseAccess.verifyStart(number);
    const languageFromDB = await databaseAccess.GetLanguage(number);
    const namefromDB = await databaseAccess.GetName(number);
    const lastnamefromDB = await databaseAccess.GetLastName(number);

    // Redirect to the function of the language selected after select the language
    if (languageFromDB != null && namefromDB != null && lastnamefromDB != null && validationStart == true) {
        const languageFunctions = {
            español: processMessageEs.ProcessProductCartSpanish,
            english: processMessageEn.ProcessProductCartEnglish
        };
        const languageFunction = languageFunctions[languageFromDB];
        if (languageFunction) {
            languageFunction(number,products,namefromDB);
        };
    };
}

module.exports = {
    numero,
    Process,
    ProcessWelcomeMessage,
    ProcessMediaTypesReceived,
    ProcessProductCartLang,
}