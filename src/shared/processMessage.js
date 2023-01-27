const whatsappService = require("../services/whatsappService");
const whatsappModel = require("../shared/whatsappModels");
const {parse} = require("libphonenumber-js");


function numero(number){
    let parsedNumber = parse("+"+number);
    let country = parsedNumber.country;

    let numeroSin9 = number;
    if (country == "AR") {
        numeroSin9 = number.replace("9","",1);
    }
    
    return numeroSin9;
}

function Process(textUser,number){
    textUser = textUser.toLowerCase();

    // Array para ir guardando los mensajes
    var modelsMessages = [];

    if (textUser.includes("hola")){
        //SALUDAR
        var model = whatsappModel.MessageText("Hola, un gusto saludarte!",number);
        modelsMessages.push(model);
        
        var modelist = whatsappModel.MessageList(number);
        modelsMessages.push(modelist);
        
    }
    else if (textUser.includes("comprar")){
        //COMPRAR
        var model = whatsappModel.MessageText("Hola, un gusto saludarte!",number);
        modelsMessages.push(model);
        
    }
    else{
        // NO ENTIENDE
        var model = whatsappModel.MessageText("Ups! parece que uno de mis tornillos se me cayo, que me decias?",number);
        modelsMessages.push(model);
    }


    // Recorre el array y va respondiendo los mensajes de a poco segun entren (de 1 en 1)
    modelsMessages.forEach(model => {
        whatsappService.SendMessageWhatsApp(model);
    });

    
}

module.exports = {
    numero,
    Process
}