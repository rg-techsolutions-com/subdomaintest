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
          Adding Funds with a Wire Transfer
        </Typography>

          {profileData.certify === true && (
            <>
              <Box sx={{mt:2}}>
                <Typography sx={{mb:2}}>
                  Adding funds with a wire transfer is a two-step process:                  
                </Typography>
                  
                <Typography>
                  <b>Step One - Wire the Deposit</b>
                </Typography>
                <Typography>
                  Send the amount to deposit using your banking website or branch. 
                  The process may be slightly different depending on your bank, but the DIYSE banking details are:
                </Typography>
                
                <ul>
                  <li>Bank Name: Bank of America</li>
                  <li>Account Holder Name: DIYSE User Reserve LLC</li>
                  <li>Account Number: 4660 0907 5337</li>
                  <li>Wire Transfer Routing Number: 026009593</li>
                  <li>SWIFT Number: BOFAUS3N</li>
                </ul>
                
                <Typography>
                  Note that wire transfers must be in US Dollar currency. We do not accept foreign currency exchange. 
                  Your bank will likely charge you a wire transfer fee, which you are responsible for paying.
                </Typography>
                                
                
                <Typography sx={{mt:2}}>
                  <b>Step Two - Notify Us</b>
                </Typography>
                <Typography>
                  Contact us via our customer support website at: <a style={{ color: 'RoyalBlue' }} href="https://support.mydiyse.com/support/tickets/new" target="_new">https://support.mydiyse.com/support/tickets/new</a>
                </Typography>
                <Typography>
                  In the <b>Subject</b> line, enter <b>Wire Deposit</b>. Enter your e-mail address that you used to register, and in the <b>Description</b> include the phone number where you can be reached and the date and amount of the deposit.
                  In addition, enter your bank and account holder name.
                </Typography>
                
                <Typography sx={{mt:3}}>
                  We attempt to deposit your funds into your DIYSE account within 1-2 business days of receiving the wire, which may take several business days depending on the bank.
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
