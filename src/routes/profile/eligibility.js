import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import FormControl from '@mui/material/FormControl';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';

import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

import { useTheme } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import useMediaQuery from '@mui/material/useMediaQuery';

import UserService  from './../../services/user-service';
import history from './../../services/history';

const Eligibility = () => {

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

  const [overEighteen, setOverEighteen] = useState(false);
  const [certify, setCertify] = useState(false);
  const [showCertify, setShowCertify] = useState(false);
  const [showSetupText, setShowSetupText] = useState(false);
  const [displayMode, setDisplayMode] = useState('loaded');  
  const [showAgreement, setShowAgreement] = useState(false);
  
  useEffect(() => {
    document.title = "DIYSE Age and Eligibility";
    setDisplayMode('loading');
  }, []);
  
  const handleAgreementOpen = () => {
    setShowAgreement(true);
  };

  const handleAgreementClose = () => {
    setShowAgreement(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      UserService.getProfileData()
      .then(
        (response) => {
          if (response) {
            setDisplayMode('loaded');
            if (response.data.over_eighteen === true) {
              setOverEighteen("yes");
              setShowCertify(true);
              if (response.data.certify === null) {
                setShowSetupText(true);
              }
            }
            if (response.data.over_eighteen === false) {
              setOverEighteen("no");
              setShowCertify(false);
            }
            if (response.data.certify === true) {
              setCertify("yes");
            }
            if (response.data.certify === false) {
              setCertify("no");
            }
          }
        });
    };
    fetchData();
  }, []);

  const handleOverEighteen = (event) => {
    setOverEighteen(event.target.value);
    if (event.target.value === "no") {
      setShowCertify(false);
    }
    if (event.target.value === "yes") {
      setShowCertify(true);
    }
  };

  const handleCertify = (event) => {
    setCertify(event.target.value);
  };

  const saveSettings = () => {
    setDisplayMode('loading');
    let over_eighteen = true;
    if (overEighteen === 'no') {
      over_eighteen = false;
    }
    let a_certify = true;
    if (certify === 'no') {
      a_certify = false;
    }

    UserService.sendAgeAndCertifyData(over_eighteen, a_certify)
    .then(
    (response) => {
      if (response) {
        setDisplayMode('loaded');
        if (showSetupText) {
          history.push("/contests");
        } else {
          history.push("/profile");
        }
      }
    });
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
          Age and Eligibility
        </Typography>

        <Box>
          <Box sx={{ml:'auto', mr:'auto', width: isBelowSm ? 'auto' : '50%' }}>
        
          {showSetupText && (
            <>
              <Typography variant="h4" sx={{mt:2, mb:1}}>
                Welcome to DIYSE!
              </Typography>          
              <Typography variant="h5" sx={{mb:1}}>
                Before starting, please complete the following contest eligibility question.
              </Typography>          
            </>
          )}
        
          {!showSetupText && (
            <>
              <FormControl fullWidth sx={{mt:4}}>
                  <Typography sx={{mb:1, fontWeight:600 }}>Choose one:</Typography>
                <RadioGroup
                  aria-labelledby="over_eighteen"
                  name="radio-buttons-group"
                  value={overEighteen}
                  onChange={(e) => handleOverEighteen(e)}
                >
                  <FormControlLabel value="yes" control={<Radio />} label="I am a human being at least eighteen (18) years of age" />
                  <FormControlLabel sx={{ mt:2 }} value="no" control={<Radio />} label="I am a human being at least thirteen (13) years of age and would like to use the platform for educational purposes" />
                </RadioGroup>
              </FormControl>
            </>
          )}

          {showCertify && (
            <FormControl fullWidth sx={{mt:5}}>
              <Typography sx={{mb:1, fontWeight:600 }}>Choose one:</Typography>
              <RadioGroup
                aria-labelledby="certify"
                name="radio-buttons-group"
                value={certify}
                onChange={(e) => handleCertify(e)}
              >
                <FormControlLabel value="yes" control={<Radio />} label="I certify that I am eligible to enter DIYSE contests that require cash entry fees based on the criterion outlined in the ELIGIBILITY & USER ACKNOWLEDGMENTS section of the Terms of Use" />
                <FormControlLabel sx={{ mt:2 }} value="no" control={<Radio />} label="I certify that I am not eligible to enter DIYSE contests that require cash entry fees based on the criterion outlined in the ELIGIBILITY & USER ACKNOWLEDGMENTS section of the Terms of Use, but I wish to participate in DIYSE contests that are free to enter" />
              </RadioGroup>
              <Typography sx={{mt: 1}} align="center">
                <Button variant="outlined" onClick={handleAgreementOpen} size="small" sx={{ py:0, backgroundColor: 'primary.blue', fontWeight: 400, fontSize: 16 }}>View the ELIGIBILITY & USER ACKNOWLEDGMENTS section</Button>
              </Typography>
            </FormControl>
          )}

          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" component="div" sx={{ fontWeight: 400, lineHeight: "21.86px", fontSize: 14, fontStyle: 'italic' }} color="secondary.main">
              By updating the above settings, you hereby agree to the above Terms of Use and expressly acknowledge that you have received, read, and understood all documents incorporated herein by reference. 
            </Typography>
          </Box>          
          
          <Box textAlign="center">
            <Button variant="contained" onClick={(e) => saveSettings() } sx={{ mt:4, width: isBelowSm? '100%' : '50%', backgroundColor: 'primary.blue', color: 'white', '&:hover': { backgroundColor: 'primary.blue', color: 'white',},}}>Save Settings</Button>
          </Box>
        </Box>
      </Box>
      </Box>
      
        {showAgreement && (
          <Box>
            <Dialog
              open={showAgreement}
              fullWidth={true}
              maxWidth={'sm'}
              onClose={handleAgreementClose}
              
            >
              <DialogContent sx={{ ml:0, mr:0, mt:2, mb:2, p:0 }}>
                <Box sx={{p:3}}>
                  <iframe title="tos" src="https://api.mydiyse.com/v1/get_tos#EUA" width="100%" height={500} style={{ backgroundColor: '#FFFFFF'}} sandbox='allow-scripts allow-modal' loading='eager'></iframe>
                </Box>
              </DialogContent>
              <DialogActions>
                <Box sx={{ml:'auto', mr:'auto'}}>
                  <Typography align="center">
                    <a style={{ color: 'RoyalBlue' }} href="https://www.mydiyse.com/terms-of-use#EUA" target="_new">View in New Window</a>
                  </Typography>
                  <Typography align="center">
                    <Button variant="contained" onClick={handleAgreementClose} sx={{ mt:2, backgroundColor: 'primary.blue', color: 'white', '&:hover': { backgroundColor: 'primary.blue', color: 'white',},}}>CLOSE</Button>                                    
                  </Typography>
                </Box>
              </DialogActions>

            </Dialog>
          </Box>
        )}      
    </Box>
  );
};

export default Eligibility;
