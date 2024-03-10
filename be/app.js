const forge = require('node-forge');
const path = require('path');

const keyPair = forge.pki.rsa.generateKeyPair({ bits: 2048 });


const publicPath = path.join(__dirname, 'keystore', 'public');
const privatePath = path.join(__dirname, 'keystore', 'private');

const fs = require('fs');
// Export private key to a file
const privateKeyPem = forge.pki.privateKeyToPem(keyPair.privateKey);
fs.writeFileSync(path.join(privatePath, 'private_key.key'), privateKeyPem);
console.log('Private key exported to private_key.pem');

// Export public key to a file
const publicKeyPem = forge.pki.publicKeyToPem(keyPair.publicKey);
fs.writeFileSync(path.join(publicPath, 'public_key.key'), publicKeyPem);
console.log('Public key exported to public_key.pem');