const whatsappModel = require("../English/whatsappModelsEN");
const dictionaryModule = require("../English/dictionaryEN");
const whatsappService = require("../../services/whatsappService");
const databaseAccess = require("../../databaseFiles/database");

/*
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
}*/

async function sendMessagesInOrder(modelsMessages) {
    for (const message of modelsMessages) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        whatsappService.SendMessageWhatsApp(message);
    }
}

// English
async function languageEnglish(textUser,number,user) {
    textUser = textUser.toLowerCase();

    // Array for save the messages to send
    let modelsMessages = [];

    const namefromDB = await databaseAccess.GetName(number);
    //const lastnamefromDB = await databaseAccess.GetLastName(number);

    
    if (textUser.includes("menu")){
        //MENU
        let model = whatsappModel.MessageListMenu(number);
        modelsMessages.push(model);
        
    }
    else if (textUser.includes("hi")||
    textUser.includes("hello")||
    textUser.includes("How are you")||
    textUser.includes("good morning")||
    textUser.includes("good afternoon")||
    textUser.includes("good evening")||
    textUser.includes("good night")){
        //SALUDAR
        let answer = dictionaryModule.welcomeResponseEnglish(namefromDB);
        let model = whatsappModel.MessageText(answer,number);
        let modelMenuButton = whatsappModel.messageButtonMenu(number);
        modelsMessages.push(model,modelMenuButton);
        
    }
    else if (textUser.match(/\bproducts\b/)){
        // PRODUCTOS
        //let model = whatsappModel.messageListProductos(number);
        //modelsMessages.push(model);
        let product1 = whatsappModel.messageListProducto1(number);
        let product2 = whatsappModel.messageListProducto2(number);
        let product3 = whatsappModel.messageListProducto3(number);
        let modelMenuButton = whatsappModel.messageButtonMenu(number);
        modelsMessages.push(product1,product2,product3,modelMenuButton);
    }
    else if (textUser.match(/\baudio\b/)){
        // AUDIO
        let model = whatsappModel.sendAudio(number);
        let modelMenuButton = whatsappModel.messageButtonMenu(number);
        modelsMessages.push(model,modelMenuButton);
        
    }
    else if (textUser.match(/\bsticker\b/)){
        // STICKER
        let model = whatsappModel.sendSticker(number);
        let modelMenuButton = whatsappModel.messageButtonMenu(number);
        modelsMessages.push(model,modelMenuButton);
        
    }
    else if (textUser.match(/\bubication\b/)){
        // UBICACION
        let model = whatsappModel.sendLocation(number);
        let modelMenuButton = whatsappModel.messageButtonMenu(number);
        modelsMessages.push(model,modelMenuButton);
        
    }
    else if (textUser.match(/\broadmap\b/)){
        // ROADMAP
        let answer = dictionaryModule.roadmapResponseEnglish();
        let model = whatsappModel.MessageText(answer,number);
        let modelMenuButton = whatsappModel.messageButtonMenu(number);
        modelsMessages.push(model,modelMenuButton);
        
    }
    else if (textUser.match(/\bconsultancy\b/)||textUser.match(/\badvice\b/)){
        // CONSULTANCY
        let answer = dictionaryModule.responseAsesoramentEnglish();
        let modeltext = whatsappModel.MessageText(answer,number);
        let answerContact = dictionaryModule.giveContactLink();
        let modelContact = whatsappModel.MessageText(answerContact,number);
        let modelMenuButton = whatsappModel.messageButtonMenu(number);
        modelsMessages.push(modeltext,modelContact,modelMenuButton);
        
    }
    else if (textUser.includes("bot for my business")){
        // BOT PARA NEGOCIOS
        let answer = dictionaryModule.responseBotForBusinessEnglish();
        let model = whatsappModel.MessageText(answer,number);
        let modelMenuButton = whatsappModel.messageButtonMenu(number);
        modelsMessages.push(model,modelMenuButton);
        
    }/*
    else if (textUser.includes("/database")){
        // Response with info of database
        const info = await dictionaryModule.databaseInfo();

        console.log(info);

        let modelusers = whatsappModel.MessageText(info,number);
        modelsMessages.push(modelusers);
    }*/
    else if (textUser.match(/^\p{Emoji}+$/u)){
        let answer = dictionaryModule.getRandomEmoji();
        let model = whatsappModel.MessageText(answer,number);
        modelsMessages.push(model);
    }
    /*else if (textUser.includes("cambiar nombre")){
        let answer = dictionaryModule.getRandomEmoji();
        let model = whatsappModel.MessageText(answer,number);
        modelsMessages.push(model);
    }*/
    else {
        // NO ENTIENDE
        let answer = dictionaryModule.notResponseResultEnglish();
        let model = whatsappModel.MessageText(answer,number);
        let modelMenuButton = whatsappModel.messageButtonMenu(number);
        modelsMessages.push(model,modelMenuButton);
    }

    // Enviar mensajes en orden
    await sendMessagesInOrder(modelsMessages);
}

async function responseMediatypeEnglish(type, number){
    let modelsMessages = [];

    if (type == "image") {
        let answer = dictionaryModule.imageReceivedResponseEnglish();
        let model = whatsappModel.MessageText(answer,number);
        modelsMessages.push(model);
    } else if (type == "video") {
        let answer = dictionaryModule.videoReceivedResponseEnglish();
        let model = whatsappModel.MessageText(answer,number);
        modelsMessages.push(model);
    } else if (type == "audio") {
        let answer = dictionaryModule.audioReceivedResponseEnglish();
        let model = whatsappModel.MessageText(answer,number);
        modelsMessages.push(model);
    } else if (type == "document") {
        let answer = dictionaryModule.documentReceivedResponseEnglish();
        let model = whatsappModel.MessageText(answer,number);
        modelsMessages.push(model);
    } else if (type == "sticker") {
        let answer = dictionaryModule.stickerReceivedResponseEnglish();
        let model = whatsappModel.MessageText(answer,number);
        modelsMessages.push(model);
    } else if (type === "location") {
        let answer = dictionaryModule.locationReceivedResponseEnglish();
        let model = whatsappModel.MessageText(answer,number);
        modelsMessages.push(model);
    } else if (type == "contact") {
        let answer = dictionaryModule.contactReceivedResponseEnglish();
        let model = whatsappModel.MessageText(answer,number);
        modelsMessages.push(model);
    }
    // Enviar mensajes en orden
    await sendMessagesInOrder(modelsMessages);
}

async function ProcessProductCartEnglish(number,products){

    let modelsMessages = [];

    const namefromDB = await databaseAccess.GetName(number);

    let answer = dictionaryModule.productCartRecivedEnglish(number,products,namefromDB)
    let model = whatsappModel.MessageText(answer,number);
    let modelMenu = whatsappModel.MessageListMenu(number);
    modelsMessages.push(model,modelMenu);

    await sendMessagesInOrder(modelsMessages);

}

// Export functions
module.exports = {
    languageEnglish,
    responseMediatypeEnglish,
    ProcessProductCartEnglish,
}