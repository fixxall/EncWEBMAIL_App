import { useEffect, useState } from "react";
import { getAccessToken } from "../configs/auth";
import { TextField, Button, Container, Paper, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import axios from "axios";
import listOfUrl from "../configs/listOfUrl";
import * as forge from 'node-forge';
import * as CryptoJS from 'crypto-js';
import * as fs from 'fs';

interface CreateMessageProps{

}

const CreateMessage: React.FC<CreateMessageProps> = ({}) => {
    const [tokens, setTokens] = useState<string>('');
    
    const [receiverEmail, setReceiverEmail] = useState('');
    const [passphrase, setPassphrase] = useState('');
    const [message, setMessage] = useState('');
    const [attachment, setAttachment] = useState<File | null>(null);
    const [messageType, setMessageType] = useState('biasa');
    const [messageSent, setMessageSent] = useState(false);
    const [receiverPublic, setReceiverPublic] = useState('');
    const [secretKey, setSecretKey] = useState('');
    
    
    const gettoken = ()=>{
        const token = getAccessToken();
        if(token){
            setTokens(token);
        }
    }

    useEffect(() => {
        gettoken();
        const seckey = generateRandomString(16);
        setSecretKey(seckey);
    },[])
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
    function generateRandomString(length: number): string {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
    
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            result += characters.charAt(randomIndex);
        }
    
        return result;
    }

    const encryptingContent = async(content: File, secretKey: string) => {
        const key = hashString(secretKey);
        const inputBuffer = await content.arrayBuffer();
        var wordArray = CryptoJS.lib.WordArray.create(inputBuffer);
        var encrypted = CryptoJS.AES.encrypt(wordArray, key);
        var ciphertext = encrypted.ciphertext.toString(CryptoJS.enc.Base64)+'_'+encrypted.iv.toString(CryptoJS.enc.Base64)+'_'+encrypted.salt.toString(CryptoJS.enc.Base64)
        const encryptedArrayBuffer = base64ToArrayBuffer(CryptoJS.enc.Base64.stringify(CryptoJS.enc.Latin1.parse(ciphertext)));
        const encryptedBlob = new Blob([encryptedArrayBuffer], { type: 'application/octet-stream' });
        const encFile: File = new File([encryptedBlob], 'enc_'+content.name, { type: 'application/octet-stream' });
        return encFile;

    }
    
    const hashString = (s: string) => {
        var hash = CryptoJS.SHA256(s);
        return hash.toString(CryptoJS.enc.Base64)
    }
    const hashFile = async(content: File) => {
        const inputBuffer = await content.arrayBuffer();
        var wordArray = CryptoJS.lib.WordArray.create(inputBuffer);
        var hash = CryptoJS.SHA256(wordArray);
        return hash.toString(CryptoJS.enc.Base64)
    }

    const encryptingKey = (text: string) => {
        const publicKey = forge.pki.publicKeyFromPem(receiverPublic);
        const encrypted = publicKey.encrypt(text);
        return forge.util.encode64(encrypted);
    }
  const postUploadFile = async() => {
    const formData = new FormData();
    if(attachment){
        if(messageType === 'biasa'){
            formData.append("file", attachment);
            formData.append("name", attachment.name);
            const fileHash = await hashFile(attachment);
            axios.post(listOfUrl.uploadAttachment, formData,{
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': 'Bearer ' + tokens,
                },
                }).then(response => {
                    const attachmentId = response.data.id;
                    postCreateMessage(attachmentId.toString(), fileHash);
                }).catch(err => {
            
                });
        }
        else{
            const encFile: File = await encryptingContent(attachment, secretKey);
            const fileHash = await hashFile(attachment);
            formData.append("file", encFile);
            formData.append("name", encFile.name);
            axios.post(listOfUrl.uploadAttachment, formData,{
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': 'Bearer ' + tokens,
                },
                }).then(response => {
                    const attachmentId = response.data.id;
                    postCreateMessage(attachmentId.toString(), fileHash);
                }).catch(err => {
            
                });
        }
    }
  }
    const postCreateMessage = (attachmentId: string, fileHash: string) => {
        const jsonData = {
            receiver:receiverEmail,
            message:message,
            type:messageType,
            attachmentId: attachmentId,
            fileHash: fileHash,
            encKey: encryptingKey(secretKey),
        };
        axios.post(listOfUrl.createMessage, jsonData, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + tokens
          },
        }).then(response => {
            // const accessToken = response.data.accessToken;
            
            setMessageSent(true);
        }).catch(err => {
            console.log(err.message);
        });
      };
      const getPublicKey = (receiverEmail: string) => {
        const jsonData = {
            receiver:receiverEmail,
        };
        axios.post(listOfUrl.getPublicKey, jsonData, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + tokens
          },
        }).then(response => {
            setReceiverPublic(response.data.publicKey);
        }).catch(err => {
            console.log(err.message);
        });
      };

    const handleSendMessage = ()=>{
        getPublicKey(receiverEmail);
        if(attachment){
            postUploadFile();
        }
    }

    const handleAttachmentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;

        if (files && files.length > 0) {
            const selectedFile = files[0];
            setAttachment(selectedFile);
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Paper elevation={3} style={{ padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <form>
                <TextField
                label="Receiver Email"
                variant="outlined"
                margin="normal"
                fullWidth
                value={receiverEmail}
                onChange={(e) => setReceiverEmail(e.target.value)}
                />
                <TextField
                label="Message"
                variant="outlined"
                margin="normal"
                fullWidth
                multiline
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                />
                <input
                type="file"
                placeholder="..."
                accept=".pdf, .doc, .docx, .jpg, .jpeg, .png"
                onChange={handleAttachmentChange}
                style={{ margin: '15px 0' }}
                />
                <FormControl fullWidth variant="outlined" margin="normal">
                <InputLabel id="message-type-label">Message Type</InputLabel>
                <Select
                    label="Message Type"
                    labelId="message-type-label"
                    value={messageType}
                    onChange={(e) => setMessageType(e.target.value as string)}
                >
                    <MenuItem value="biasa">Biasa</MenuItem>
                    <MenuItem value="rahasia">Rahasia</MenuItem>
                    <MenuItem value="sangat_rahasia">Sangat Rahasia</MenuItem>
                </Select>
                </FormControl>
                <>
                {/* {messageType!=='biasa'?
                    <TextField
                    label="passphrase"
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    value={passphrase}
                    onChange={(e) => setPassphrase(e.target.value)}
                    />:<></>} */}
                </>
                <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleSendMessage}
                disabled={messageSent}
                >
                {messageSent ? 'Sucess Send Message' : 'Send Mail'}
                </Button>
            </form>
            </Paper>
        </Container>
  );
}

export default CreateMessage;