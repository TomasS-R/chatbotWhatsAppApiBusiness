const fs = require("fs");
const myConsole = new console.Console(fs.createWriteStream("./logWAModel.txt"));


function MessageText(textResponse, number){
    const data = JSON.stringify({
        "messaging_product": "whatsapp",    
        "recipient_type": "individual",
        "to": number,
        "type": "text",
        "text": {
            "preview_url": false,
            "body": textResponse
        }
    });
    myConsole.log(data);
    return data;
}

module.exports = {
    MessageText
};