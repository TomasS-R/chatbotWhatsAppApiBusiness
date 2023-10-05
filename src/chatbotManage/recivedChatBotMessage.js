const processMessage = require("../shared/processMessage");

async function manageMessagesReceived(userName, type, messages, text, num, messageTypeReceived){
    try{
        // Chatbot interaction here
        if (text != ""){
            processMessage.Process(text,num,userName);
        }
        else if (messageTypeReceived) {
            processMessage.ProcessMediaTypesReceived(messageTypeReceived, num);
        }
        else if (text == "" && type != "unsupported") {
            // Orders cart
            var order = messages["order"];
            var product_items = order["product_items"];
            // Obtain product
            if (Array.isArray(product_items) && product_items.length > 0 && order) {
                try {
                    //const products = processProductItems(product_items, num);
                    processMessage.ProcessProductCartLang(num, product_items);
                } catch (e) {
                    console.log(e);
                }
                
            }
        }
        else if (text == "" && type == "unsupported") {
            console.log("No message supported");
        }
    }
    catch(e){
        console.log(e);
    }
}

module.exports = {
    manageMessagesReceived,
}