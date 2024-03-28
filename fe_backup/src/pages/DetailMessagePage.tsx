import React, { useEffect, useState } from 'react';
import { Typography, Button, TextField, CircularProgress, Box } from '@mui/material';
import axios from 'axios';
import listOfUrl from '../configs/listOfUrl';
import * as forge from 'node-forge';
import * as CryptoJS from 'crypto-js';
import * as fs from 'fs';


interface MessageDetailProps {
  message: any;
  tokens: string;
}

const MessageDetail: React.FC<MessageDetailProps> = ({ message, tokens }) => {
  const [passphrase, setPassphrase] = useState('');
  const [canShow, setCanShow] = useState(false);
  const [wrongPas, setWrongPas] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const arrayBufferToBase64 = (arrayBuffer: ArrayBuffer): string => {
    const uint8Array = new Uint8Array(arrayBuffer);
    const binaryString = uint8Array.reduce((str, byte) => str + String.fromCharCode(byte), '');
    return btoa(binaryString);
  };
  
  const base64ToArrayBuffer = (base64: string): ArrayBuffer => {
    const binaryString = window.atob(base64);
    const length = binaryString.length;
    const arrayBuffer = new ArrayBuffer(length);
    const uint8Array = new Uint8Array(arrayBuffer);
  
    for (let i = 0; i < length; i++) {
      uint8Array[i] = binaryString.charCodeAt(i);
    }
  
    return arrayBuffer;
  };

  useEffect(()=>{
    if(message.type==='biasa'){
      setCanShow(true);
    }
    // getPrivateKey();
  }, [])

  const decryptingContent = async(content: ArrayBuffer, secretKey: string) => {
    const key = hashString(secretKey);
    const inputBuffer = arrayBufferToBase64(content);
    const temp = CryptoJS.enc.Base64.parse(inputBuffer).toString(CryptoJS.enc.Latin1).split('_');
    var cipherParams = CryptoJS.lib.CipherParams.create({
      ciphertext: CryptoJS.enc.Base64.parse(temp[0]),
      iv: CryptoJS.enc.Base64.parse(temp[1]),
      salt: CryptoJS.enc.Base64.parse(temp[2])
    });
    var plaintcontent = CryptoJS.AES.decrypt(cipherParams, key);
    const plaintArrayBuffer = base64ToArrayBuffer(plaintcontent.toString(CryptoJS.enc.Base64));
    return plaintArrayBuffer

}

const hashFile = async(content: File) => {
  const inputBuffer = await content.arrayBuffer();
  var wordArray = CryptoJS.lib.WordArray.create(inputBuffer);
  var hash = CryptoJS.SHA256(wordArray);
  return hash.toString(CryptoJS.enc.Base64)
}

const hashString = (s: string) => {
    var hash = CryptoJS.SHA256(s);
    return hash.toString(CryptoJS.enc.Base64)
}

const [receiverPrivate, setReceiverPrivate] = useState('');
const [secretKey, setSecretKey] = useState('');

const decryptingKey = (text: string) => {
  const seed = passphrase;
  const prng = forge.random.createInstance();
  prng.seedFileSync = () => seed
  const keyPair = forge.pki.rsa.generateKeyPair({ bits: 2048, prng, workers: 2 })
  const privateKey = keyPair.privateKey;
  const encrypted = forge.util.decode64(text);
  const decrypted = privateKey.decrypt(encrypted);
  setSecretKey(decrypted);
  setIsLoading(false);
}

// const getPrivateKey = () => {
//   axios.get(listOfUrl.getPrivateKey, {
//     headers: {
//       'Content-Type': 'application/json',
//       'Authorization': 'Bearer ' + tokens
//     },
//   }).then(response => {
//     setReceiverPrivate(response.data.privateKey);
//   }).catch(err => {
//       console.log(err.message);
//   });
// };

  const postCheckPassphrase = (passphrase: string) => {
    const jsonData = {
      passphrase: passphrase
    }
    axios.post(listOfUrl.checkPassphrase,jsonData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + tokens
      },
    }).then(response => {
      setCanShow(true);
      if(message.encKey){
        decryptingKey(message.encKey);
      }
    }).catch(err => {
        setWrongPas(true);
    });
  }
  const handleSubmit = () => {
    setIsLoading(true);
    postCheckPassphrase(passphrase);
  }

  const handleDownloadAttachment = () => {
    try {
        axios.get(listOfUrl.base+'/attachment/get/'+message.files[0].file, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + tokens
            },responseType: 'arraybuffer'
          }).then(async(response) => {
            if(message.type==='biasa'){
              const blob = new Blob([response.data], { type: 'application/octet-stream' });
              const link = document.createElement('a');
              link.href = window.URL.createObjectURL(blob);
              link.download = 'decrypted_from_'+message.files[0].name; // You can customize the downloaded file name
              link.click();
            }
            else{
              const dataDecrypt = await decryptingContent(response.data, secretKey);
              const blob = new Blob([dataDecrypt], { type: 'application/octet-stream' });
              const link = document.createElement('a');
              link.href = window.URL.createObjectURL(blob);
              link.download = 'decrypted_from_'+message.files[0].name; // You can customize the downloaded file name
              link.click();

            }
          }).catch(err => {
              console.log(err.message);
          });
  
      } catch (error) {
        console.error('Error downloading attachment:', error);
      }
  };

  return (
    <>
      {wrongPas?<>
        <Typography> Wrong passphrase </Typography>
      </>:<>
      </>}
      {canShow===false?
        <>
          <TextField
            label="passphrase"
            variant="outlined"
            margin="normal"
            fullWidth
            value={passphrase}
            onChange={(e) => setPassphrase(e.target.value)}
          />
          
            {isLoading?<>
              <Box sx={{ display: 'flex'}}>
                <Typography>Loading..</Typography>
              <CircularProgress />
            </Box>
            </>:<>
            <Button
            variant="outlined"
            color="primary"
            fullWidth
            onClick={handleSubmit}
            >
              {'Submit'}
            </Button>
            </>}
        </>
        :<><div>
        <Typography variant="h5">{message.message}</Typography>
        <Typography variant="body1">{message.type}</Typography>
        <Button variant="contained" color="primary" onClick={handleDownloadAttachment}>
          Download Attachment
        </Button>
      </div></>}
      
    </>
  );
};

export default MessageDetail;
