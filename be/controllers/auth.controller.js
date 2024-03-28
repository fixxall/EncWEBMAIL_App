const config = require("../configs/auth.config");
const db = require("../models");
const User = db.user;

const forge = require('node-forge');
const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const { validationResult } = require('express-validator');
const path = require('path');
const fs = require('fs-extra');

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

exports.changePassphrase = (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).send({ message: "Invalid input", errors: errors.array() })
    }
    User.update({
            passphraseHash: bcrypt.hashSync(req.body.newPassphrase, 8)
        }, {
            where: { userId: req.userId }
        }).then(user => {
            const publicPath = path.join(__dirname, '../keystore', 'public');
            const publicKeyPath = path.join(publicPath, req.userId + '_public.key');
            const seed = req.body.newPassphrase;
            const prng = forge.random.createInstance();
            prng.seedFileSync = () => seed
            const keyPair = forge.pki.rsa.generateKeyPair({ bits: 2048, prng, workers: 2 });
            const publicKeyPem = forge.pki.publicKeyToPem(keyPair.publicKey);
            fs.writeFileSync(publicKeyPath, publicKeyPem);
            console.log('Public key exported to public_key.pem');
            res.status(200).send({ message: "Success change passphrase", id: user.id });
        })
        .catch(err => {
            console.log(err);
            res.status(500).send({ message: err.message });
        });
};

exports.checkPassphrase = (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).send({ message: "Invalid input", errors: errors.array() })
    }
    User.findOne({
            where: { userId: req.userId }
        }).then(user => {
            var passphraseValid = bcrypt.compareSync(
                req.body.passphrase,
                user.passphraseHash
            );
            if (passphraseValid) {
                return res.status(200).send({ message: "Passphrase Correct" });
            } else {
                return res.status(401).send({ message: "Invalid username or password!" });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).send({ message: err.message });
        });
};