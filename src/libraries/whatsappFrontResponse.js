/*
In this file we manage the response to the client through the frontend
    The person can response to the clients in this file
*/
const https = require("https");
const configENV = require("../config");


function callback(responseData, error) {
    if (error) {
        console.error("Error to send the message: ", error);
    } else {
        //console.log("Response of WhatsApp: ", responseData);
        return responseData;
    }
}

function sendWhatsAppMessage(data) {
    
    const options = {
        host:"graph.facebook.com",
        // Change the ID of the phone for production or development
        path:`/v15.0/${configENV.IDPHONE}/messages`,
        method:"POST",
        body:data,
        headers: {
            "Content-Type":"application/json",
            Authorization: `Bearer ${configENV.TOKEN}`
        }
    };
    return new Promise((resolve, reject) => {
        const req = https.request(options, res => {
            let responseData = '';

            res.on("data", d=> {
                responseData += d;
                process.stdout.write(d);
            });

            res.on("end", () => {
                callback(responseData,null);
                resolve(responseData);
                return responseData;
            });
        });

        req.on("error", error => {
            console.error(error);
            callback(null, error);
        });

        req.write(data);
        req.end();
    });
};


function sendTextFront(text, num){

    const data = JSON.stringify({
        "messaging_product": "whatsapp",
        "recipient_type": "individual",
        "to": num,
        "type": "text",
        "text": {
          "preview_url": true,
          "body": text
        }
    });
    
    return sendWhatsAppMessage(data, callback);
};

module.exports = {
    callback,
    sendWhatsAppMessage,
    sendTextFront,
}