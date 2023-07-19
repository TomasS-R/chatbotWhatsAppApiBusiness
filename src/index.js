const express = require("express");
const apiRoute = require("./routes/routes");
// Cors is a package that allows you to make requests from one server to another to pass info to the front end.
const cors = require("cors");

//const whitelist = ["http://localhost:3000/"/*, ""*/];

const appname = process.env.FLY_APP_NAME;

const app = express();
//app.use(cors(/*{origin: whitelist}*/));
const PORT = process.env.PORT || 8080

const HOST = "0.0.0.0";

app.use(express.json());

app.use("/whatsapp", apiRoute);

app.listen(PORT, HOST, () => (console.log(`Server listen in port: ${PORT} and Host in: ${HOST}`)));
console.log(`Back end in: https://${appname}.fly.dev/whatsapp/messages`);