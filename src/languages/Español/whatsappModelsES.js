const whatsappModels = require("../../shared/models");

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

    const buttontext = "Por favor seleccione el lenguaje de su preferencia:\n\nPlease select your lenguage of your preference:\n\n ▪️Español 🇪🇸\n\n ▪️English 🇬🇧";
    const buttonTitles = ['Español', 'English'];
    const info = whatsappModels.Buttons(number, buttontext, buttonTitles);
    return info;
}

// Mensage Comenzar!
function messageButtonStart(number,nameUser,lastname){

    const linkImage = "https://aatxtgegahulgbfagubh.supabase.co/storage/v1/object/public/archivos-para-bot/BotRexLogoByXpower.png";
    const bodyText = "🧐 Oh! que elegancia tener aqui a "+nameUser+" "+lastname+"\n\n🤵🏻‍♂️ Menos mal vine vestido de gala para la ocasión!.\n\nAhora si "+nameUser+"!\n\nMe presento, mi nombre es BotRex 🤖.\n\nSoy el encargado de llevar los negocios al siguiente nivel.\n\nSin nada mas que añadir, que tal si comenzamos?";
    const footerText = "Selecciona una opcion 👇🏻";
    const buttonTitles = ["Comenzar! ✅"];
    const info = whatsappModels.ImageButton(number, linkImage, bodyText, footerText, buttonTitles);
    return info;
}

// Menu Español
function messageListMenu(number){

    const headerText = "Menú 📋";
    const bodyText = "Estas son algunas de las alternativas en nuestro Menú:";
    const footerText = "Seleccione una de las opciones 👇🏻";
    const buttonTittle = "Ver opciones +";
    const sections = [
        {
            title: "Menú 📋",
            rows: [
                { id: "0001", title: "Productos" },
                { id: "0002", title: "Escuchar audio" },
                { id: "0003", title: "Recibir sticker" },
                { id: "0004", title: "Recibir Ubicacion" },
                { id: "0005", title: "Recibir asesoramiento" },
                { id: "0006", title: "Ver roadmap" },
                { id: "0007", title: "Bot para mi negocio" },
            ]
        },
        /*
        {
            title: "Ejemplo",
            rows: [
                { id: "0001", title: "Titulo 1", description: "Descripcion 1" },
                { id: "0002", title: "Titulo 2", description: "Descripcion 2" }
            ]
        }
        */
    ];
    
    const info = whatsappModels.List(number, headerText, bodyText, footerText, buttonTittle, sections);
    return info;
}

// Mensaje productos!
function messageListProductos(number){
    // Ejemplo de uso:
    const headerText = 'Catálogo de servicios';
    const bodyText = 'Nuestro catálogo de servicios para tu negocio 🤩';
    const footerText = 'Haz click en ver artículos para ver obtener más info. 👇🏻';
    const catalogId = '524785366304461';
    const sections = [
        {
            title: 'Nuestros servicios',
            productRetailerIds: ['796294fer89', 'qzl4vcw72p', '4899756ef99']
        },
        /*
        {
            title: 'Nuestros servicios2',
            productRetailerIds: ['895294fer89', 'awl465772p', '3299866ef99']
        }
        */
    ];

    const catalogMessage = whatsappModels.ListMultipleProducts(number, headerText, bodyText, footerText, catalogId, sections);
    return catalogMessage;
}

// Mensaje productos!
function messageListProducto1(number){

    const headerText = "Bot Premium";
    const footerText = "Pulsa ver para obtener mas informacion 👇🏻";
    const catalogId = "524785366304461";
    const productRetailerId = "796294fer89";

    const info = whatsappModels.ListProduct(number, headerText, footerText, catalogId, productRetailerId);
    return info;
}

function messageListProducto2(number){
    const headerText = "Bot Expert";
    const footerText = "Pulsa ver para obtener mas informacion 👇🏻";
    const catalogId =  "524785366304461";
    const productRetailerId = "qzl4vcw72p";

    const info = whatsappModels.ListProduct(number, headerText, footerText, catalogId, productRetailerId);
    return info;
}

function messageListProducto3(number){
    const headerText = "Bot Elite";
    const footerText = "Pulsa ver para obtener mas informacion 👇🏻";
    const catalogId = "524785366304461";
    const productRetailerId = "4899756ef99";

    const info = whatsappModels.ListProduct(number, headerText, footerText, catalogId, productRetailerId);
    return info;
}

// Send audio
function sendAudio(number){
    const linkAudio = "https://aatxtgegahulgbfagubh.supabase.co/storage/v1/object/public/archivos-para-bot/BotRexAudio.ogg";
    const info = whatsappModels.Audio(number, linkAudio);
    return info;
}

// Send sticker
function sendSticker(number){
    const linkSticker = "https://aatxtgegahulgbfagubh.supabase.co/storage/v1/object/public/archivos-para-bot/BotRexFace.webp";
    const info = whatsappModels.Stickers(number, linkSticker);
    return info;
}

// Send location
function sendLocation(number){
    const latitude = "-34.63543432250713";
    const longitude = "-58.36476703246046";
    const nameloc = "Estadio Alberto J. Armando";
    const addressloc = "Brandsen 805, C1161 CABA";
    const info = whatsappModels.Location(number, latitude, longitude, nameloc, addressloc);
    return info;
}

// Send contact
function contactAssistant(number){
    const buttonName = "Contactar al desarrollador";
    const url = "https://wa.me/+5491158793549?text=Estoy%20interesado%20en%20sus%20servicios";
    const info = whatsappModels.LinkButton(number, headerText, bodyText, footerText, buttonName, url);
    return info;
}

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
                        "phone": "+5491158793549",
                        "type": "Celular"
                    }
                ],
                "urls": []
            }
        ]
    });
    return data;
}

function messageButtonGoToMenu(number){
    
    const buttontext = "Deseas ver otras opciones?.\n\nPulsa el boton para ver el menu o escribe *Menú* 👇🏻";
    const buttonTitles = ['Menú'];
    const info = whatsappModels.Buttons(number, buttontext, buttonTitles);
    return info;
}

function messageButtonMenu(number){
    const buttontext = "Pulsa el boton para ver el menu y sus opciones, o envia la palabra *Menu* 👇🏻";
    const buttonTitles = ['Menú'];
    const info = whatsappModels.Buttons(number, buttontext, buttonTitles);
    return info;
}

function messageStart(number){
    const buttontext = "Extraordinario! comencemos, mis funciones son variadas aqui puedes ver un listado:\n\n✅ Enviar Stickers\n\n✅ Enviar archivos multimedia\n\n✅ Enviar textos\n\n✅ Enviar localizaciones\n\nMuchas mas opciones...\n\nTambien puedo responder a muchisimos mensajes.\n\nPuedes probar algunas funciones aqui abajo 👇🏻";
    const buttonTitles = ['Menú'];
    const info = whatsappModels.Buttons(number, buttontext, buttonTitles);
    return info;
}

function giveContactLink(number){
    const headerText = "Contacto";
    const bodyText = "Un asesor te respondera por esta vía a la brevedad.";
    const footerText = "test";
    const buttonName = "Enviar mensaje";
    const url = "https://wa.me/1156903459?text=I'm%20interested%20in%20your%20services";

    const info = whatsappModels.LinkButton(number, headerText, bodyText, footerText, buttonName, url);
    return info;
}

module.exports = {
    MarkMessageAsRead,

    messageButtonLanguage,
    messageButtonStart,
    messageListMenu,
    messageListProductos,
    messageListProducto1,
    messageListProducto2,
    messageListProducto3,
    sendAudio,
    sendSticker,
    sendLocation,
    contactAssistant,
    sendContact,

    messageButtonGoToMenu,
    messageButtonMenu,
    messageStart,

    giveContactLink,
};