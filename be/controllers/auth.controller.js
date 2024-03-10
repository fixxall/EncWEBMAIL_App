const config = require("../configs/auth.config");
const db = require("../models");
const User = db.user;

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const { validationResult } = require('express-validator');

exports.signin = (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).send({ message: "Invalid input", errors: errors.array() })
    }
    User.findOne({
            where: {
                username: req.body.username
            },
        }).then(user => {
            if (!user) {
                return res.status(401).send({ message: "Invalid username or password!" });
            }
            var passwordIsValid = bcrypt.compareSync(
                req.body.password,
                user.password
            );

            if (passwordIsValid) {
                try {
                    var token = jwt.sign({ userId: user.userId }, config.secret, {
                        expiresIn: 86400 // 24 hours
                    });
                    res.status(200).send({
                        userId: user.userId,
                        accessToken: token
                    });
                } catch (e) {
                    console.log(e);
                    res.status(500).send({ message: e.message });
                }
            } else {
                return res.status(401).send({ message: "Invalid username or password!" });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).send({ message: err.message });
        });
};