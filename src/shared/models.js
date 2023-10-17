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
            "filename": filename,
            "caption": caption
        }
    });
    return data;
}

function Buttons(number, bodyText, buttonTittle1, buttonTittle2, buttonTittle3){
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
                "buttons": [
                    {
                        "type": "reply",
                        "reply": {
                            "id": "00001",
                            "title": buttonTittle1
                        }
                    },
                    {
                        "type": "reply",
                        "reply": {
                            "id": "00002",
                            "title": buttonTittle2
                        }
                    },
                    {
                        "type": "reply",
                        "reply": {
                            "id": "00003",
                            "title": buttonTittle3
                        }
                    }
                ]
            }
        }
    });
    return data;
}

function List(number, headerText, bodyText, footerText, buttonTittle, titleSection1){
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
                "sections": [
                    {
                        "title": titleSection1,
                        "rows": [
                            {
                                // El ID puede ser numero o texto
                                "id": "0001",
                                "title": "1 remera",
                                "description": "Recibira una remera de forma gratuita"
                            },
                            {
                                "id": "0002",
                                "title": "1 pantalon",
                                "description": "Recibira un pantalon de forma gratuita"
                            }
                        ]
                    },
                    {
                        "title": "Movilidad",
                        "rows": [
                            {
                                "id": "0003",
                                "title": "1 auto 🚗",
                                "description": "Recibira un auto"
                            },
                            {
                                "id": "0004",
                                "title": "1 avion 🛬",
                                "description": "Recibira un avion"
                            }
                        ]
                    }
                ]
            }
        }
    });
    return data;
}

function Location(number){
    const data = JSON.stringify({
        "messaging_product": "whatsapp",    
        "recipient_type": "individual",
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

module.exports = {
    Text,
    Image,
    Audio,
    Video,
    Document,
    Buttons,
    List,
    Location
};