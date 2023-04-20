// Message Start!
function messageButtonStart(number,nameUser,lastname){
    const data = JSON.stringify({
        "messaging_product": "whatsapp",
        "to": number,
        "type": "interactive",
        "interactive": {
            "type": "button",
            "header": {
                "type": "image",
                "image": {
                    "link": "https://aatxtgegahulgbfagubh.supabase.co/storage/v1/object/public/archivos-para-bot/BotRexLogoByXpower.png"
                }
            },
            "body": {
                "text": "🧐 Oh! what elegance to have here "+nameUser+" "+lastname+"\n\n🤵🏻‍♂️ It's a good thing I came dressed for the occasion!.\n\nNow I do! "+nameUser+"!\n\nI introduce myself, my name is BotRex 🤖 I am in charge of taking business to the next level.\n\nNow, how about we get started?"
            },
            "footer": {
                "text": "Select an option 👇🏻"
            },
            "action": {
                "buttons": [
                    {
                        "type": "reply",
                        "reply": {
                            "id": "hello-botrex",
                            "title": "Get started! ✅"
                        }
                    }
                ]
            }
        }
    });
    return data;
}

// Message received
function MessageText(textResponse, number){
    const data = JSON.stringify({
        "messaging_product": "whatsapp",    
        "recipient_type": "individual",
        "to": number,
        "type": "text",
        "text": {
            "preview_url": true,
            "body": textResponse
        }
    });
    return data;
}

// Menu English
function MessageListMenu(number){
    const data = JSON.stringify({
        "messaging_product": "whatsapp",    
        "recipient_type": "individual",
        "to": number,
        "type": "interactive",
        "interactive": {
            "type": "list",
            "header": {
                "type": "text",
                "text": "Menú 📋"
            },
            "body": {
                "text": "These are some of the alternatives in our Menu:"
            },
            "footer": {
                "text": "Select one of the options 👇🏻"
            },
            "action": {
                "button": "See options +",
                "sections": [
                    {
                        "title": "Menú 📋",
                        "rows": [
                            {
                                // El ID puede ser numero o texto
                                "id": "view-products",
                                "title": "Products"
                            },
                            {
                                "id": "Listen-audio",
                                "title": "Listen audio"
                            },
                            {
                                "id": "Send-sticker",
                                "title": "Receive sticker"
                            },
                            {
                                "id": "Send-location",
                                "title": "Receive Ubication"
                            },
                            {
                                "id": "Send-contact",
                                "title": "Receive advice"
                            },
                            {
                                "id": "Send-roadmap",
                                "title": "See roadmap"
                            },
                            {
                                "id": "Bot-my-business",
                                "title": "Bot for my business"
                            }
                        ]
                    },
                ]
            }
        }
    });
    return data;
}

// Messages products!
function messageListProductos(number){
    const data = JSON.stringify({
        "messaging_product": "whatsapp",
        "to" : number,
        "type": "interactive",
        "interactive": {
            "type": "product_list",
            "header":{
                "type": "text",
                "text": "Service Catalog"
            },
            "body":{
                "text": "Our catalog of services to take your business to the next level 🤩"
            },
            "footer":{
                "text": "Click on view articles for more information. 👇🏻"
            },
            "action": {
                "catalog_id": "524785366304461",
                "sections": [
                    {
                        "title": "Our services",
                        "product_items": [
                            {"product_retailer_id": "796294fer89"},
                            {"product_retailer_id": "qzl4vcw72p"},
                            {"product_retailer_id": "4899756ef99"}
                        ]
                    }
                ]
            }
        }
    });
    return data;
}

function messageListProducto1(number){
    const data = JSON.stringify({
        "messaging_product": "whatsapp",
        "recipient_type": "individual",
        "to": number,
        "type": "interactive",
        "interactive": {
            "type": "product",
            "body": {
                "text": "Bot Premium"
            },
            "footer": {
                "text": "Click here for more information 👇🏻"
            },
            "action": {
                "catalog_id": "524785366304461",
                "product_retailer_id": "796294fer89"
            }
        }
    });
    return data;
}

function messageListProducto2(number){
    const data = JSON.stringify({
        "messaging_product": "whatsapp",
        "recipient_type": "individual",
        "to": number,
        "type": "interactive",
        "interactive": {
            "type": "product",
            "body": {
                "text": "Bot Expert"
            },
            "footer": {
                "text": "Click here for more information 👇🏻"
            },
            "action": {
                "catalog_id": "524785366304461",
                "product_retailer_id": "qzl4vcw72p"
            }
        }
    });
    return data;
}

function messageListProducto3(number){
    const data = JSON.stringify({
        "messaging_product": "whatsapp",
        "recipient_type": "individual",
        "to": number,
        "type": "interactive",
        "interactive": {
            "type": "product",
            "body": {
                "text": "Bot Elite"
            },
            "footer": {
                "text": "Click here for more information 👇🏻"
            },
            "action": {
                "catalog_id": "524785366304461",
                "product_retailer_id": "4899756ef99"
            }
        }
    });
    return data;
}

// Send audio
function sendAudio(number){
    const data = JSON.stringify({
        "messaging_product": "whatsapp",
        "to": number,
        "type": "audio",
        "audio": {
            "link": "https://aatxtgegahulgbfagubh.supabase.co/storage/v1/object/public/archivos-para-bot/BotRexAudio.ogg"
        }
    });
    return data;
}

// Send sticker
function sendSticker(number){
    const data = JSON.stringify({
        "messaging_product": "whatsapp",
        "to": number,
        "type": "sticker",
        "sticker": {
            "link": "https://aatxtgegahulgbfagubh.supabase.co/storage/v1/object/public/archivos-para-bot/BotRexFace.webp",
        }
    });
    return data;
}

// Send location
function sendLocation(number){
    const data = JSON.stringify({
        "messaging_product": "whatsapp",
        "to": number,
        "type": "location",
        "location": {
            "latitude": "-34.63543432250713",
            "longitude": "-58.36476703246046",
            "name": "Estadio Alberto J. Armando",
            "address": "Brandsen 805, C1161 CABA"
        }
    });
    return data;
}

/*
function sendContact(number){
    const data = JSON.stringify({
        "messaging_product": "whatsapp",
        "to": number,
        "type": "contacts",
        "recipient_type": "individual",
        "contacts": [
            {
                "addresses": [
                    {
                        "city": "Argentina",
                        "country": "CABA",
                        "country_code": "+54"
                    }
                ],
                "birthday": "1998-04-27",
                "emails": [
                    {
                        "email": "tomas.saintromain@gmail.com",
                        "type": "Mail"
                    }
                ],
                "name": {
                    "first_name": "Tomás S-R",
                    "formatted_name": "Tomás",
                    "last_name": "Saint-Romain"
                },
                "org": {
                    "company": "BotRex"
                },
                "phones": [
                    {
                        "phone": "1156903459",
                        "type": "Celular"
                    }
                ],
                "urls": []
            }
        ]
    });
    return data;
}*/

function messageButtonGoToMenu(number){
    const data = JSON.stringify({
        "messaging_product": "whatsapp",
        "to": number,
        "type": "interactive",
        "interactive": {
            "type": "button",
            "body": {
                "text": "Do you want to see other options?.\n\nClick the button to see the menu or type *Menu*. 👇🏻"
            },
            "action": {
                "buttons": [
                    {
                        "type": "reply",
                        "reply": {
                            "id": "menu_GoToResponse",
                            "title": "Menu"
                        }
                    },
                ]
            }
        }
    });
    return data;
}

function messageButtonMenu(number){
    const data = JSON.stringify({
        "messaging_product": "whatsapp",
        "to": number,
        "type": "interactive",
        "interactive": {
            "type": "button",
            "body": {
                "text": "Click the button to see the menu and the options or type *Menu*. 👇🏻"
            },
            "action": {
                "buttons": [
                    {
                        "type": "reply",
                        "reply": {
                            "id": "menu_button",
                            "title": "Menu"
                        }
                    },
                ]
            }
        }
    });
    return data;
}

function messageStart(number){
    const data = JSON.stringify({
        "messaging_product": "whatsapp",
        "to": number,
        "type": "interactive",
        "interactive": {
            "type": "button",
            "body": {
                "text": "Extraordinary! let's start, my functions are varied here you can see a list:\n\n✅ Send Stickers\n\n✅ Send multimedia files\n\n✅ Send texts\n\n✅ Send locations\n\nMany more options...\n\nI can also respond to many messages.\n\nYou can try some functions here below 👇🏻"
            },
            "action": {
                "buttons": [
                    {
                        "type": "reply",
                        "reply": {
                            "id": "menu_button",
                            "title": "Menu"
                        }
                    },
                ]
            }
        }
    });
    return data;
}

module.exports = {
    messageButtonStart,
    MessageText,
    MessageListMenu,
    messageListProductos,
    messageListProducto1,
    messageListProducto2,
    messageListProducto3,
    sendAudio,
    sendSticker,
    sendLocation,
    //sendContact,
    messageButtonGoToMenu,
    messageButtonMenu,
    messageStart,
};