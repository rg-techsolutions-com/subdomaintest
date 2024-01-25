import React, { useEffect } from "react";
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

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

const AddFunds = () => {

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
    document.title = "DIYSE Withdraw Funds";
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
          Withdrawing Funds
        </Typography>

        <>
          <Box sx={{mt:2}}>
            <Typography sx={{mb:2}}>
              Withdrawing funds is a two-step process:                  
            </Typography>
              
            <Typography>
              <b>Step One - Choose Your Method</b>
            </Typography>
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
                      <TableCell align="left"><Typography sx={{ fontWeight:700}}>Time to Complete</Typography></TableCell>
                      <TableCell align="left"><Typography sx={{ fontWeight:700}}>Fees</Typography></TableCell>
                    </TableRow>
                  </thead>
                  <TableBody>
                    <TableRow>
                      <TableCell align="left">
                        <Box>
                          PayPal
                        </Box>
                      </TableCell>
                      <TableCell align="left">A few days</TableCell>
                      <TableCell align="left">3.49% of withdrawal amount plus $0.49</TableCell>
                    </TableRow>    
                    <TableRow>
                      <TableCell align="left">
                        <Box>
                          Venmo
                        </Box>
                      </TableCell>
                      <TableCell align="left">A few days</TableCell>
                      <TableCell align="left">None</TableCell>
                    </TableRow>    
                    <TableRow>
                      <TableCell align="left">
                        <Box>
                          Zelle (Bank Transfer) **
                        </Box>
                      </TableCell>
                      <TableCell align="left">A few days</TableCell>
                      <TableCell align="left">None</TableCell>
                    </TableRow>    
                    <TableRow>
                      <TableCell align="left">
                        <Box>
                          Mailed Check
                        </Box>
                      </TableCell>
                      <TableCell align="left">A few weeks</TableCell>
                      <TableCell align="left">None</TableCell>
                    </TableRow>    
                  </TableBody>
                </Table>
              </TableContainer>
              <Typography sx={{mt:2}}>
                Note that we cannot transfer funds to a credit card.
              </Typography>
            </>
            
            <Typography sx={{mt:3}}>
              <b>Step Two - Notify Us</b>
            </Typography>
            <Typography>
              Contact us via our customer support website at: <a style={{ color: 'RoyalBlue' }} href="https://support.mydiyse.com/support/tickets/new" target="_new">https://support.mydiyse.com/support/tickets/new</a>
            </Typography>
            <Typography>
              In the <b>Subject</b> line, enter <b>Withdraw</b>. Enter your e-mail address that you used to register, and in the <b>Description</b> include your full street address with ZIP/postal code, 
              phone number where you can be reached and the requested withdrawal amount along with the method you would like to receive it. For Zelle and Paypal, we will need
              the email address for your respective accounts, if they are different than the email address used for DIYSE registration.
            </Typography>
            
            <Typography sx={{mt:3}}>
              We attempt to process your withdrawal request within 5-10 business days. Our support team will contact you during the process.
            </Typography>
              
              
            <Typography sx={{mt:3}}>
              ** Note that not all banks support Zelle. You can find a list of supporting banks at: <a style={{ color: 'RoyalBlue' }} href="https://www.zellepay.com/get-started" target="_new">https://www.zellepay.com/get-started</a>
            </Typography>
          </Box>
        </>
      </Box>
    </Box>
  );
};

export default AddFunds;
