function MarkMessageAsRead(messageId) {
    const data = JSON.stringify({
        "messaging_product": "whatsapp",
        "status": "read",
        "message_id": `${messageId}`
    });
    return data;
}

// Select languages
function messageButtonLanguage(number){
    const data = JSON.stringify({
        "messaging_product": "whatsapp",
        "to": number,
        "type": "interactive",
        "interactive": {
            "type": "button",
            "body": {
                "text": "Por favor seleccione el lenguaje de su preferencia:\n\nPlease select your lenguage of your preference:\n\n ▪️Español 🇪🇸\n\n ▪️English 🇬🇧"
            },
            "action": {
                "buttons": [
                    {
                        "type": "reply",
                        "reply": {
                            "id": "es",
                            "title": "Español"
                        }
                    },
                    {
                        "type": "reply",
                        "reply": {
                            "id": "en",
                            "title": "English"
                        }
                    },
                ]
            }
        }
    });
    return data;
}

// Mensage Comenzar!
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
                "text": "🧐 Oh! que elegancia tener aqui a "+nameUser+" "+lastname+"\n\n🤵🏻‍♂️ Menos mal vine vestido de gala para la ocasión!.\n\nAhora si "+nameUser+"!\n\nMe presento, mi nombre es BotRex 🤖.\n\nSoy el encargado de llevar los negocios al siguiente nivel.\n\nAhora sí, que tal si comenzamos?"
            },
            "footer": {
                "text": "Selecciona una opcion 👇🏻"
            },
            "action": {
                "buttons": [
                    {
                        "type": "reply",
                        "reply": {
                            "id": "hello-botrex",
                            "title": "Comenzar! ✅"
                        }
                    },
                ]
            }
        }
    });
    return data;
}

// Mensaje recibido
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

// Menu Español
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
                "text": "Estas son algunas de las alternativas en nuestro Menú:"
            },
            "footer": {
                "text": "Seleccione una de las opciones 👇🏻"
            },
            "action": {
                "button": "Ver opciones +",
                "sections": [
                    {
                        "title": "Menú 📋",
                        "rows": [
                            {
                                // El ID puede ser numero o texto
                                "id": "view-products",
                                "title": "Productos"
                            },
                            {
                                "id": "Listen-audio",
                                "title": "Escuchar audio"
                            },
                            {
                                "id": "Send-sticker",
                                "title": "Recibir sticker"
                            },
                            {
                                "id": "Send-location",
                                "title": "Recibir Ubicacion"
                            },
                            {
                                "id": "Send-contact",
                                "title": "Recibir asesoramiento"
                            },
                            {
                                "id": "Send-roadmap",
                                "title": "Ver roadmap"
                            },
                            {
                                "id": "Bot-my-business",
                                "title": "Bot para mi negocio"
                            }
                        ]
                    },
                ]
            }
        }
    });
    return data;
}

// Mensage productos!
function messageListProductos(number){
    const data = JSON.stringify({
        "messaging_product": "whatsapp",
        "to" : number,
        "type": "interactive",
        "interactive": {
            "type": "product_list",
            "header":{
                "type": "text",
                "text": "Catalogo de servicios"
            },
            "body":{
                "text": "Nuestro catalogo de servicios para tu negocio 🤩"
            },
            "footer":{
                "text": "Haz click en ver artículos para ver obtener mas info. 👇🏻"
            },
            "action": {
                "catalog_id": "524785366304461",
                "sections": [
                    {
                        "title": "Nuestros servicios",
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

// Mensage productos!
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
                "text": "Pulsa ver para obtener mas informacion 👇🏻"
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
                "text": "Pulsa ver para obtener mas informacion 👇🏻"
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
                "text": "Pulsa ver para obtener mas informacion 👇🏻"
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

// Send contact
function contactAssistant(number){
    const data = JSON.stringify({
        "messaging_product": "whatsapp",
        "to": number,
        "type": "sticker",
        "sticker": {
            "link": "https://wa.me/1156903459?text=Estoy%20interesado%20en%20sus%20servicios",
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
                "text": "Deseas ver otras opciones?.\n\nPulsa el boton para ver el menu o escribe *Menú* 👇🏻"
            },
            "action": {
                "buttons": [
                    {
                        "type": "reply",
                        "reply": {
                            "id": "menu_GoToResponse",
                            "title": "Menú"
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
                "text": "Pulsa el boton para ver el menu y sus opciones, o envia la palabra *Menu* 👇🏻"
            },
            "action": {
                "buttons": [
                    {
                        "type": "reply",
                        "reply": {
                            "id": "menu_button",
                            "title": "Menú"
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
                "text": "Extraordinario! comencemos, mis funciones son variadas aqui puedes ver un listado:\n\n✅ Enviar Stickers\n\n✅ Enviar archivos multimedia\n\n✅ Enviar textos\n\n✅ Enviar localizaciones\n\nMuchas mas opciones...\n\nTambien puedo responder a muchisimos mensajes.\n\nPuedes probar algunas funciones aqui abajo 👇🏻"
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
    MarkMessageAsRead,

    messageButtonLanguage,
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
    contactAssistant,
    //sendContact,
    messageButtonGoToMenu,
    messageButtonMenu,
    messageStart,
};