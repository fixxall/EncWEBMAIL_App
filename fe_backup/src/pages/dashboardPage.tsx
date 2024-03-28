import { Box, Button, CircularProgress, TextField, Typography } from "@mui/material"
import axios from "axios";
import { useEffect, useState } from "react";
import listOfUrl from "../configs/listOfUrl";
import { getAccessToken } from "../configs/auth";

interface ChallengeAdminPageProps{
    
}

const ChallengeAdminPage: React.FC<ChallengeAdminPageProps> = ({}) => {
    const [passphrase, setPassphrase] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [successChange, setSuccessChange] = useState(false);
    
    const gettoken = ()=>{
        const token = getAccessToken();
        if(token){
            setTokens(token);
        }
    }

    useEffect(() => {
        gettoken();
    },[])
    
    const [tokens, setTokens] = useState<string>('');
    const handleSubmit = () => {
        const jsonData = {
            newPassphrase: passphrase
        }
        setIsLoading(true);
        axios.post(listOfUrl.changePassphrase, jsonData, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + tokens
            },
          }).then(response => {
            setSuccessChange(true);
            setIsLoading(false);
          }).catch(err => {
              console.log(err.message);
          });
        setPassphrase('');
    }
    return (
    <>
        <Typography>Change passphrase:</Typography>
        
        <TextField
            label="new passphrase"
            variant="outlined"
            margin="normal"
            fullWidth
            value={passphrase}
            onChange={(e) => setPassphrase(e.target.value)}
            />
        <Button onClick={handleSubmit}>
            Submit
        </Button>
        {isLoading?
              <Box sx={{ display: 'flex'}}>
                <Typography>Loading..</Typography>
              <CircularProgress />
            </Box>:
            <>    
                {successChange?
                <Typography>Success Change passphrase</Typography>
                :
                <></>
                }
            </>
        }
    </>
    );
}

export default ChallengeAdminPage;