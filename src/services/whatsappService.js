const https = require("https");
const config = require("../config");

async function SendMessageWhatsApp(data){

    try{
        const options = {
            host:"graph.facebook.com",
            // Change the ID of the phone for production or development
            path:`/${config.VERSION}/${config.IDPHONE}/messages`,
            method:"POST",
            headers: {
                "Content-Type":"application/json",
                Authorization: `Bearer ${config.TOKEN}`
            }
        };
        return new Promise((resolve) => {
            const req = https.request(options, res => {
                let responseData = '';

                res.on("data", d=> {
                    responseData += d;
                    process.stdout.write(d);
                });

                res.on("end", () => {
                    resolve(responseData);
                    return responseData;
                });
            });

            req.on("error", error => {
                console.error(error);
            });

            req.write(data);
            req.end();
        });
    }catch(e){
        console.error(e);
    }
}

module.exports = {
    SendMessageWhatsApp
};