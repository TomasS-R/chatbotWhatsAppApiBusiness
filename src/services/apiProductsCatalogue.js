const https = require("https");
const config = require("../config");

// You can configure here the get information from the product/products
// More info: https://developers.facebook.com/docs/marketing-api/reference/product-catalog/products/

// Products
// https://graph.facebook.com/v15.0/524785366304461/products?fields=image_url

// Product
// https://graph.facebook.com/v15.0/5971520329580778?fields=image_url

async function ObtainInfoProd(idProductCatalogue, fields, isProduct){

    try{
        const entityType = isProduct ? '' : '/products';
        const options = {
            host:"graph.facebook.com",
            // Change the ID of the phone for production or development
            path:`/${config.VERSION}/${idProductCatalogue}${entityType}?fields=${fields}`,
            method:"GET",
            headers: {
                Authorization: `Bearer ${config.TOKEN}`
            }
        };
        return new Promise((resolve) => {
            const req = https.request(options, res => {
                let responseData = '';

                res.on("data", d=> {
                    responseData += d;
                    process.stdout.write(d);
                });

                res.on("end", () => {
                    resolve(responseData);
                    return responseData;
                });
            });

            req.on("error", error => {
                console.error(error);
            });
            req.end();
        });
    }catch(e){
        console.error(e);
    }
}

module.exports = {
    ObtainInfoProd
};