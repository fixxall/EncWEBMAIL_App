const db = require("../models");
const User = db.user;
const Message = db.message;
const Attachment = db.attachment;
const AttachmentMessage = db.attachmentmessage;
const { validationResult } = require('express-validator');

const fs = require('fs-extra');
const Op = db.Sequelize.Op;

exports.createMessage = (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).send({ message: "Invalid input", errors: errors.array() })
    }
    User.findOne({
        where: { userId: req.userId }
    }).then(users => {
        Message.create({
                receiver: req.body.receiver,
                sender: users.email,
                message: req.body.message,
                type: req.body.type,
                passhraseHash: req.body.passhraseHash,
                encKey: req.body.encKey,

            }).then((message) => {
                AttachmentMessage.create({
                        messageId: message.id,
                        attachmentId: req.body.attachmentId,
                    }).then((attmess) => {
                        console.log(`[message created][${new Date()}] ${req.userId} created id #${message.id}`);
                        res.status(200).send({ message: "Created sucessfully!" });
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).send({ message: err.message });
                    });
            })
            .catch(err => {
                console.log(err);
                res.status(500).send({ message: err.message });
            });
    }).catch(err => {
        res.status(500).send({ message: err.message });
    });

};


exports.deleteMessage = (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).send({ message: "Invalid input", errors: errors.array() })
    }
    Message.destroy({ where: { id: req.body.messageId } }).then(data => {
        console.log(`[message delete][${new Date()}] ${req.userId} delete id #${x.id}`);
        res.status(200).send({ message: "Destroyed successfully!" });
    }).catch(err => {
        res.status(500).send({ message: err.message });
    });
};
exports.messageDraftGet = (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).send({ message: "Invalid input", errors: errors.array() })
    }
    User.findOne({
        where: { userId: req.userId }
    }).then(users => {
        Message.findAll({
                where: { receiver: users.email }
            }).then(async(messages) => {
                let newData = [];

                for await (const element of messages) {
                    let FileList = [];
                    await AttachmentMessage.findAll({
                        where: { messageId: element.dataValues.id }
                    }).then(async(attach) => {
                        for await (const element1 of attach) {
                            await Attachment.findOne({
                                where: { id: element1.dataValues.attachmentId }
                            }).then((data) => {
                                FileList.push({
                                    name: data.dataValues.name,
                                    file: data.dataValues.file,
                                    createdAt: data.dataValues.createdAt,
                                    updatedAt: data.dataValues.updatedAt
                                });
                            }).catch(err => {
                                console.log(err);
                                res.status(500).send({ message: err.message });
                            });
                        }
                    }).catch((err) => {
                        console.log(err);
                        res.status(500).send({ message: err.message });
                    });

                    var Data = {
                        files: FileList,
                        sender: element.sender,
                        encKey: element.encKey,
                        passhraseHash: element.passhraseHash,
                        receiver: element.receiver,
                        message: element.message,
                        type: element.type,
                        createdAt: element.createdAt,
                        updatedAt: element.updatedAt,
                    };
                    newData.push(Data);
                }
                res.status(200).send({ data: newData });
            })
            .catch(err => {
                console.log(err);
                res.status(500).send({ message: err.message });
            });
    }).catch(err => {
        res.status(500).send({ message: err.message });
    });
};


exports.messageSentsGet = (req, res) => {
    User.findOne({
        where: { userId: req.userId }
    }).then(users => {
        Message.findAll({
                where: { sender: users.email }
            }).then(async(messages) => {
                let newData = [];

                for await (const element of messages) {
                    let FileList = [];
                    await AttachmentMessage.findAll({
                        where: { messageId: element.dataValues.id }
                    }).then(async(attach) => {
                        for await (const element1 of attach) {
                            await Attachment.findOne({
                                where: { id: element1.dataValues.attachmentId }
                            }).then((data) => {
                                FileList.push({
                                    name: data.dataValues.name,
                                    file: data.dataValues.file,
                                    createdAt: data.dataValues.createdAt,
                                    updatedAt: data.dataValues.updatedAt
                                });
                            }).catch(err => {
                                console.log(err);
                                res.status(500).send({ message: err.message });
                            });
                        }
                    }).catch((err) => {
                        console.log(err);
                        res.status(500).send({ message: err.message });
                    });

                    var Data = {
                        files: FileList,
                        sender: element.sender,
                        encKey: element.encKey,
                        passhraseHash: element.passhraseHash,
                        receiver: element.receiver,
                        message: element.message,
                        type: element.type,
                        createdAt: element.createdAt,
                        updatedAt: element.updatedAt,
                    };
                    newData.push(Data);
                }
                res.status(200).send({ data: newData });
            })
            .catch(err => {
                console.log(err);
                res.status(500).send({ message: err.message });
            });
    }).catch(err => {
        res.status(500).send({ message: err.message });
    });
};

exports.attachmentNew = (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).send({ message: "Invalid input", errors: errors.array() })
    }
    var src = fs.createReadStream(req.file.path);
    var dest = fs.createWriteStream(`${__dirname}/../uploads/${req.file.originalname}`);
    src.pipe(dest);
    src.on('end', function() {
        fs.unlinkSync(req.file.path);
        Attachment.create({
            name: req.body.name,
            file: req.file.originalname
        }).then(jdih => {
            console.log(`[attachment input][${new Date()}] ${req.npm} input attachment#${jdih.id} :${req.body.name}`);
            res.status(200).send({ id: jdih.id, message: "Added successfully!" });
        }).catch(err => {
            res.status(500).send({ message: err.message });
        });
    });
    src.on('error', function(err) { res.status(500).send({ err: err }); });
};

exports.getPublicKey = (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).send({ message: "Invalid input", errors: errors.array() })
    }
    User.findOne({
        where: { email: req.body.receiver }
    }).then(users => {
        fs.readFile(users.publicKeyPath, 'utf-8', (err, publicKey) => {
            if (err) {
                return res.status(500).json({ message: err.message });
            }

            res.status(200).json({ publicKey });
        });
    }).catch(err => {
        res.status(500).send({ message: err.message });
    })
};

exports.getPrivateKey = (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).send({ message: "Invalid input", errors: errors.array() })
    }

    User.findOne({
        where: { userId: req.userId }
    }).then(users => {
        fs.readFile(users.privateKeyPath, 'utf-8', (err, privateKey) => {
            if (err) {
                return res.status(500).json({ message: err.message });
            }

            res.status(200).json({ privateKey });
        });
    }).catch(err => {
        res.status(500).send({ message: err.message });
    })
};