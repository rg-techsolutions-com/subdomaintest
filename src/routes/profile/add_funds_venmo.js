import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import OutlinedInput from '@mui/material/OutlinedInput';

import { useTheme } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import useMediaQuery from '@mui/material/useMediaQuery';

import qrcode from './../../shared/images/venmo_qr_code.jpg';

import UserService  from './../../services/user-service';

const AddFundsVenmo = () => {
  const [profileData, setProfileData] = useState([]);
  const [accountNamesData, setAccountNamesData] = useState([]);
  const [message, setMessage] = useState("");
  const [venmoUsername, setVenmoUsername] = useState("");
  const [displayMode, setDisplayMode] = useState('loaded');
  const [displayInstructions, setDisplayInstructions] = useState(false);
    
  const theme = useTheme();
  const isBelowLg = useMediaQuery(theme.breakpoints.down(1200));  
  const isBelowSm = useMediaQuery(theme.breakpoints.down(600));
  let px = 10;
  if (isBelowLg) {
    px = 3;
  }
  let my = 4;
  if (isBelowSm) {
    my = 1;
  }

  useEffect(() => {
    document.title = "DIYSE Add Funds Venmo";
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setDisplayMode('loading');
      UserService.getAccountNamesData()
      .then(
        (response) => {
          if (response) {
            setAccountNamesData(response.data);
          }
        }
      );
      UserService.getProfileData()
      .then(
        (response) => {
          if (response) {
            setDisplayMode('loaded');
            setProfileData(response.data);
          }
        }
      );
    };
    fetchData();
  }, []);

  const clearVenmoUsername = () => {
    setVenmoUsername("");
    setAccountNamesData({'accounts':{}});
  };

  const changeVenmoUsername = (e) => {
    setVenmoUsername(e.target.value);
  };

  const openDisplayInstructions = () => {
    setDisplayInstructions(true);
    UserService.setAccountType('venmo')
    .then(
      (response) => {
        //
      }
    );    
  };

  const handleSetVenmoUsername = (e) => {
    setDisplayMode('loading');
    UserService.addAccountNameData('venmo', venmoUsername)
    .then(
      (response) => {
        if (response) {
          setDisplayMode('loaded');
          setAccountNamesData(response.data);
          setMessage("");
        }
      }
    );
  };

  return (
    <Box className={displayMode} sx={{ my, px, color: 'text.primary' }}>
      <Box>
        <IconButton LinkComponent={Link} to={{ pathname: '/add_funds' }}>
          <ArrowBackIosIcon />
          <Typography sx={{ fontSize: isBelowSm ? 12 : 18, fontWeight: 500 }}>
            ADD FUNDS
          </Typography>
        </IconButton>
        <Typography
          sx={{ mt: 4, fontSize: isBelowSm ? 20 : 32, fontWeight: 700 }}
        >
          Adding Funds with Venmo
        </Typography>

          {profileData.certify === true && (
            <>
              {accountNamesData && accountNamesData['accounts'] && !accountNamesData['accounts']['venmo'] && (
                <>
                  <Box>
                    <Box sx={{ mt:2, mb:2, marginLeft:'auto', marginRight:'auto', width: isBelowSm? '100%' : '50%' }}>
                      <Typography color="primary" sx={{ fontWeight: 700, fontSize: 15, textTransform: 'uppercase'}}>ADD YOUR VENMO USERNAME</Typography>
                      <OutlinedInput
                        fullWidth
                        id="venmo_username"
                        onChange={changeVenmoUsername}
                        value={venmoUsername}
                        placeholder="@Username"
                        aria-describedby="add venmo username "
                      />
                      {message &&(
                        <Box role="alert">
                          <Typography variant="h6" component="div" sx={{ flexGrow: 1, mt: 1, fontWeight: 400, lineHeight: "21.86px", fontSize: 16}} color="error.main">
                           {message.ErrorDisplayNameMessage}
                          </Typography>
                        </Box>
                      )}
                      <Button variant="contained" onClick={(e) => handleSetVenmoUsername(e) } sx={{ mt:1, backgroundColor: 'primary.blue', color: 'white', '&:hover': { backgroundColor: 'primary.blue', color: 'white',},}}>SAVE VENMO USERNAME</Button>            
                    </Box>
                    <Typography>
                      We need your Venmo username to ensure that we match your Venmo deposit to your DIYSE account. 
                      You can find your Venmo username by following the instructions here: <a href="https://help.venmo.com/hc/en-us/articles/235432448-Check-or-Edit-Your-Username" target="_new">Find your Venmo Username</a>
                    </Typography>
                  </Box>
                </>
              )}
              {accountNamesData && accountNamesData['accounts'] && accountNamesData['accounts']['venmo'] && (
                <Box>
                  <Typography sx={{ mt:2, fontSize: isBelowSm ? 14 : 18, fontWeight: 500 }}>
                    Your Venmo username is: { accountNamesData['accounts']['venmo'] }
                  </Typography>
                  <Box>
                    <Button variant="contained" onClick={(e) => openDisplayInstructions() } sx={{ mt:1, backgroundColor: 'primary.blue', color: 'white', '&:hover': { backgroundColor: 'primary.blue', color: 'white',},}}>ADD FUNDS WITH THIS ACCOUNT</Button>            
                  </Box>
                  
                  {displayInstructions === true && (
    
                    <Box sx={{mt:2}}>
                      <Typography sx={{mb:2}}>
                        You can scan the QR code below to open the Venmo app and send funds to <b>@DIYSE</b>:                  
                      </Typography>
                      <img alt="Venmo QR Code" src={qrcode} />
                      
                      <Typography>
                        (If you are viewing this on a mobile device, you can try to tap and hold on the QR code until and option to open the link appears.)
                      </Typography>
                      
                      <Typography sx={{mt:3}}>
                        Or you can follow the steps below to add funds:
                      </Typography>
                                            
                      <ol>
                        <li>Open the Venmo App</li>
                        <li>Tap the menu icon in the top-left corner</li>
                        <li>Select <b>Search People</b></li>
                        <li>Search for the username: <b>@DIYSE</b></li>
                        <li>Tap <b>Pay or Request</b> and use the Pay option to send the amount to fund your DIYSE account</li>
                      </ol>
                      
                      <Typography sx={{mt:2}}>
                        Note that funds may take 1-2 business days to appear in your DIYSE account.
                      </Typography>
                    </Box>
                  )}
                  
                  {displayInstructions === false && (
                    <>
                      <Typography sx={{ mt:4, fontSize: isBelowSm ? 14 : 16 }}>
                        If this is not your Venmo username, you can change it:
                      </Typography>
                      <>
                        <Button variant="contained" onClick={(e) => clearVenmoUsername() } sx={{ mt:1, backgroundColor: 'primary.blue', color: 'white', '&:hover': { backgroundColor: 'primary.blue', color: 'white',},}}>CHANGE VENMO USERNAME</Button>            
                      </>
                    </>
                  )}
                </Box>
              )}
              
              
            </>
          )}
          {profileData.certify !== true && (
            <Box textAlign="center">
              <Box>
                This user account is not able to add funds.            
              </Box>
            </Box>
          )}
      </Box>
    </Box>
  );
};

export default AddFundsVenmo;
