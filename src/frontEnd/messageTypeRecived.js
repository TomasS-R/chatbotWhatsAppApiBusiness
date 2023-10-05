const axios = require("axios");
const mime = require("mime-types");
const config = require("../config");
const storageSB = require("../config");
const mimeTypeTransform = require("./mimeType");
//const messagesDB = require("../databaseFiles/messages");
const saveMessagesOrder = require("../saveMessagesOrder");


// Images, Stickers, Audio, Video, Contacts, Location, Documents
async function processInfo (bucketName, wa_id, wam_id, type, outgoing, status, bot, date, changeStatus, caption, data, file_id) {

    const url = `https://graph.facebook.com/${config.VERSION}/${file_id}`;
    const file = await axios.get(url, {headers: {Authorization: `Bearer ${config.TOKEN}`}, responseType: 'json'});

    const fileUrl = file.data.url;
    const mime_type = file.data.mime_type;

    const downloadFile = await axios.get(fileUrl, {headers: {Authorization: `Bearer ${config.TOKEN}`}, responseType: 'arraybuffer'});

    if (downloadFile.status === 200) {
        
        const fileData = downloadFile.data;
        const fileName = Math.floor(Math.random() * 9999999998) + 1;
        const fileExtension = await mimeTypeTransform.mimeToExt(mime_type);
        // Name of the file
        const fileFinal = fileName + "_" + Date.now() + "." + fileExtension;
        const mimeType = mime.lookup(fileExtension);

        const { data: dataFile, error } = await storageSB.storageSupabase.storage.from(bucketName).upload(fileFinal,fileData, {contentType: mimeType});
        const { data: obtainURL, error: errorURL } = storageSB.storageSupabase.storage.from(bucketName).getPublicUrl(fileFinal);

        if (dataFile) {
            console.log("The file has upload to the bucket!");

            if (obtainURL) {

                const publicURL = obtainURL?.["publicUrl"]
                let body = publicURL;

                await saveMessagesOrder.savePushAndView(wa_id,wam_id,type,outgoing,body,status,caption,data,date,changeStatus,bot);

            } else {
                console.log("Error to obtain the public URL to the file: ",errorURL);
            }

        } else {
            console.log("Error to upload the file in to the bucket: ",error);
        }
    } else {
        console.log("Error to download de file.");
    }
}

async function saveMediaFileReceived (messageTypeReceived, datamessage) {

    try {
        const bucketName = process.env.BUCKET_NAME_MESSAGES;

        //console.log("jsonResponse: ",datamessage);
        
        const wa_id = datamessage?.["from"];
        const wam_id = datamessage?.["id"];
        const type = datamessage?.["type"];
        const outgoing = "false";
        const status = "sent";
        const bot = false;
        // Date formating
        const timestamp = new Date().getTime();
        const datenoformat = new Date(timestamp);
        const date = datenoformat.toISOString();
        const changeStatus = false;

        let caption = '';
        let data = '';
        // const username = await messagesDB.GetUsername(wa_id);
        
        if (messageTypeReceived == 'image') {

            const file_image = datamessage?.["image"];
            const file_id = file_image?.["id"];

            await processInfo(bucketName, wa_id, wam_id, type, outgoing, status, bot, date, changeStatus, caption, data, file_id);

        } else if (messageTypeReceived == 'sticker') {
            
            const file_sticker = datamessage?.["sticker"];
            const file_id = file_sticker?.["id"];

            await processInfo(bucketName, wa_id, wam_id, type, outgoing, status, bot, date, changeStatus, caption, data, file_id);
            
        } else if (messageTypeReceived == 'audio') {

            const file_audio = datamessage?.["audio"];
            const file_id = file_audio?.["id"];

            await processInfo(bucketName, wa_id, wam_id, type, outgoing, status, bot, date, changeStatus, caption, data, file_id);
            
        } else if (messageTypeReceived == 'video') {
            
            const file_video = datamessage?.["video"];
            const file_id = file_video?.["id"];

            await processInfo(bucketName, wa_id, wam_id, type, outgoing, status, bot, date, changeStatus, caption, data, file_id);

        } else if (messageTypeReceived == 'document') {

            const file_document = datamessage?.["document"];
            const file_id = file_document?.["id"];

            await processInfo(bucketName, wa_id, wam_id, type, outgoing, status, bot, date, changeStatus, caption, data, file_id);
            
        } else if (messageTypeReceived == 'contacts') {

            try {            
                const contacts = datamessage?.["contacts"];

                if (contacts && Array.isArray(contacts)) {
                    const elements = [];
                
                    contacts.forEach((contact) => {
                        const name = contact?.name;
                        const phones = contact?.phones;
                        const birthday = contact?.birthday;
                        const emails = contact?.emails;
                        const addresses = contact?.addresses;
                        const org = contact?.org;
                        const urls = contact?.urls;
                
                        if (name) {
                            const first_name = name?.first_name;
                            const formatted_name = name?.formatted_name;
                            const last_name = name?.last_name;
                
                            if (first_name) elements.push({ type: "first_name", content: first_name });
                            elements.push({ type: "formatted_name", content: formatted_name }); // Required
                            if (last_name) elements.push({ type: "last_name", content: last_name });
                        }
                
                        if (phones && Array.isArray(phones)) {
                            phones.forEach((phoneData) => {
                                const phone = phoneData?.phone;
                                const type = phoneData?.type;
                
                                if (phone) elements.push({ type: "phone", content: phone });
                                if (type) elements.push({ type: "typephone", content: type });
                            });
                        }

                        if (birthday) {
                            elements.push({ type: "birtday", content: birthday });
                        }

                        if (emails && Array.isArray(emails)) {
                            emails.forEach((emailData) => {
                                const email = emailData?.email;
                                const type = emailData?.type;
                
                                if (email) elements.push({ type: "email", content: email });
                                if (type) elements.push({ type: "type", content: type });
                            });
                        }

                        if (addresses && Array.isArray(addresses)) {
                            addresses.forEach((address) => {
                                const city = address?.city;
                                const country = address?.country;
                                const country_code = address?.country_code;
                                const state = address?.state;
                                const street = address?.street;
                                const type = address?.type;
                                const zip = address?.zip;
                
                                if (city) elements.push({ type: "city", content: city });
                                if (country) elements.push({ type: "country", content: country });
                                if (country_code) elements.push({ type: "country_code", content: country_code });
                                if (state) elements.push({ type: "state", content: state });
                                if (street) elements.push({ type: "street", content: street });
                                if (type) elements.push({ type: "type", content: type });
                                if (zip) elements.push({ type: "zip", content: zip });
                            });
                        }

                        if (org && Array.isArray(org)) {
                            org.forEach((orgData) => {
                                const company = orgData?.company;
                                const department = orgData?.department;
                                const title = orgData?.title;
                
                                if (company) elements.push({ type: "company", content: company });
                                if (department) elements.push({ type: "department", content: department });
                                if (title) elements.push({ type: "title", content: title });
                            });
                        }

                        if (urls && Array.isArray(urls)) {
                            urls.forEach((urlData) => {
                                const url = urlData?.url;
                                const type = urlData?.type;
                
                                if (url) elements.push({ type: "url", content: url });
                                if (type) elements.push({ type: "type", content: type });
                            });
                        }
                    });
                
                    const body = JSON.stringify(elements);
                
                    await saveMessagesOrder.savePushAndView(wa_id,wam_id,type,outgoing,body,status,caption,data,date,changeStatus,bot);
                } else {
                    console.log("No 'contacts' property found in datamessage.");
                }
            } catch (e) {
                console.log("Error to process the contact received from the user: ",e);
            }

        } else if (messageTypeReceived == 'location') {

            try {            
                const location = datamessage?.["location"];

                if (location) {
                    const elements = [];
                
                    const latitude = location?.latitude;
                    const longitude = location?.longitude;
                    const address = location?.address;
                    const name = location?.name;

                    elements.push({ type: "latitude", content: latitude });
                    elements.push({ type: "longitude", content: longitude });
                    if (address) { elements.push({ type: "address", content: address }) };
                    if (name) { elements.push({ type: "name", content: name }) };
                
                    const body = JSON.stringify(elements);
                
                    await saveMessagesOrder.savePushAndView(wa_id,wam_id,type,outgoing,body,status,caption,data,date,changeStatus,bot);
                } else {
                    console.log("No 'location' property found in datamessage.");
                }
            } catch (e) {
                console.log("Error to process the location received from the user: ",e);
            }

        }
    } catch (e) {
        console.log("Error to catch info: ",e);
    }
}


// Client make order with catalog (Save the data in the database)
async function customerMakeOrder(datamessage) {
    try {
        // Itera a través de cada elemento en datamessage
        for (let index = 0; index < datamessage.length; index++) {
            const item = datamessage[index];
            
            const wa_id = item?.from;
            const wam_id = item?.id;
            const type = item?.type;
            const outgoing = "false";
            const status = "sent";
            const bot = false;
            // Date formating
            const timestamp = new Date().getTime();
            const datenoformat = new Date(timestamp);
            const date = datenoformat.toISOString();
            const changeStatus = false;

            let caption = '';
            let data = '';

            
            if (type == 'order') {

                const elements = [];

                // Access to the object 'order' in the element 'datamessage'
                const orderData = item?.order;

                // Data in the object 'order'
                const textOrder = orderData?.text;
                const catalog_id = orderData?.catalog_id;
                const product_items = orderData?.product_items;

                elements.push({ type: "text", content: textOrder });
                elements.push({ type: "catalogid", content: catalog_id });
                elements.push({ type: "productItems", content: product_items });
                
                var body = JSON.stringify(elements);

            } else {
                console.log(`Not found any object 'order' in the element ${index} of 'datamessage'`);
            }
            
            await saveMessagesOrder.savePushAndView(wa_id, wam_id, type, outgoing, body, status, caption, data, date, changeStatus, bot);
        }
    } catch (e) {
        console.log("Error to save the order in database: ", e);
    }
}

module.exports = {
    saveMediaFileReceived,
    customerMakeOrder,
}

