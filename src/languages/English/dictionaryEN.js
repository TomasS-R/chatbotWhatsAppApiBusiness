const database = require("../../databaseFiles/database");
const whatsappcontroller = require("../../controllers/whatsappControllers");

// English
function englishResponseEnglish(name){
    const responseLanguage = "✅ Excellent "+name+"! from now on I will communicate with you in English 🇬🇧.\n\nBefore we start talking I would like to know more about you so I can provide you with exceptional service 😎.\n\nLet's start with What is your name? or What would you like me to call you?\n\n_*Just enter the name*_";
    return responseLanguage;
}

function englishResponseNameEnglish(name){
    const responseName = "✅ Great! "+name+" is an ideal name, and from what I can see it fits you 😉.\n\nNow tell me "+name+"\n\nWhat's your last name? 🤔";
    return responseName;
}

function welcomeResponseEnglish(name){
    const responseWelcomeUser = ["Hi "+name+"! 🙋🏻‍♂️, what a pleasure to see you here.\n\nI see you need me 😲, how can I help you?.",
    "Hey "+name+"👋🏻\n\nwhat a pleasure to have you around!\n\n🤔 What can I do for you?.",
    "Nice to see you again "+name+" 😃\n\nHow can I help you? 😎.",
    "I already feel the good energy when they start a conversation like this! 🤓.\n\nHow can I help you today "+name+"? 🤖.",];
    const randomIndexWelcome = Math.floor(Math.random() * responseWelcomeUser.length);
    const randomResponse = responseWelcomeUser[randomIndexWelcome];
    return randomResponse;
}

function notResponseResultEnglish(){
    const responseNotFound = ["Oops I didn't understand what you meant.🤔",
    "What were you saying? I was having a coffee...\n\ndelicious! ☕",
    "Oops, I dropped a screw 🔧, what were you saying?.",
    "Oh my gosh! I got electrocuted ⚡🤖.\n\nDon't worry, I'm fine now.\n\nWhat were you saying?",
    "I didn't understand what you meant.\n\nCould you be more specific?",
    "I see that you surpass me in intelligence.\n\nI did not understand what you told me."];
    const randomIndex = Math.floor(Math.random() * responseNotFound.length);
    const randomResponse = responseNotFound[randomIndex];
    return randomResponse;
}

function proccessProducts (product_retailer_id,quantity,item_price,currency,total_price,number){
    return {
        product_retailer_id: product_retailer_id,
        quantity: quantity,
        item_price: item_price,
        currency: currency,
        total_price: total_price,
        number: number
        }
}

function processProductItems(product_items, num){
    const products = [];

    product_items.forEach(function(item) {
        // Variables of the products details
        const product_retailer_id = item["product_retailer_id"];
        const quantity = item["quantity"];
        const item_price = item["item_price"];
        const currency = item["currency"];
        const total_price = quantity * item_price;

        const productData = proccessProducts(product_retailer_id,quantity,item_price,currency,total_price,num);
        products.push(productData);
    });

    // Return the array of processed products
    return products;
}

function productCartRecivedEnglish(number,products,name){
    //const responseCartReceived = "Gracias por tu compra, el pedido se esta procesando. Te contactaremos a la brevedad. ";
    try {
        const proccessProducts = processProductItems(products, number);
        const product = proccessProducts[0];
        const product_retailer_id = product.product_retailer_id;
        const quantity = product.quantity;
        const item_price = product.item_price;
        const currency = product.currency;
        const total_price = product.total_price;
        if (product != null){
            const responseCartReceived = "\n\nThis is a proof of how your purchase would be processed for your business:\n\nThanks for your purchase "+name+"! 🤩"+
                                        "\n\n🎁 Product: "+product_retailer_id+
                                        "\n\n🛒 Quantity: "+quantity+
                                        "\n\n💰 Price: "+item_price+
                                        "\n\n💵 Currency: "+currency+
                                        "\n\n📝 Total: $ "+total_price+""+currency+"\n\nThe order is being processed.\n\nWe will contact you as soon as possible.";
            return responseCartReceived;
        }
        else{
            const responseCartReceived = "There was an error processing your order, please try again in a few minutes.";
            return responseCartReceived;
        }
        
    } catch (error) {
        console.log(error);
        const responseCartReceived = "There was an error processing your order, please try again in a few minutes.";
        return responseCartReceived;
    }
}

async function databaseInfo(){
    try {
        const users = await database.getUsers();
        
        let databaseInfo = ("Here is the database information: \n\n");

        users.forEach(user => {
            let nameP = user.name;
            let phone = user.phone;
            console.log(nameP, phone);
            databaseInfo += "Name: " + nameP + " - Phone: " + phone + "\n";
        });
        return databaseInfo;
    } catch (e) {
        console.log(e);
    }
    
}

function roadmapResponseEnglish(){
    const roadmapResponse = "Sure, I leave the link so you can see it: https://bit.ly/BotRex";
    return roadmapResponse;
}

function responseAsesoramentEnglish(){
    const roadmapResponse = "I will be happy to provide you with the contact of a consultant who can help you with your problem. 😁";
    return roadmapResponse;
}

function responseBotForBusinessEnglish(){
    const roadmapResponse = "We are working on this option so that 🎉_*soon*_🎉 you can have a personalized bot in your business. 🏪";
    return roadmapResponse;
}

function getRandomEmoji() {
    const emojis = ['😀', '😍', '🤖', '🐶', '🌞', '🎉', '🎈', '🎁', '🚀', '🍕'];
    const randomIndex = Math.floor(Math.random() * emojis.length);
    const randomEmojiResponse = emojis[randomIndex];
    return randomEmojiResponse;
}

function giveContactLink(){
    const contactLink = "https://wa.me/+541156903459?text=I'm%20interested%20in%20your%20services";
    return contactLink;
}

// Send response to recived message media
function imageReceivedResponseEnglish(){
    const Response = "I received your image, but for the moment I can't process it because I don't have Artificial Intelligence yet.";
    return Response;
}

function audioReceivedResponseEnglish(){
    const Response = "I received your audio, but I can't process it at the moment because I don't have Artificial Intelligence yet.";
    return Response;
}

function videoReceivedResponseEnglish(){
    const Response = "I received your video, but I can't process it at the moment because I don't have Artificial Intelligence yet.";
    return Response;
}

function documentReceivedResponseEnglish(){
    const Response = "I received your document! At the moment I am limited, but in a short time I will be able to process it.";
    return Response;
}

function stickerReceivedResponseEnglish(){
    const Response = "I received your sticker and I must say I love it! 😱😍";
    return Response;
}

function locationReceivedResponseEnglish(){
    const Response = "I received the localization you sent me, I can't process it yet, but I'm working on it to improve my intelligence.";
    return Response;
}

function contactReceivedResponseEnglish(){
    const Response = "I detected the contact you sent me, but I can't process it at the moment because I don't have those capabilities yet.";
    return Response;
}

module.exports = {
    // Response of data of the user
    englishResponseEnglish,
    englishResponseNameEnglish,

    // Comienzo de charla
    welcomeResponseEnglish,
    notResponseResultEnglish,
    productCartRecivedEnglish,
    databaseInfo,
    roadmapResponseEnglish,
    responseAsesoramentEnglish,
    responseBotForBusinessEnglish,
    getRandomEmoji,
    giveContactLink,

    // Multimedia analisis recividos
    audioReceivedResponseEnglish,
    imageReceivedResponseEnglish,
    videoReceivedResponseEnglish,
    documentReceivedResponseEnglish,
    stickerReceivedResponseEnglish,
    locationReceivedResponseEnglish,
    contactReceivedResponseEnglish

}