import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
//import Button from '@mui/material/Button';

import { useTheme } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import useMediaQuery from '@mui/material/useMediaQuery';

import UserService  from './../../services/user-service';

const AddFunds = () => {
  const [profileData, setProfileData] = useState([]);
  
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
    document.title = "DIYSE Add Funds Zelle";
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      UserService.getProfileData()
      .then(
        (response) => {
          if (response) {
            setProfileData(response.data);
          }
        });
    };
    fetchData();
  }, []);

  return (
    <Box sx={{ my, px, color: 'text.primary' }}>
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
          Adding Funds with Zelle
        </Typography>

          {profileData.certify === true && (
            <>
              <Box sx={{mt:2}}>
                <Typography sx={{mb:2}}>
                  Adding funds with Zelle is a two-step process:                  
                </Typography>
                  
                <Typography>
                  <b>Step One - Send the Deposit</b>
                </Typography>
                <Typography>
                  Send the amount to deposit to the DIYSE Zelle account from your banking website. 
                  The process may be slightly different depending on your bank, but in general:
                </Typography>
                
                <ol>
                  <li>Select <b>Business</b> as the type of account</li>
                  <li>Type in <b>DIYSE User Reserve LLC</b> as the business name</li>
                  <li>Depending on your banking website, either enter <b>zelle@mydiyse.com</b> as the email address, or enter <b>4660 0907 5337</b> as the account number</li>
                  <li>In the <b>Message</b> section, enter your e-mail address that you used to register and a phone number where you can be reached</li>
                </ol>
                
                <Typography>
                  <b>Step Two - Notify Us</b>
                </Typography>
                <Typography>
                  Contact us via our customer support website at: <a style={{ color: 'RoyalBlue' }} href="https://support.mydiyse.com/support/tickets/new" target="_new">https://support.mydiyse.com/support/tickets/new</a>
                </Typography>
                <Typography>
                  In the <b>Subject</b> line, enter <b>Zelle Deposit</b>. Enter your e-mail address that you used to register, and in the <b>Description</b> include the phone number where you can be reached and the amount of the deposit.
                </Typography>
                
                <Typography sx={{mt:3}}>
                  We attempt to deposit your funds into your DIYSE account within 1-2 business days.
                </Typography>
                  
                  
                <Typography sx={{mt:3}}>
                  Note that not all banks support Zelle. You can find a list of supporting banks at: <a style={{ color: 'RoyalBlue' }} href="https://www.zellepay.com/get-started" target="_new">https://www.zellepay.com/get-started</a>
                </Typography>
              </Box>
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

export default AddFunds;
