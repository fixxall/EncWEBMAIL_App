import { useEffect, useState } from "react";
import { getAccessToken } from "../configs/auth";
import { TextField, Button, Container, Paper, Select, MenuItem, InputLabel, FormControl, List, ListItem, ListItemText } from '@mui/material';
import axios from "axios";
import listOfUrl from "../configs/listOfUrl";
import MessageDetail from "./DetailMessagePage";


interface DraftPageProps{

}

const DraftPage: React.FC<DraftPageProps> = ({}) => {
    const [tokens, setTokens] = useState<string>('');
    const [listMessage, setListMessage] = useState<any[]>([]);
    const getAllMessage = () => {
    }

    const getDraftMessage = (token: string) => {
        axios.get(listOfUrl.getDraftMessage, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
          },
        }).then(response => {
            setListMessage(response.data.data);
        }).catch(err => {
            console.log(err.message);
        });
      };


    useEffect(() => {
        const token = getAccessToken();
        if(token){
            setTokens(token);
            getDraftMessage(token);
        }
    },[])

    const [selectedMessage, setSelectedMessage] = useState<any>({data: {}, value: false});


  const handleListItemClick = (message: any) => {
    setSelectedMessage({data:message, value: true});
  };

  const backToList = () => {
    setSelectedMessage({data:{}, value: false});
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} style={{ padding: 20 }}>
        {selectedMessage.value? 
        <>
            <MessageDetail message={selectedMessage.data} tokens={tokens} />
            <Button onClick={() => backToList()}>Back To List</Button>
        </>
        :<>
            <List>
            {listMessage.map((message) => (
                <ListItem sx={{cursor: "pointer"}} key={message.id} onClick={() => handleListItemClick(message)}>
                <ListItemText primary={message.message} />
                <ListItemText primary={message.type} />
                </ListItem>
            ))}
            </List>
        </>
        }
      </Paper>
    </Container>
  );
};


export default DraftPage;
