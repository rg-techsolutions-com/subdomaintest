import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import Paper from '@mui/material/Paper';

import { useTheme } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import useMediaQuery from '@mui/material/useMediaQuery';

import history from './../../services/history';
import UserService  from './../../services/user-service';

const AddFunds = () => {
  const [profileData, setProfileData] = useState([]);
  const [displayMode, setDisplayMode] = useState('loaded');  
  
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
    document.title = "DIYSE Add Funds";
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setDisplayMode('loading');
      UserService.getProfileData()
      .then(
        (response) => {
          if (response) {
            setProfileData(response.data);
            setDisplayMode('loaded');
          }
        });
    };
    fetchData();
  }, []);

  const handlePaypalButton = () => {
    history.push("/add_funds_paypal");
  };

  const handleVenmoButton = () => {
    history.push("/add_funds_venmo");
  };

  return (
    <Box className={displayMode} sx={{ my, px, color: 'text.primary' }}>
      <Box>
        <IconButton LinkComponent={Link} to={{ pathname: '/profile' }}>
          <ArrowBackIosIcon />
          <Typography sx={{ fontSize: isBelowSm ? 12 : 18, fontWeight: 500 }}>
            PROFILE
          </Typography>
        </IconButton>
        <Typography
          sx={{ mt: 4, fontSize: isBelowSm ? 20 : 32, fontWeight: 700 }}
        >
          Add/Withdraw Funds
        </Typography>

          {profileData.certify !== true && (
            <>
              <Box>
                <Typography
                  sx={{ mt: 4, fontSize: isBelowSm ? 16 : 24, fontWeight: 700 }}
                >              
                  Adding Funds
                </Typography>
              </Box>
              <Box textAlign="center">
                <Typography color="primary" sx={{mt: 1, fontWeight: 600, fontSize: 18, textDecoration: "none", textAlign: "center" }}>You cannot add funds to your account due to your Age and Eligibility settings.</Typography>
                <Typography  component={Link} to={{ pathname: `/eligibility` }} sx={{mt: 1, fontWeight: 600, fontSize: 18, textDecoration: "none", textAlign: "center" }}>View your Settings</Typography>
              </Box>
            </>
          )}

          {profileData.certify === true && (
            <>
              <Box>
                <Typography
                  sx={{ mt: 4, fontSize: isBelowSm ? 16 : 24, fontWeight: 700 }}
                >              
                  Adding Funds
                </Typography>
              </Box>
              <Box textAlign="center">
                <>
                  <TableContainer
                    component={Paper}
                    sx={{
                      background: 'transparent',
                      boxShadow: 'none',
                    }}
                  >
                    <Table
                      sx={{
                        '& td': {
                          fontWeight: 500,
                          fontSize: isBelowSm ? 15 : 18,
                          borderColor: 'rgba(97, 103, 113, 0.2)',
                        },
                      }}
                    >
                      <thead>
                        <TableRow>
                          <TableCell align="left"><Typography sx={{ fontWeight:700}}>Method</Typography></TableCell>
                          <TableCell align="left"><Typography sx={{ fontWeight:700}}>Approximate Time to Complete</Typography></TableCell>
                        </TableRow>
                      </thead>
                      <TableBody>
                        <TableRow>
                          <TableCell align="left">
                            <Button variant="contained" onClick={(e) => handlePaypalButton() } sx={{ width:'50%', backgroundColor: 'primary.blue', color: 'white', '&:hover': { backgroundColor: 'primary.blue', color: 'white',},}}>Paypal</Button>
                          </TableCell>
                          <TableCell align="left">A few minutes</TableCell>
                        </TableRow>    
                        <TableRow>
                          <TableCell align="left">
                            <Button variant="contained" onClick={(e) => handlePaypalButton() } sx={{ width:'50%', backgroundColor: 'primary.blue', color: 'white', '&:hover': { backgroundColor: 'primary.blue', color: 'white',},}}>Credit Card (via Paypal)</Button>
                          </TableCell>
                          <TableCell align="left">A few minutes</TableCell>
                        </TableRow>    
                        <TableRow>
                          <TableCell align="left">
                            <Button variant="contained" onClick={(e) => handleVenmoButton() } sx={{ width:'50%', backgroundColor: 'primary.blue', color: 'white', '&:hover': { backgroundColor: 'primary.blue', color: 'white',},}}>Venmo</Button>
                          </TableCell>
                          <TableCell align="left">1-2 Business Days</TableCell>
                        </TableRow>    
                        <TableRow>
                          <TableCell align="left">
                            <Button variant="contained" component={Link} to={{ pathname: `/add_funds_zelle` }} sx={{ width:'50%', backgroundColor: 'primary.blue', color: 'white', '&:hover': { backgroundColor: 'primary.blue', color: 'white',},}}>Zelle (Bank Transfer)</Button>
                          </TableCell>
                          <TableCell align="left">1-2 Business Days</TableCell>
                        </TableRow>    
                        <TableRow>
                          <TableCell align="left">
                            <Button variant="contained" component={Link} to={{ pathname: `/add_funds_wire` }} sx={{ width:'50%', backgroundColor: 'primary.blue', color: 'white', '&:hover': { backgroundColor: 'primary.blue', color: 'white',},}}>Wire Transfer</Button>
                          </TableCell>
                          <TableCell align="left">Up to 10 Business Days</TableCell>
                        </TableRow>    
                      </TableBody>
                    </Table>
                  </TableContainer>
                </>
              </Box>
            </>
          )}
          {profileData.certify === false && (
            <Box textAlign="center">
              <Box>
                This user account is not able to add funds.            
              </Box>
            </Box>
          )}
          <>
            <Box>
              <Typography
                sx={{ mt: 4, fontSize: isBelowSm ? 16 : 24, fontWeight: 700 }}
              >              
                Withdrawing Funds
              </Typography>
            </Box>
            <Box textAlign="center">          
              <Button variant="contained" component={Link} to={{ pathname: `/withdraw_funds` }} sx={{ backgroundColor: 'primary.blue', color: 'white', '&:hover': { backgroundColor: 'primary.blue', color: 'white',},}}>Withdraw Funds</Button>            
            </Box>
            
            <Box>
              <Typography sx={{ mt:5, fontSize:12 }}>
                Declaration and payment of all income taxes associated with contest winnings are the sole responsibility of the
                contest winner, and failure to pay applicable tax liabilities may result in civil penalties or criminal liability. DIYSE 
                collects and issues tax forms to customers with reportable income of at least $600 in any calendar
                year to comply with informational tax reporting requirements.
              </Typography>
            </Box>
          </>
      </Box>
    </Box>
  );
};

export default AddFunds;
