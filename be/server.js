const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const forge = require('node-forge');
require('dotenv').config()
const fs = require('fs');
const app = express();
const path = require('path')

app.use(cors()); //corsOptions));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

const db = require("./models");
const User = db.user;
var bcrypt = require("bcryptjs");

db.sequelize.sync().then(() => {
    // db.sequelize.sync({ force: true }).then(() => {
    // Uncommand this function if firstime running
    // initial();
}).catch(err => {
    console.log(err.message);
});


app.get("/", (req, res) => {
    res.json({
        message: "MAIL-ENCRYPT-API"
    });
});
app.use('/attachment/get', express.static(path.join(__dirname, 'uploads')));

require('./routes/auth.route')(app);
require('./routes/message.route')(app);

const PORT = process.env.HTTP_PORT || 8080;
app.listen(PORT, 'localhost', () => {
    console.log(`Server is running on port ${PORT}.`);
});

function initial() {
    let users = [
            { userId: "1234", username: "admin", email: "admin@mail.com", password: "admin", passphrase: "pass" },
            { userId: "1555", username: "test1", email: "test1@mail.com", password: "test1", passphrase: "pass" },
            { userId: "1556", username: "test2", email: "test2@mail.com", password: "test2", passphrase: "pass" },
        ]
        // const privatePath = path.join(__dirname, 'keystore', 'private');
    const publicPath = path.join(__dirname, 'keystore', 'public');

    users.forEach((element) => {
        // const privateKeyPath = path.join(privatePath, element.userId + '_private.key');
        const publicKeyPath = path.join(publicPath, element.userId + '_public.key');
        const seed = element.passphrase;
        const prng = forge.random.createInstance();
        prng.seedFileSync = () => seed
        const keyPair = forge.pki.rsa.generateKeyPair({ bits: 2048, prng, workers: 2 })
            // Export private key to a file
            // const privateKeyPem = forge.pki.privateKeyToPem(keyPair.privateKey);
            // fs.writeFileSync(privateKeyPath, privateKeyPem);
            // console.log('Private key exported to private_key.pem');
            // Export public key to a file
        const publicKeyPem = forge.pki.publicKeyToPem(keyPair.publicKey);
        fs.writeFileSync(publicKeyPath, publicKeyPem);
        console.log('Public key exported to public_key.pem');
        User.create({
            userId: element.userId,
            username: element.username,
            email: element.email,
            password: bcrypt.hashSync(element.password, 8),
            passphraseHash: bcrypt.hashSync(element.passphrase, 8),
            // privateKeyPath: privateKeyPath,
            publicKeyPath: publicKeyPath
        }).then(challenge => {
            console.log("Success create user" + element.username)
        }).catch(err => {
            console.log("Failed create user " + element.username + " because " + err.message)
        });
    });

}

process.on('SIGINT', () => {
    console.log("Bye bye!");
    process.exit();
});