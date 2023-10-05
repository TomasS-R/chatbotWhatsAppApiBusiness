const expres = require("express");
const router = expres.Router();
const whatsappController = require("../controllers/whatsappControllers");

router.use(expres.json());

const routeapi = "/api";

router
.get("/", whatsappController.VerifyToken)

.post("/", whatsappController.ReceivedMessage)

.get(`${routeapi}/messages`, whatsappController.getMessage)

.get(`${routeapi}/messages/:phone`, (req, res) => {
    const wa_id = req.params.phone;
    whatsappController.show(wa_id, req, res);
})

.post(`${routeapi}/sendmessage`, (req, res) => {
    try {
        const { body, wa_id } = req.body;

        if (!wa_id) {
            return res.status(400).json({ success: false, error: "The request needs the 'wa_id' field!" });
        }
        else if (!body) {
            return res.status(400).json({ success: false, error: "The request needs the 'body' field!" });
        }
        else if (!body || !wa_id) {
            return res.status(400).json({ success: false, error: "The request need 'wa_id' and 'body' fields!" });
        }
        whatsappController.sendMessageUser(body, wa_id, res);
    }
    catch (e) {
    }
});


module.exports = router;