// Español
function españolResponseSpanish(name){
    const responseLanguage = "✅ Excelente "+name+"! a partir de ahora me comunicare contigo en Español 🇪🇸.\n\nAntes de comenzar a conversar me gustaria saber mas de ti para poder brindarte un servicio excepcional 😎.\n\nComencemos con ¿Como es tu nombre? o ¿Como te gustaria que te llame?\n\n_*Solo coloca el nombre*_";
    return responseLanguage;
}

function españolResponseNameSpanish(name){
    const responseName = "✅ Genial! "+name+" es un nombre ideal, y por lo que veo si te queda 😉.\n\nAhora dime "+name+"\n\n¿Como es tu apellido? 🤔";
    return responseName;
}

function welcomeResponseSpanish(name){
    const responseWelcomeUser = ["Hola "+name+"! 🙋🏻‍♂️, que placer verte por aqui.\n\nVeo que me precisas, en que te puedo ayudar? 😲.",
    "Hey "+name+" 👋🏻 que gusto que estes por estos lados!\n\nQue puedo hacer por ti? 🤔.",
    "Un gusto verte nuevamente "+name+" 😃\n\nEn que te puedo ayudar? 😎.",
    "Ya siento la buena energia cando comienzan una conversacion asi! 🤓.\n\nEn que te puedo ayudar hoy "+name+"? 🤖."];
    const randomIndexWelcome = Math.floor(Math.random() * responseWelcomeUser.length);
    const randomResponse = responseWelcomeUser[randomIndexWelcome];
    return randomResponse;
}

function notResponseResultSpanish(){
    const responseNotFound = ["Ups no entendí que me quisiste decir.🤔",
    "Que me decias? estaba tomando un cafe.\n\nMh... riquisimo!☕",
    "Ups se me cayo un tornillo 🔧, me decias?.",
    "Ay caray! me electrocute ⚡🤖.\n\nNo te preocupes, ya estoy bien.\n\nQue me decias?.",
    "No entendi que me quisiste decir.\n\nPodrias ser mas especifico?.",
    "Veo que me superas en inteligencia.🤓\n\nNo logre entender lo que me dijiste.🤔"];
    const randomIndex = Math.floor(Math.random() * responseNotFound.length);
    const randomResponse = responseNotFound[randomIndex];
    return randomResponse;
}

function proccessProducts (product_retailer_id,quantity,item_price,currency,total_price,number){

    console.log("El usuario: " + number + " ha agregado al carrito de compras: " +
                "\tID del Producto: " + product_retailer_id +
                "\tCantidad: " + quantity +
                "\tPrecio: " + item_price +
                "\tMoneda: " + currency +
                "\tPrecio total a pagar: " + total_price);
    return {
        product_retailer_id: product_retailer_id,
        quantity: quantity,
        item_price: item_price,
        currency: currency,
        total_price: total_price,
        number: number
        }
}

function processProductItems(product_items, num){
    const products = [];

    product_items.forEach(function(item) {
        // Variables of the products details
        const product_retailer_id = item["product_retailer_id"];
        const quantity = item["quantity"];
        const item_price = item["item_price"];
        const currency = item["currency"];
        const total_price = quantity * item_price;

        const productData = proccessProducts(product_retailer_id,quantity,item_price,currency,total_price,num);
        products.push(productData);
    });

    // Return the array of processed products
    return products;
}

function productCartRecivedSpanish(number,products,name){
    //const responseCartReceived = "Gracias por tu compra, el pedido se esta procesando. Te contactaremos a la brevedad. ";
    try {
        const proccessProducts = processProductItems(products, number);
        const product = proccessProducts[0];
        const product_retailer_id = product.product_retailer_id;
        const quantity = product.quantity;
        const item_price = product.item_price;
        const currency = product.currency;
        const total_price = product.total_price;
        if (product != null){
            const responseCartReceived = "Esto es una prueba de como se procesaría su compra para su negocio:\n\nGracias por tu compra! "+name+"! 🤩"+
                                        "\n\n🎁 Producto: "+product_retailer_id+
                                        "\n\n🛒 Cantidad: "+quantity+
                                        "\n\n💰 Precio: "+item_price+
                                        "\n\n💵 Moneda: "+currency+
                                        "\n\n📝 Total: $ "+total_price+""+currency+"\n\nEl pedido se esta procesando.\n\nTe contactaremos a la brevedad. ";
            return responseCartReceived;
        }
        else{
            const responseCartReceived = "Hubo un error al procesar tu pedido, por favor intenta nuevamente en unos minutos.";
            return responseCartReceived;
        }
        
    } catch (error) {
        console.log(error);
        const responseCartReceived = "Hubo un error al procesar tu pedido, por favor intenta nuevamente en unos minutos.";
        return responseCartReceived;
    }
}

function roadmapResponseSpanish(){
    const roadmapResponse = "Claro que si, te dejo el link para que lo puedas ver: https://bit.ly/BotRex";
    return roadmapResponse;
}

function responseAsesoramentSpanish(){
    const roadmapResponse = "Con gusto te brindare el contacto de un asesor que te podra ayudar con tu problema. 😁";
    return roadmapResponse;
}

function responseBotForBusinessSpanish(){
    const roadmapResponse = "Estamos trabajando en esta opcion para que 🎉*proximamente*🎉 puedas tener un bot personalizado en tu negocio. 🏪";
    return roadmapResponse;
}

function getRandomEmoji() {
    const emojis = ['😀', '😍', '🤖', '🐶', '🌞', '🎉', '🎈', '🎁', '🚀', '🍕'];
    const randomIndex = Math.floor(Math.random() * emojis.length);
    const randomEmojiResponse = emojis[randomIndex];
    return randomEmojiResponse;
}

// Send response to recived message media
function imageReceivedResponseSpanish(){
    const Response = "Recibi tu imagen, pero por el momento no lo puedo procesar ya que aun no cuento con Inteligencia Artificial.";
    return Response;
}

function audioReceivedResponseSpanish(){
    const Response = "Recibi tu audio, pero por el momento no lo puedo procesar ya que aun no cuento con Inteligencia Artificial.";
    return Response;
}

function videoReceivedResponseSpanish(){
    const Response = "Recibi tu video, pero por el momento no lo puedo procesar ya que aun no cuento con Inteligencia Artificial.";
    return Response;
}

function documentReceivedResponseSpanish(){
    const Response = "Recibi tu documento! Por el momento estoy limitado, pero en poco tiempo lo podre procesar";
    return Response;
}

function stickerReceivedResponseSpanish(){
    const Response = "Recibi tu sticker y debo decir que me encanta! 😱😍";
    return Response;
}

function locationReceivedResponseSpanish(){
    const Response = "Recibi la localizacion que me enviaste por ahora no puedo procesarla, pero estoy trabajando en ello para mejorar mi inteligencia.";
    return Response;
}

function contactReceivedResponseSpanish(){
    const Response = "Detecte el contacto que me enviaste, pero por el momento no lo puedo procesar ya que aun no cuento con esas capacidades.";
    return Response;
}

module.exports = {
    // Responde a la informacion del usuario
    españolResponseSpanish,
    españolResponseNameSpanish,

    // Comienzo de charla
    welcomeResponseSpanish,
    notResponseResultSpanish,
    productCartRecivedSpanish,
    roadmapResponseSpanish,
    responseAsesoramentSpanish,
    responseBotForBusinessSpanish,
    getRandomEmoji,

    // Multimedia analisis recibidos
    audioReceivedResponseSpanish,
    imageReceivedResponseSpanish,
    videoReceivedResponseSpanish,
    documentReceivedResponseSpanish,
    stickerReceivedResponseSpanish,
    locationReceivedResponseSpanish,
    contactReceivedResponseSpanish

}