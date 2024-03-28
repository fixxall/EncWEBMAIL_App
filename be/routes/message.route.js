const controller = require("../controllers/message.controller");
const { authJwt } = require("../middlewares");
const { body } = require('express-validator');
const multer = require('multer')
var upload = multer({ dest: `${__dirname}/../uploads/` })

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.post("/api/message/create", [
        authJwt.verifyToken,
        body('receiver').isString(),
        body('message').isString(),
        body('type').isString(),
        body('encKey').isString(),
        body('fileHash').isString(),
        body('attachmentId').isString(),
    ], controller.createMessage);

    app.post("/api/message/delete", [
        authJwt.verifyToken,
        body('messageId').isString(),
    ], controller.deleteMessage);

    app.post("/api/message/attachment/new", upload.single("file"), [
        authJwt.verifyToken,
        body('name').isLength({ min: 1, max: 160 }),
    ], controller.attachmentNew);

    app.get("/api/message/draft/get", [
        authJwt.verifyToken
    ], controller.messageDraftGet);

    app.get("/api/message/sent/get", [
        authJwt.verifyToken
    ], controller.messageSentsGet);

    app.get("/api/message/getprivate", [
        authJwt.verifyToken
    ], controller.getPrivateKey);

    app.post("/api/message/getpublic", [
        authJwt.verifyToken,
        body('receiver').isString(),
    ], controller.getPublicKey);
};