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
        const { text, num } = req.body;
        if (!text || !num) {
            return res.status(400).json({ success: false, error: "The request need data!" });
        }
        whatsappController.sendMessageUser(text, num, res);
    }
    catch (e) {
    }
});


module.exports = router;