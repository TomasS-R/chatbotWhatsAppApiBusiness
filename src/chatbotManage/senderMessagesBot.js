const path = require("path");
const { storageSupabase } = require("../config");
const queueMessage = require("../bullmqQueue/messageQueue");
//const messagesDB = require("../databaseFiles/messages");
const whatsappService = require('../services/whatsappService');
const apiGraph = require("../services/apiProductsCatalogue");
const saveMessagesOrder = require("../saveMessagesOrder");
const redisManager = require('../bullmqQueue/redisManager');
const databaseManager = require('../databaseFiles/databaseManager');

async function saveMessagesBotDB(message, response) {

    try {
        const jsonMessage = JSON.parse(message);
        //console.log(jsonMessage);
        const jsonResponse = JSON.parse(response);
        //console.log(jsonResponse);

        const wa_id = jsonResponse?.["contacts"]?.[0]?.["wa_id"];
        const wam_id = jsonResponse?.["messages"]?.[0]?.["id"];
        const type = jsonMessage?.["type"];
        const outgoing = "true";
        const status = "sent";
        const bot = true;
        // Date formating
        const timestamp = new Date().getTime();
        const datenoformat = new Date(timestamp);
        const date = datenoformat.toISOString();
        const changeStatus = false;

        let caption = '';
        let data = '';
        //const username = await messagesDB.GetUsername(wa_id);

        if (type == "text") {

            const body = jsonMessage?.["text"]?.["body"]?.replace(/\n/g, ' ');
            caption = '';
            data = '';

            await saveMessagesOrder.savePushAndView(wa_id,wam_id,type,outgoing,body,status,caption,data,date,changeStatus,bot);

        } else if (type == "image" || type == "document" || type == "audio" || type == "video" || type == "sticker") {

            const fileURL = jsonMessage?.[type]?.["link"]
            const baseName = path.basename(fileURL);
            const bucketFilesBot = 'archivos-para-bot';
            if (databaseManager.isSupabaseConnected()) {
                const { data: bucketObject, error: bucketError } = await storageSupabase.storage.from(bucketFilesBot).list();

                if (bucketObject) {
                    const fileURL = `${process.env.SUPABASE_URL}/storage/v1/object/public/${bucketFilesBot}/${baseName}`;
                    let body = fileURL;

                    if (type == "document") {
                        caption = jsonMessage?.[type]?.["caption"];
                    }

                    await saveMessagesOrder.savePushAndView(wa_id,wam_id,type,outgoing,body,status,caption,data,date,changeStatus,bot);

                }
                else {
                    console.log("Error: ",bucketError);
                }
            }

        } else if (type == "location") {

            const location = jsonMessage?.["location"];
            const locLatitude = location?.["latitude"];
            const locLongitude = location?.["longitude"];
            const locName = location?.["name"];
            const locAdress = location?.["address"];
            const locURL = location?.["url"];

            const elements = [];

            elements.push({ type: "latitude", content: locLatitude });
            elements.push({ type: "longitude", content: locLongitude });
            elements.push({ type: "name", content: locName });
            elements.push({ type: "address", content: locAdress });
            elements.push({ type: "url", content: locURL });

            const body = JSON.stringify(elements);

            await saveMessagesOrder.savePushAndView(wa_id,wam_id,type,outgoing,body,status,caption,data,date,changeStatus,bot);

        } else if (type == "contacts") {

            try {
                const elements = [];

                const contacts = jsonMessage?.["contacts"];

                contacts.forEach(contacts => {
                    const addresses = contacts?.["addresses"];
                    addresses.forEach(addresses => {

                        const city = addresses?.["city"];
                        if (city) elements.push({ type: "city", content: city });

                        const country = addresses?.["country"];
                        if (country) elements.push({ type: "country", content: country });

                        const countryCode = addresses?.["country_code"];
                        if (countryCode) elements.push({ type: "country_code", content: countryCode });

                        const state = addresses?.["state"];
                        if (state) elements.push({ type: "state", content: state });

                        const street = addresses?.["street"];
                        if (street) elements.push({ type: "street", content: street });

                        const type = addresses?.["typeAdress"];
                        if (type) elements.push({ type: "type", content: type });

                        const zip = addresses?.["zip"];
                        if (zip) elements.push({ type: "zip", content: zip });
                    });

                    const birthday = contacts?.["birthday"];
                    if (birthday) elements.push({ type: "birthday", content: birthday });

                    const emails = contacts?.["emails"];
                    emails.forEach(emails => {
                        const email = emails?.["email"];
                        if (email) elements.push({ type: "email", content: email });

                        const type = emails?.["type"];
                        if (type) elements.push({ type: "typemail", content: type });
                    });

                    const name = contacts?.["name"];
                    const first_name = name?.["first_name"];
                    if (name) elements.push({ type: "first_name", content: first_name });

                    const formatted_name = name?.["formatted_name"];
                    elements.push({ type: "formatted_name", content: formatted_name });

                    const last_name = name?.["last_name"];
                    if (last_name) elements.push({ type: "last_name", content: last_name });

                    const org = contacts?.["org"];
                    const company = org?.["company"];
                    if (company) elements.push({ type: "company", content: company });

                    const department = org?.["department"];
                    if (department) elements.push({ type: "department", content: department });

                    const phones = contacts?.["phones"];
                    phones.forEach(phones => {
                        const phone = phones?.["phone"];
                        if (phone) elements.push({ type: "phone", content: phone });

                        const type = phones?.["type"];
                        if (type) elements.push({ type: "typephone", content: type });
                    });

                    const urls = contacts?.["urls"];
                    urls.forEach(urls => {
                        const url = urls?.["url"];
                        if (url) elements.push({ type: "url", content: url });

                        const type = urls?.["type"];
                        if (type) elements.push({ type: "typeurl", content: type });
                    });
                });

                const body = JSON.stringify(elements);

                await saveMessagesOrder.savePushAndView(wa_id,wam_id,type,outgoing,body,status,caption,data,date,changeStatus,bot);
            } catch (e) {
                console.error(e);
            };

        } else if (type == "interactive") {

            const interactive = jsonMessage?.["interactive"];
            const typeInteractive = interactive?.["type"];
            if (typeInteractive == "button"){
                const bodyText = interactive?.["body"]?.["text"]?.replace(/\n/g, ' ');

                const action = interactive?.["action"];
                const button = action?.["buttons"];
                // const reply = button?.["reply"];
                // const sections = action?.["sections"];

                const elements = [];

                elements.push({ type: "body", content: bodyText });

                button.forEach(button => {
                    const titleButton = button?.reply?.["title"];
                    elements.push({ type: "button", content: titleButton });
                });

                const body = JSON.stringify(elements);

                await saveMessagesOrder.savePushAndView(wa_id,wam_id,type,outgoing,body,status,caption,data,date,changeStatus,bot);
            }
            else if (typeInteractive == "list"){
                const headerText = interactive?.["header"]?.["text"]?.replace(/\n/g, ' ');
                const bodyText = interactive?.["body"]?.["text"]?.replace(/\n/g, ' ');
                const footerText = interactive?.["footer"]?.["text"]?.replace(/\n/g, ' ');

                const action = interactive?.["action"];
                const button = action?.["button"];
                //const sections = action?.["sections"];

                const elements = [];

                elements.push({ type: "header", content: headerText });
                elements.push({ type: "body", content: bodyText });
                elements.push({ type: "footer", content: footerText });
                elements.push({ type: "button", content: button });

                const body = JSON.stringify(elements);

                await saveMessagesOrder.savePushAndView(wa_id,wam_id,type,outgoing,body,status,caption,data,date,changeStatus,bot);
            }
            else if (typeInteractive == "product_list"){
                const headerText = interactive?.["header"]?.["text"]?.replace(/\n/g, ' ');
                const bodyText = interactive?.["body"]?.["text"]?.replace(/\n/g, ' ');
                const footerText = interactive?.["footer"]?.["text"]?.replace(/\n/g, ' ');

                const action = interactive?.["action"];
                // const catalog = action?.["catalog_id"];
                // const sections = action?.["sections"];

                const elements = [];
                const button = "Ver articulos";

                elements.push({ type: "header", content: headerText });
                elements.push({ type: "body", content: bodyText });
                elements.push({ type: "footer", content: footerText });
                elements.push({ type: "button", content: button });

                const body = JSON.stringify(elements);

                await saveMessagesOrder.savePushAndView(wa_id,wam_id,type,outgoing,body,status,caption,data,date,changeStatus,bot);

            }
            else if (typeInteractive == "product"){
                const bodyText = interactive?.["body"]?.["text"]?.replace(/\n/g, ' ');
                const footerText = interactive?.["footer"]?.["text"]?.replace(/\n/g, ' ');

                const action = interactive?.["action"];
                const catalogID = action?.["catalog_id"];
                const productID = action?.["product_retailer_id"];

                //console.log(jsonMessage);

                const fields = "image_url"

                const result = await apiGraph.ObtainInfoProd(catalogID,fields,false);

                const response = JSON.parse(result);

                const productData = response.data;

                for (const product of productData) {
                    const imageUrl = product.image_url;
                    const id = product.id;
                
                    console.log('ID del producto:', id);
                    console.log('URL de la imagen:', imageUrl);
                }

                const elements = [];
                const button = "Ver";

                elements.push({ type: "header", content: bodyText });
                elements.push({ type: "body", content: footerText });
                elements.push({ type: "footer", content: 'ID del catalogo: '+catalogID+' ID del Producto: '+productID });
                elements.push({ type: "button", content: button });

                const body = JSON.stringify(elements);

                await saveMessagesOrder.savePushAndView(wa_id,wam_id,type,outgoing,body,status,caption,data,date,changeStatus,bot);

            }
            else if (typeInteractive == "cta_url"){
                const headerText = interactive?.["header"]?.["text"]?.replace(/\n/g, ' ');
                const bodyText = interactive?.["body"]?.["text"]?.replace(/\n/g, ' ');
                const footerText = interactive?.["footer"]?.["text"]?.replace(/\n/g, ' ');
                const action = interactive?.["action"];

                const parameters = action?.["parameters"];

                const textParameters = parameters?.["display_text"];
                const urlParameters = parameters?.["url"];

                const elements = [];

                elements.push({ type: "header", content: headerText });
                elements.push({ type: "body", content: bodyText });
                elements.push({ type: "footer", content: footerText });
                elements.push({ type: "button", content: 'Text: '+textParameters+' Url: '+urlParameters });

                const body = JSON.stringify(elements);

                await saveMessagesOrder.savePushAndView(wa_id,wam_id,type,outgoing,body,status,caption,data,date,changeStatus,bot);

            }
        } else if (type == "reaction") {
            const messageID = jsonMessage?.["message_id"];
            const reaction = jsonMessage?.["reaction"];

            const elements = [];

            elements.push({ type: "message_id", content: messageID });
            elements.push({ type: "emoji", content: reaction });

            const body = JSON.stringify(elements);

            await saveMessagesOrder.savePushAndView(wa_id,wam_id,type,outgoing,body,status,caption,data,date,changeStatus,bot);
        }
    } catch (e) {
        console.error(e);
    }
}

async function sendMessagesInOrder(modelsMessages) {

    for (const message of modelsMessages) {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        if (redisManager.isConnected() && databaseManager.isPostgresConnected()) {

            const response = await queueMessage.enqueueWork('sendMessageBot',message);
            console.log('Response sendMessageInOrder: ', response);
            await saveMessagesBotDB(message, response);
        }
        else if (!redisManager.isConnected() && databaseManager.isPostgresConnected()){

            const response = await whatsappService.SendMessageWhatsApp(message);
            await saveMessagesBotDB(message, response);
        }

    }
}

module.exports = {
    sendMessagesInOrder
};