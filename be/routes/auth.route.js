const controller = require("../controllers/auth.controller");
const { authJwt } = require("../middlewares");
const { body } = require('express-validator');

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.post("/api/auth/signin", [
        body('username').isString(),
        body('password').isLength({ min: 1 }),
    ], controller.signin);

};