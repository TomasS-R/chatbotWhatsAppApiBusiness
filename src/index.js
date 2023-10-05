const apiRoute = require("./routes/routes");
const express = require("express");
const cors = require("cors"); // Cors is a package that allows you to make requests from one server to another to pass info to the front end.
const app = express();
const http = require("http");
const socket = require("../src/frontEnd/sockets");
const createtStorage = require("./databaseFiles/bucketStorage");

const bucketName = `${process.env.BUCKET_NAME_MESSAGES}`;
createtStorage.createBucketStorage(bucketName);

const PORT = process.env.PORT || 8080;
const appname = process.env.FLY_APP_NAME;

app.use(cors(/*{origin: whitelist}*/));
app.use(express.json());
const httpServer = http.createServer(app);

// Socket.io configuration
socket.socket(httpServer);

app.use("/whatsapp", apiRoute);

httpServer.listen(PORT, () => {console.log('Running on : ', httpServer.address());});
//app.listen(PORT, HOST, () => (console.log(`Server is ready and listen in: ${HOST}${PORT}`)));
console.log(`Back end in: https://${appname}.fly.dev/whatsapp/api/messages`);