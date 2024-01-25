import React, { useState, useEffect } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';

import { useTheme } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import useMediaQuery from '@mui/material/useMediaQuery';

import UserService  from './../../services/user-service';
import history from './../../services/history';
import settings from './../../services/settings';

const AddFundsPaypal = () => {

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
  
  const [diyseOrderID, setDiyseOrderID] = useState("");
  const [displayMode, setDisplayMode] = useState('loaded');
  
  const [valueToAdd, setValueToAdd] = useState("10.00");
  const [displayPaypalButtons, setDisplayPaypalButtons] = useState(false);
  const [successPopup, setSuccessPopup] = useState(false);
  const [errorPopup, setErrorPopup] = useState(false);
  const [profileData, setProfileData] = useState([]);
  
  useEffect(() => {
    document.title = "DIYSE Add Funds Paypal/Credit Card";
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setDisplayMode('loading');
      UserService.getProfileData()
      .then(
        (response) => {
          if (response) {
            setProfileData(response.data);
            UserService.getFundingOrderID()
            .then(
              (response) => {
                if (response) {
                  setDiyseOrderID(response.data.diyse_order_id);
                  setDisplayMode('loaded');
                }
              });
          }
        });
    };
    fetchData();
  }, []);

  const handleDepositChange = (e) => {
    e.preventDefault();
    setDisplayPaypalButtons(false);
    let text = e.target.value.toString();
    let index = text.indexOf(".");
    let decimal_places = index === -1 ? 0 : (text.length - index - 1);
    if (decimal_places > 2) {
      return;
    }
    let tmp_amount = parseFloat(e.target.value);
    if (tmp_amount > 5) {
      setValueToAdd(tmp_amount);
    } else {
      setValueToAdd(tmp_amount);
    }
  };
  
  const handleTotalButton = () => {
    setDisplayPaypalButtons(true);
  };

  const handlePaypalError = (err) => {
    console.log(err);
    setErrorPopup(true);
  };

  const handleViewBalance = () => {
    history.push("/account_balance");
  };

  const handleCheckConnection = () => {
    UserService.getProfileData()
    .catch((e) => {
      if (e.response) {
        history.push('/login');
      }
    });
  };

  const handlePaypalSubmit = (type, details) => {
    UserService.sendFundingDetails(diyseOrderID, type, details)
    .then((response) => {
      setSuccessPopup(true);
    })
    .catch(err => {
      console.log(err.data);
    });    
  };
  
  const createOrder = (data, actions) => {
    let request_data = {
        purchase_units: [
            {
              amount: {
                  value: valueToAdd,
              },
              custom_id: diyseOrderID,
            },
        ],
        application_context: {
          shipping_preference: "NO_SHIPPING"
        }        
    };
    let return_data = actions.order.create(request_data)
    .catch(function(err) { console.log(err)});
    return return_data;
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
            Add Funds
          </Typography>
        </Box>
       {profileData.certify === true && (
        <>
          <Box>
            <Typography color="primary" sx={{ fontWeight: 400, fontSize: 14, pb:4, display: 'inline' }}>Added funds will appear in your </Typography>
            <Typography color="primary"  component={Link} to={{ pathname: `/account_balance` }} sx={{ fontWeight: 400, fontSize: 14, pb:4, display: 'inline', color:'RoyalBlue' }}>Account Balance</Typography>
            <Typography color="primary" sx={{ fontWeight: 400, fontSize: 14, pb:4, display: 'inline' }}>.</Typography>
          </Box>
  
          <Box textAlign="center">
            <Box sx={{ mb:1, pb:3}}>
              <Typography color="primary" sx={{ fontWeight: 400, fontSize: 18, pb:1 }}>Amount to add to your DIYSE Account: </Typography>
              <FormControl>
                <OutlinedInput 
                  placeholder="Enter a dollar value to deposit" 
                  value={valueToAdd}
                  id="create-contest-name" 
                  type="number"
                  startAdornment={<InputAdornment position="start">$</InputAdornment>}
                  onChange={(event) => {handleDepositChange(event)}}            
                  required />
              </FormControl>
              {valueToAdd < 5 &&
                <Typography color="primary" sx={{ fontWeight: 400, fontSize: 18, pb:1, mt:1 }}>Minimum deposit amount is $5.00</Typography>
              }
              {valueToAdd >= 5 &&
                <Box sx={{ mt:1, pb:3}}>
                  <Button variant="contained" onClick={(e) => handleTotalButton() } sx={{ width: isBelowSm? '100%' : '50%', backgroundColor: 'primary.blue', color: 'white', '&:hover': { backgroundColor: 'primary.blue', color: 'white',},}}>Total Amount to be Charged: ${valueToAdd}</Button>                
                </Box>
              }
            </Box>
  
            {displayPaypalButtons !== false &&
              <PayPalScriptProvider options={{ "client-id": settings.paypal_client_id }}>
                <Box sx={{ backgroundColor:'white', px:2, py:2 }}>
                  <PayPalButtons
                      createOrder={(data, actions) => createOrder(data, actions)}
                      onApprove={(data, actions) => {
                          return actions.order.capture().then((details) => {
                              handlePaypalSubmit('paypal', details);
                          });
                      }}
                      onError = {(err) => handlePaypalError(err)}
                      onClick = {(data, actions) => handleCheckConnection()}
                      onInit = {(data, actions) => handleCheckConnection()}
                  />
                </Box>
              </PayPalScriptProvider>
            }        
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

      {successPopup  && (
        <Dialog
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={successPopup}
          maxWidth={"lg"}          
        >
          <DialogContent dividers={true}>        
            <Box item md={12} >
              <Typography variant="h1" component="div" sx={{ flexGrow: 1, fontWeight: 700, fontSize: 24 }} color="primary">
                Transaction Pending
              </Typography>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1, mt: 2, fontWeight: 400, fontSize: 16}} color="primary">
                Your total charge amount of ${valueToAdd ? parseFloat(valueToAdd).toFixed(2) : ''} has been processed and will be deposited in your account balance in the next few minutes. 
                Note that the transaction may initially appear as pending.
              </Typography>
              <Box textAlign="center" sx={{ mt:1 }}>
                <Button variant="contained" onClick={(e) => handleViewBalance() } sx={{ width: isBelowSm? '100%' : '50%', backgroundColor: 'primary.blue', color: 'white', '&:hover': { backgroundColor: 'primary.blue', color: 'white',},}}>VIEW ACCOUNT BALANCE</Button>                              
              </Box>
            </Box>
          </DialogContent>
        </Dialog>
      )}    
      
      {errorPopup  && (
        <Dialog
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={errorPopup}
          maxWidth={"lg"}          
        >
          <DialogContent dividers={true}>        
            <Box item md={12} >
              <Typography variant="h1" component="div" sx={{ flexGrow: 1, fontWeight: 700, fontSize: 24 }} color="primary">
                Transaction Failed
              </Typography>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1, mt: 2, fontWeight: 400, fontSize: 16}} color="primary">
                An error occured when processing the transaction. The transaction did not complete, and no funds were transferred.
              </Typography>
              <Box textAlign="center" sx={{ mt:1 }}>
                <Button variant="contained" onClick={(e) => handleViewBalance() } sx={{ width: isBelowSm? '100%' : '50%', backgroundColor: 'primary.blue', color: 'white', '&:hover': { backgroundColor: 'primary.blue', color: 'white',},}}>TRY AGAIN</Button>                              
              </Box>
            </Box>
          </DialogContent>
        </Dialog>
      )}      
    </Box>
  );
};

export default AddFundsPaypal;
