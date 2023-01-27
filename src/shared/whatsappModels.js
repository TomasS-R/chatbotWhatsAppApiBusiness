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

function MessageList(number){
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
                                "title": "Comprar",
                                "description": "Le mostraremos todo lo que puede comprarse!"
                            },
                            {
                                "id": "0002",
                                "title": "Vender",
                                "description": "Aqui podra vender sus productos!"
                            }
                        ]
                    },
                    {
                        "title": "Centro de atencion ",
                        "rows": [
                            {
                                "id": "0003",
                                "title": "Agencia",
                                "description": "Visita nustra agencia!"
                            },
                            {
                                "id": "0004",
                                "title": "Contacto",
                                "description": "Te brindaremos un numero de contacto"
                            }
                        ]
                    }
                ]
            }
        }
    });
    return data;
}

module.exports = {
    MessageText,
    MessageList
};