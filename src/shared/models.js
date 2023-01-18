const fs = require("fs");
const myConsole = new console.Console(fs.createWriteStream("./logsModels.txt"));
const {parse} = require("libphonenumber-js");

function numero(number){
    //parsear el numero y sacar el codigo de area (+54)
    let parsedNumber = parse("+"+number);
    let country = parsedNumber.country;

    let numeroSin9 = number;
    if (country == "AR") {
        numeroSin9 = number.replace("9","",1);
    }
    myConsole.log("Numero sin 9:", numeroSin9);
    
    return numeroSin9;
}

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

function Image(number){
    const data = JSON.stringify({
        "messaging_product": "whatsapp",    
        "recipient_type": "individual",
        "to": number,
        "type": "image",
        "image": {
            //(URL PARA IMAGEN)
            "link": "https://aatxtgegahulgbfagubh.supabase.co/storage/v1/object/public/archivos-para-bot/WhatsApp%20Image%202023-01-05%20at%2022.56.06.jpeg"
        }
    });
    return data;
}

function Audio(number){
    const data = JSON.stringify({
        "messaging_product": "whatsapp",    
        "recipient_type": "individual",
        "to": number,
        "type": "audio",
        "audio": {
            //(URL PARA AUDIO .MP3/.MPEG)
            "link": "https://aatxtgegahulgbfagubh.supabase.co/storage/v1/object/public/archivos-para-bot/msg297722695-36791.MPEG"
        }
    });
    return data;
}

function Video(number){
    const data = JSON.stringify({
        "messaging_product": "whatsapp",    
        "recipient_type": "individual",
        "to": number,
        "type": "video",
        "video": {
            //(URL PARA VIDEO .MP4)
            "link": "https://aatxtgegahulgbfagubh.supabase.co/storage/v1/object/public/archivos-para-bot/video_whatsapp.mp4"
        }
    });
    return data;
}

function Document(number){
    const data = JSON.stringify({
        "messaging_product": "whatsapp",    
        "recipient_type": "individual",
        "to": number,
        "type": "document",
        "document": {
            //(URL PARA DOCUMENTO .PDF .TXT ETC...)
            "link": "https://aatxtgegahulgbfagubh.supabase.co/storage/v1/object/public/archivos-para-bot/document_whatsapp.pdf",
            "filename": "Documento test",
            "caption": "Descripcion o datos del documento"
        }
    });
    return data;
}

function Buttons(number){
    const data = JSON.stringify({
        "messaging_product": "whatsapp",    
        "recipient_type": "individual",
        "to": number,
        "type": "interactive",
        "interactive": {
            "type": "button",
            "body": {
                "text": "Quieres realizar la encuesta sobre este bot?"
            },
            "action": {
                "buttons": [
                    {
                        "type": "reply",
                        "reply": {
                            "id": "00001",
                            "title": "✅ Sí"
                        }
                    },
                    {
                        "type": "reply",
                        "reply": {
                            "id": "00002",
                            "title": "❌ No"
                        }
                    },
                    {
                        "type": "reply",
                        "reply": {
                            "id": "00003",
                            "title": "Mas tarde..."
                        }
                    }
                ]
            }
        }
    });
    return data;
}

function List(number){
    const data = JSON.stringify({
        "messaging_product": "whatsapp",    
        "recipient_type": "individual",
        "to": number,
        "type": "interactive",
        "interactive": {
            "type": "list",
            "header": {
                "type": "text",
                "text": "Productos"
            },
            "body": {
                "text": "Seleccione en esta lista *1* de los productos que le gustaria recibir"
            },
            "footer": {
                "text": "Presione el boton para ver las opciones"
            },
            "action": {
                "button": "Ver opciones",
                "sections": [
                    {
                        "title": "Vestuario",
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
    numero,
    Text,
    Image,
    Audio,
    Video,
    Document,
    Buttons,
    List,
    Location
};