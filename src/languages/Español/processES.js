const whatsappModel = require("../Español/whatsappModelsES");
const dictionaryModule = require("../Español/dictionaryES");
const databaseAccess = require("../../databaseFiles/database");
const senderMessagesBot = require("../../chatbotManage/senderMessagesBot");

// Spanish
async function languageSpanish(textUser,number,user) {
    textUser = textUser.toLowerCase();

    // Array for save the messages to send
    let modelsMessages = [];

    const namefromDB = await databaseAccess.GetName(number);
    //const lastnamefromDB = await databaseAccess.GetLastName(number);

    
    if (textUser.includes("menú")||textUser.includes("menu")){
        //MENU
        let model = whatsappModel.MessageListMenu(number);
        modelsMessages.push(model);
        
    }
    else if (textUser.includes("hey")||
    textUser.includes("ola")||
    textUser.includes("hola")||
    textUser.includes("holu")||
    textUser.includes("holi")||
    textUser.includes("holis")||
    textUser.includes("buenas")||
    textUser.includes("que tal")||
    textUser.includes("como estas")||
    textUser.includes("buenos dias")||
    textUser.includes("buenas tardes")||
    textUser.includes("buenas noches")){
        //SALUDAR
        let answer = dictionaryModule.welcomeResponseSpanish(namefromDB);
        let model = whatsappModel.MessageText(answer,number);
        modelsMessages.push(model);

        let modelMenuButton = whatsappModel.messageButtonMenu(number);
        modelsMessages.push(modelMenuButton);
        
    }
    else if (textUser.match(/\bproductos\b/)){
        // PRODUCTOS
        let model = whatsappModel.messageListProductos(number);
        //modelsMessages.push(model);
        /*let product1 = whatsappModel.messageListProducto1(number);
        let product2 = whatsappModel.messageListProducto2(number);
        let product3 = whatsappModel.messageListProducto3(number);*/
        let modelMenuButton = whatsappModel.messageButtonMenu(number);
        modelsMessages.push(/*product1,product2,product3*/model,modelMenuButton);
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
    else if (textUser.match(/\bubicacion\b/)){
        // UBICACION
        let model = whatsappModel.sendLocation(number);
        let modelMenuButton = whatsappModel.messageButtonMenu(number);
        modelsMessages.push(model,modelMenuButton);
        
    }
    else if (textUser.match(/\broadmap\b/)){
        // ROADMAP
        let answer = dictionaryModule.roadmapResponseSpanish();
        let model = whatsappModel.MessageText(answer,number);
        let modelMenuButton = whatsappModel.messageButtonMenu(number);
        modelsMessages.push(model,modelMenuButton);
        
    }
    else if (textUser.match(/\basesoramiento\b/)){
        // ASESORAMIENTO
        let answer = dictionaryModule.responseAsesoramentSpanish();
        let model = whatsappModel.MessageText(answer,number);
        let modelContact = whatsappModel.sendContact(number);

        let answerContact = dictionaryModule.giveContactLink();
        // let modelContact = whatsappModel.MessageText(answerContact,number);
        let modelMenuButton = whatsappModel.messageButtonMenu(number);
        modelsMessages.push(model,modelContact,modelMenuButton);
        
    }
    else if (textUser.includes("bot para mi negocio")){
        // BOT PARA NEGOCIOS
        let answer = dictionaryModule.responseBotForBusinessSpanish();
        let model = whatsappModel.MessageText(answer,number);
        let modelMenuButton = whatsappModel.messageButtonMenu(number);
        modelsMessages.push(model,modelMenuButton);
        
    }
    else if (textUser.match(/^\p{Emoji}+$/u)){
        let answer = dictionaryModule.getRandomEmoji();
        let model = whatsappModel.MessageText(answer,number);
        modelsMessages.push(model);
    }
    else if (textUser.match("test")){
        let modelMenuButton = whatsappModel.test(number);
        modelsMessages.push(modelMenuButton);
    }
    else if (textUser.match("imagen")){
        let modelMenuButton = whatsappModel.test2(number);
        modelsMessages.push(modelMenuButton);
    }
    else if (textUser.match("video")){
        let modelMenuButton = whatsappModel.test3(number);
        modelsMessages.push(modelMenuButton);
    }
    else {
        // NO ENTIENDE
        let answer = dictionaryModule.notResponseResultSpanish();
        let model = whatsappModel.MessageText(answer,number);
        let modelGoToMenu = whatsappModel.messageButtonGoToMenu(number);
        modelsMessages.push(model,modelGoToMenu);
    }

    // Enviar mensajes en orden
    senderMessagesBot.sendMessagesInOrder(modelsMessages);
}

function responseMediatypeSpanish(type, number){
    let modelsMessages = [];

    if (type == "image") {
        let answer = dictionaryModule.imageReceivedResponseSpanish();
        let model = whatsappModel.MessageText(answer,number);
        modelsMessages.push(model);
    } else if (type == "video") {
        let answer = dictionaryModule.videoReceivedResponseSpanish();
        let model = whatsappModel.MessageText(answer,number);
        modelsMessages.push(model);
    } else if (type == "audio") {
        let answer = dictionaryModule.audioReceivedResponseSpanish();
        let model = whatsappModel.MessageText(answer,number);
        modelsMessages.push(model);
    } else if (type == "document") {
        let answer = dictionaryModule.documentReceivedResponseSpanish();
        let model = whatsappModel.MessageText(answer,number);
        modelsMessages.push(model);
    } else if (type == "sticker") {
        let answer = dictionaryModule.stickerReceivedResponseSpanish();
        let model = whatsappModel.MessageText(answer,number);
        modelsMessages.push(model);
    } else if (type === "location") {
        let answer = dictionaryModule.locationReceivedResponseSpanish();
        let model = whatsappModel.MessageText(answer,number);
        modelsMessages.push(model);
    } else if (type == "contacts") {
        let answer = dictionaryModule.contactReceivedResponseSpanish();
        let model = whatsappModel.MessageText(answer,number);
        modelsMessages.push(model);
    }
    // Enviar mensajes en orden
    senderMessagesBot.sendMessagesInOrder(modelsMessages);
}

async function ProcessProductCartSpanish(number,products){
    let modelsMessages = [];

    const namefromDB = await databaseAccess.GetName(number);

    let answer = dictionaryModule.productCartRecivedSpanish(number,products,namefromDB)
    let model = whatsappModel.MessageText(answer,number);
    let modelGoToMenu = whatsappModel.messageButtonGoToMenu(number);
    modelsMessages.push(model,modelGoToMenu);

    senderMessagesBot.sendMessagesInOrder(modelsMessages);

}

// Export functions
module.exports = {
    languageSpanish,
    responseMediatypeSpanish,
    ProcessProductCartSpanish,
}