function Text(textResponse, number){
    
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
    return data;
}

function Image(number, linkImage){
    const data = JSON.stringify({
        "messaging_product": "whatsapp",    
        "recipient_type": "individual",
        "to": number,
        "type": "image",
        "image": {
            //(URL FOR IMAGE)
            "link": linkImage
        }
    });
    return data;
}

function Audio(number, linkAudio){
    const data = JSON.stringify({
        "messaging_product": "whatsapp",    
        "recipient_type": "individual",
        "to": number,
        "type": "audio",
        "audio": {
            //(URL FOR AUDIO .MP3/.MPEG)
            "link": linkAudio
        }
    });
    return data;
}

function Video(number, linkVideo){
    const data = JSON.stringify({
        "messaging_product": "whatsapp",    
        "recipient_type": "individual",
        "to": number,
        "type": "video",
        "video": {
            //(URL FOR VIDEO .MP4)
            "link": linkVideo
        }
    });
    return data;
}

function Document(number, linkDocument, filename, caption){
    const data = JSON.stringify({
        "messaging_product": "whatsapp",    
        "recipient_type": "individual",
        "to": number,
        "type": "document",
        "document": {
            //(URL FOR DOCUMENT .PDF .TXT ETC...)
            "link": linkDocument,
            /* Filename optional */
            "filename": filename,
            /* Caption optional */
            "caption": caption
        }
    });
    return data;
}

function Stickers(number, linkSticker){
    const data = JSON.stringify({
        "messaging_product": "whatsapp",
        "to": number,
        "type": "sticker",
        "sticker": {
            "link": linkSticker,
        }
    });
    return data;
}

function Location(number, latitude, longitude, nameloc, addressloc){
    const data = JSON.stringify({
        "messaging_product": "whatsapp",    
        "recipient_type": "individual",
        "to": number,
        "type": "location",
        "location": {
            "latitude": latitude,
            "longitude": longitude,
            "name": nameloc,
            "address": addressloc
        }
    });
    return data;
}

function Buttons(number, bodyText, buttonTitles){

    const buttonsArray = buttonTitles.slice(0, 3).map((title, index) => {
        return {
            type: 'reply',
            reply: {
                id: String(index).padStart(5, '0'),
                title: title
            }
        };
    });

    const data = JSON.stringify({
        "messaging_product": "whatsapp",    
        "recipient_type": "individual",
        "to": number,
        "type": "interactive",
        "interactive": {
            "type": "button",
            "body": {
                "text": bodyText
            },
            "action": {
                "buttons": buttonsArray
            }
        }
    });
    return data;
}

function List(number, headerText, bodyText, footerText, buttonTittle, sections){
    const data = JSON.stringify({
        "messaging_product": "whatsapp",    
        "recipient_type": "individual",
        "to": number,
        "type": "interactive",
        "interactive": {
            "type": "list",
            "header": {
                "type": "text",
                "text": headerText
            },
            "body": {
                "text": bodyText
            },
            "footer": {
                "text": footerText
            },
            "action": {
                "button": buttonTittle,
                "sections": sections.map(section => {
                    return {
                        title: section.title,
                        rows: section.rows.map(row => {
                            return {
                                id: row.id,
                                title: row.title,
                                description: row.description
                            };
                        })
                    };
                })
            }
        }
    });
    return data;
}

function LinkButton(number, headerText, bodyText, footerText, buttonName, url){
    const data = JSON.stringify({
        "messaging_product": "whatsapp",
        "recipient_type": "individual",
        "to": number,
        "type": "interactive",
        "interactive": {
          "type": "cta_url",
      
          /* Header optional */
          "header": {
            "type": "text",
            "text": headerText
          },
      
          /* Body optional */
          "body": {
            "text": bodyText
          },
      
          /* Footer optional */
          "footer": {
            "text": footerText
          },
          "action": {
            "name": "cta_url",
            "parameters": {
              "display_text": buttonName,
              "url": url
            }
          }
        }
    });
    return data;
}

function ResponseToMessage(number, bodyText, messageID){
    const data = JSON.stringify({
        "messaging_product": "whatsapp",
        "context": {
          "message_id": messageID
        },
        "to": number,
        "type": "text",
        "text": {
          "preview_url": "False",
          "body": bodyText,
        }
    });
    return data;
}

function ImageButton(number, linkImage, bodyText, footerText, buttonTitles){

    const buttonsArray = buttonTitles.slice(0, 3).map((title, index) => {
        return {
            type: 'reply',
            reply: {
                id: String(index).padStart(5, '0'),
                title: title
            }
        };
    });

    const data = JSON.stringify({
        "messaging_product": "whatsapp",
        "to": number,
        "type": "interactive",
        "interactive": {
            "type": "button",
            "header": {
                "type": "image",
                "image": {
                    "link": linkImage
                }
            },
            "body": {
                "text": bodyText
            },
            "footer": {
                "text": footerText
            },
            "action": {
                "buttons": buttonsArray
            }
        }
    });
    return data;
}

function ListProduct(number, headerText, footerText, catalogId, productRetailerId){
    const data = JSON.stringify({
        "messaging_product": "whatsapp",
        "recipient_type": "individual",
        "to": number,
        "type": "interactive",
        "interactive": {
            "type": "product",
            "body": {
                "text": headerText
            },
            "footer": {
                "text": footerText
            },
            "action": {
                "catalog_id": catalogId,
                "product_retailer_id": productRetailerId
            }
        }
    });
    return data;
}

function ListMultipleProducts(number, headerText, bodyText, footerText, catalogId, sections){

    const sectionObjects = sections.map(section => {
        return {
            title: section.title,
            product_items: section.productRetailerIds.map(id => {
                return { product_retailer_id: id };
            })
        };
    });

    const data = JSON.stringify({
        "messaging_product": "whatsapp",
        "to" : number,
        "type": "interactive",
        "interactive": {
            "type": "product_list",
            "header":{
                "type": "text",
                "text": headerText
            },
            "body":{
                "text": bodyText
            },
            "footer":{
                "text": footerText
            },
            "action": {
                "catalog_id": catalogId,
                "sections": sectionObjects
            }
        }
    });
    return data;
}

function requestLocation (number, bodyText, buttonName){
    const data = JSON.stringify({
        "messaging_product": "whatsapp",
        "recipient_type": "individual",
        "type": "interactive",
        "to": number,
        "interactive": {
            "type": "location_request_message",
            "body": {
                "text": bodyText
            },
            "action": {
                "name": buttonName
            }
        }
    });
    return data;
}

module.exports = {
    Text,
    Image,
    Audio,
    Video,
    Document,
    Stickers,
    Location,
    Buttons,
    List,
    LinkButton,
    ResponseToMessage,
    ImageButton,
    ListProduct,
    ListMultipleProducts,
    requestLocation
};