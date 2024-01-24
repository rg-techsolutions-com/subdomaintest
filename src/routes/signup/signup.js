import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';

import { useTheme, ThemeProvider } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';

import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContentText from '@mui/material/DialogContentText';

import AuthService from "../../services/auth-service";

const Register = () => {
  const theme = useTheme();
  
  const { incoming_referral_code } = useParams();  
  const [initialAgree, setInitialAgree] = useState(true);
  const [email, setEmail] = useState("");
  const [referral_code, setReferralCode] = useState("");
  const [successful, setSuccessful] = useState(false);
  const [message, setMessage] = useState("");
  const [overEighteen, setOverEighteen] = useState(false);
  const [terms_checkbox, setTermsCheckbox] = useState(false);
  const [showAgreement, setShowAgreement] = useState(false);
  const [displayMode, setDisplayMode] = useState('loaded');  
  const [passwordSignIn, setPassword] = useState({
    passwordInput: '',
    showPassword: false,
  });
  const [confirmPassword, setConfirmPassword] = useState({
    password_repeat: '',
    showPasswordRepeat: false,
  });

  useEffect(() => {
    document.title = "DIYSE Sign Up";
    if (incoming_referral_code) {
      setReferralCode(incoming_referral_code);
    }
  }, [incoming_referral_code]);

  const handleAgreementOpen = () => {
    setShowAgreement(true);
  };

  const handleAgreementClose = () => {
    setShowAgreement(false);
  };

  const handleOverEighteen = (event) => {
    setOverEighteen(event.target.value);
  };

  const onChangeEmail = (event) => {
    const email = event.target.value;
    emailValidation(email);
    setEmail(email);
  };
  
  const onChangeReferralCode = (event) => {
    const referral_code = event.target.value;
    setReferralCode(referral_code);
  };

  const handlePasswordChange = (prop) => (event) => {
    if (passwordValidation(event.target.value) === true) {
      setMessage({ ErrorPassword: "" });
    }
    setPassword({ ...passwordSignIn, [prop]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setPassword({
      ...passwordSignIn,
      showPassword: !passwordSignIn.showPassword,
    });
  };

  const handleConfirmPasswordChange = (prop) => (event) => {
    if (matchingPasswordValidation(event.target.value) === true) {
      setMessage({ ErrorPassword: "" });
    }
    setConfirmPassword({ ...confirmPassword, [prop]: event.target.value });
  };

  const handleClickShowConfirmPassword = () => {
    setConfirmPassword({
      ...confirmPassword,
      showPasswordRepeat: !confirmPassword.showPasswordRepeat,
    });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const onClickTermsCheckbox = (e) => {
    if (terms_checkbox === false) {
      setTermsCheckbox(true);
    } else {
      setTermsCheckbox(false);
    }
  };

  const emailValidation = (val_to_check) => {
    if ( ! val_to_check ) {
      val_to_check = email;
    }
    setMessage("");
    let validEmailCheck = /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if ( validEmailCheck.test(val_to_check) ) {
      return true;
    } else {
      setMessage({ ErrorEmailMessage: 'Please enter a valid email address.' });
    }
  };

  const requiredValidation = () => {
    if ( email !== "" && confirmPassword.password_repeat !== "" && passwordSignIn.passwordInput !== "" ) {
      return true;
    } else {

      setMessage({
        ErrorPassword: "This field is required.",
        ErrorEmailMessage: "This field is required."
      });
    }
  };

  const passwordValidation = (val_to_check) => {
    let passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    if ( ! val_to_check ) {
      val_to_check = passwordSignIn.passwordInput;
    }
    if ( passwordRegex.test(val_to_check) ) {
      return true;
    } else {
      setMessage({ ErrorPassword: "The password must be between 8 and 40 characters and include one uppercase letter, a number and a special character." });
    }
  };

  const matchingPasswordValidation = (val_to_check) => {
    if ( ! val_to_check ) {
      val_to_check = passwordSignIn.passwordInput;
    }
    //if ( confirmPassword.password_repeat === passwordSignIn.passwordInput ) {
    if ( val_to_check === passwordSignIn.passwordInput ) {
      return true;
    } else {
      setMessage({ ErrorPassword: "Passwords must match" });
    }
  };

  const handleRegister = (e) => {
    let password_repeat = confirmPassword.password_repeat;
    let password = passwordSignIn.passwordInput;
    e.preventDefault();

    setMessage("");
    setSuccessful(false);

    if (overEighteen === false) {
      setMessage({ formError: "You must select your age bracket." });      
    } else if (terms_checkbox === false) {
      setMessage({ formError: "You must agree to the DIYSE Terms of Use." });      
    } else {

      if ( requiredValidation() && emailValidation() && passwordValidation() && matchingPasswordValidation() ) {
        setDisplayMode('loading');
        let over_eighteen = true;
        if (overEighteen === 'no') {
          over_eighteen = false;
        }
        AuthService.register(email, password, password_repeat, over_eighteen, referral_code).then(
          (response) => {
             setMessage({
               formSuccess: 'YOUR REGISTRATION WAS SUCCESSFUL',
               formSuccessInfo: 'We have sent a link to the email address you have provided. Click on the link to activate your account. The email will be sent from do_not_reply@mydiyse.com. If you do not see an email within a few minutes, check your Spam folder.',
             });
             setSuccessful(true);
            setDisplayMode('loaded');
          },
          (error) => {
             setMessage({
               formError: error.data.error_mesg
             });
             setSuccessful(false);
            setDisplayMode('loaded');
          }
        );
      }
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          className={displayMode}
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >        

        {successful && message && (
          <Box>
            <Box sx={{ flexGrow: 1, mt:3}}>
              <Typography variant="h4" component="div" color="primary" justify="center" alignItems="center" align="center">
                {message.formSuccess}
              </Typography>
              <Typography variant="h6" component="div" color="secondary.main" justify="center" alignItems="center" align="center">
                {message.formSuccessInfo}
              </Typography>            
            </Box>
          </Box>
        )}

        {!successful && (
          <Box>
            <form onSubmit={handleRegister} >
              <Typography
                variant="h5"
                component="div"
                color="primary"
              >
                Create your DIYSE Account
              </Typography>
                              
              <FormControl fullWidth sx={{ mt:2}}>
                <InputLabel htmlFor="outlined-adornment-email">Email Address</InputLabel>
                <OutlinedInput
                  id="outlined-adornment-email"
                  required
                  label="Email Address"
                  fullWidth
                  value={email}
                  onChange={onChangeEmail}
                  placeholder="Enter your email address"
                  aria-describedby="Enter email address"
                  autoComplete="email"
                  autoFocus                
                />
                {message &&(
                  <Box role="alert">
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1, mt: 1, fontWeight: 400, lineHeight: "21.86px", fontSize: 16}} color="error.main">
                     {message.ErrorEmailMessage}
                    </Typography>
                  </Box>
                )}
              </FormControl>
                    
              <FormControl fullWidth sx={{ mt:2}}>
                <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                <OutlinedInput
                  label="Password"
                  required
                  fullWidth
                  id="outlined-adornment-password"
                  placeholder="Enter a password"
                  aria-describedby="password"
                  type={passwordSignIn.showPassword ? 'text' : 'password'}
                  value={passwordSignIn.passwordInput}
                  onChange={handlePasswordChange('passwordInput')}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {passwordSignIn.showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
                {message &&(
                  <Box role="alert">
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1, mt: 1, fontWeight: 400, lineHeight: "21.86px", fontSize: 16}} color="error.main">
                     {message.ErrorPassword}
                    </Typography>
                  </Box>
                )}
              </FormControl>

              <FormControl fullWidth sx={{ mt:2}}>
                <InputLabel htmlFor="outlined-adornment-confirm-password">Confirm Password</InputLabel>
                <OutlinedInput
                  label="Confirm Password"
                  required
                  fullWidth
                  id="outlined-adornment-confirm-password"
                  placeholder="Enter password again"
                  aria-describedby="confirm password"
                  type={confirmPassword.showPasswordRepeat ? 'text' : 'password'}
                  value={confirmPassword.password_repeat}
                  onChange={handleConfirmPasswordChange('password_repeat')}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowConfirmPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {confirmPassword.showPasswordRepeat ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>

              <FormControl fullWidth sx={{mt:3}}>
                <FormLabel id="over_eighteen">Choose one:</FormLabel>
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

              <FormControl fullWidth sx={{ mt:2}}>
                <FormLabel id="outlined-adornment-referral">Referral Code (optional)</FormLabel>
                <OutlinedInput
                  id="outlined-adornment-referral"
                  required
                  label="Referral Code"
                  fullWidth
                  value={referral_code}
                  onChange={onChangeReferralCode}
                  placeholder="Enter a provided referral code, or leave blank"
                  aria-describedby="Enter referral code"
                />
              </FormControl>

              <Box sx={{ mt: 4 }}>
                <Checkbox
                  sx={{ p: 0, mr:2 }}
                  type="checkbox"
                  name="terms_checkbox"
                  onClick={onClickTermsCheckbox}
                  value={terms_checkbox}
                  required
                />
                <Typography variant="h6" component="div" sx={{ display: 'inline', fontWeight: 400, lineHeight: "21.86px", fontSize: 16}} color="primary">
                  <Button onClick={handleAgreementOpen} sx={{ fontWeight: 400, lineHeight: "21.86px", fontSize: 16, textDecoration: 'underline' }}> I agree to  DIYSE’s Terms of Use</Button>
                </Typography>
              </Box>
              <Box sx={{ mt: 4 }}>
                <Typography variant="h6" component="div" sx={{ fontWeight: 400, lineHeight: "21.86px", fontSize: 14, fontStyle: 'italic' }} color="secondary.main">
                  By creating an account with DIYSE, you hereby agree to the above Terms of Use and expressly acknowledge that you have received, read, and understood all documents incorporated herein by reference. 
                </Typography>
              </Box>

              {message &&(
                <Box role="alert">
                  <Typography variant="h6" component="div" sx={{ flexGrow: 1, mt: 1, fontWeight: 400, fontSize: 16}} color="error.main">
                   {message.formError}
                  </Typography>
                </Box>
              )}

              {message && (
                <Box>
                  <Box sx={{ flexGrow: 1, mt:3}}>
                    <Typography variant="h4" component="div" color="primary" justify="center" alignItems="center" align="center">
                      {message.formSuccess}
                    </Typography>
                    <Typography variant="h6" component="div" color="secondary.main" justify="center" alignItems="center" align="center">
                      {message.formSuccessInfo}
                    </Typography>            
                  </Box>
                </Box>
              )}

              <Box>
                <Button
                  component="button"
                  onClick={handleRegister} 
                  type="button"
                  fullWidth
                  variant="contained"
                  sx={{
                    mt: 1,
                    mb: 3,
                    backgroundColor: '#3669EF',
                    color: 'white',
                    '&: hover': {
                      backgroundColor: '#3669EF',
                      color: 'white',
                    },
                  }}
                >
                  Create Account
                </Button>                  
              </Box>
            </form>
          </Box>
        )}            

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
                  <iframe title="tos" src="https://api.mydiyse.com/v1/get_tos" width="100%" height={500} style={{ backgroundColor: '#FFFFFF'}} sandbox='allow-scripts allow-modal' loading='eager'></iframe>
                </Box>
              </DialogContent>
              <DialogActions>
                <Box sx={{ml:'auto', mr:'auto'}}>
                  <Typography align="center">
                    <a style={{ color: 'RoyalBlue' }} href="https://www.mydiyse.com/terms-of-use" target="_new">View in New Window</a>
                  </Typography>
                  <Typography align="center">
                    <Button variant="contained" onClick={handleAgreementClose} sx={{ mt:2, backgroundColor: 'primary.blue', color: 'white', '&:hover': { backgroundColor: 'primary.blue', color: 'white',},}}>CLOSE</Button>                                    
                  </Typography>
                </Box>
              </DialogActions>

            </Dialog>
          </Box>
        )}
        
        {initialAgree && (
          <Box>
            <Dialog
              open={initialAgree}
              maxWidth={'md'}
            >
              <DialogContent>
                <DialogTitle sx={{ p:0 }}>
                  IMPORTANT LEGAL NOTICE REGARDING TERMS OF USE OF DIYSE 
                </DialogTitle>
                <DialogContentText>
                  Before proceeding to the Terms of Use, you will need to certify that you are using, and will in the future use, this site and DIYSE’s 
                  patent-pending platform, products, and services for your own internal, personal, non-commercial use, and not on behalf of or for the benefit 
                  of any third party or competitor of DIYSE, and only in a manner that complies with all laws that apply to you.
                  You need also to be aware that the self-certifications you make within the Terms of Use will determine what kinds of contests you will be eligible to participate in.
                </DialogContentText>
                <Box textAlign="center">
                  <Typography>
                    <Button variant="contained" onClick={() => setInitialAgree(false)} sx={{ mt:2, backgroundColor: 'primary.blue', color: 'white', '&:hover': { backgroundColor: 'primary.blue', color: 'white',},}}>I Understand and Agree</Button>                  
                  </Typography>
                </Box>
              </DialogContent>
            </Dialog>
          </Box>
        )}
        
      </Box>
      </Container>
    </ThemeProvider>
  );
};

export default Register;
