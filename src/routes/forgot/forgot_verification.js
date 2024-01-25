import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

import { useTheme, ThemeProvider } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';


import AuthService from "../../services/auth-service";

const ForgotVerify = () => {
  const theme = useTheme();
  
  useEffect(() => {
    document.title = "DIYSE Verify Your Account";
  }, []);

  const {forgot_password_code} = useParams();

  const [displayMode, setDisplayMode] = useState('loaded');
  const [email, setEmail] = useState("");
  const [successful, setSuccessful] = useState(false);
  const [message, setMessage] = useState("");
  const [passwordSignIn, setPassword] = useState({
    passwordInput: '',
    showPassword: false,
  });
  const [confirmPassword, setConfirmPassword] = useState({
    password_repeat: '',
    showPasswordRepeat: false,
  });


  const onChangeEmail = (event) => {
    const email = event.target.value;
    setEmail(email);
  };

  const handlePasswordChange = (prop) => (event) => {
    setPassword({ ...passwordSignIn, [prop]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setPassword({
      ...passwordSignIn,
      showPassword: !passwordSignIn.showPassword,
    });
  };

  const handleConfirmPasswordChange = (prop) => (event) => {
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


  const emailValidation = () => {
    setMessage("");
    let validEmailCheck = /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if ( validEmailCheck.test(email) ) {
      return true;
    } else {
      setMessage({ ErrorEmailMessage: 'This is not a valid email.' });
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

  const passwordValidation = () => {
    let passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    if ( passwordRegex.test(passwordSignIn.passwordInput) ) {
      return true;
    } else {
      setMessage({ ErrorPassword: "The password must be between 8 and 40 characters and include one uppercase letter, a number and a special character." });
    }
  };

  const matchingPasswordValidation = () => {
    if ( confirmPassword.password_repeat === passwordSignIn.passwordInput ) {
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


    if ( requiredValidation() && emailValidation() && passwordValidation() && matchingPasswordValidation() ) {
      setDisplayMode('loading');
      AuthService.forgotverify(email, password, password_repeat, forgot_password_code).then(
        (response) => {
          setMessage({
            formSuccess: 'YOUR PASSWORD HAS BEEN CHANGED',
            formSuccessInfo: 'You may now log into your account.',
            formLoginLink: true
          });
          setSuccessful(true);
          setDisplayMode('loaded');
        },
        (error) => {
          setSuccessful(false);
          if (error.data && error.data.error_mesg) {
            setMessage({formError: error.data.error_mesg});
          } else {
            setMessage({formError: "An error occurred. Please try again in a few minutes."});
          }
          setDisplayMode('loaded');
        }
      );
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
        {!successful && (
          <Box>
            <form onSubmit={handleRegister} >
              <Typography
                variant="h5"
                component="div"
                color="primary"
              >
                Enter your email address and your new password.
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

              {message &&(
                <Box role="alert">
                  <Typography variant="h6" component="div" sx={{ flexGrow: 1, mt: 1, fontWeight: 400, lineHeight: "21.86px", fontSize: 16}} color="error.main">
                   {message.ErrorPassword}
                   {message.formError}
                  </Typography>
                </Box>
              )}

              <Box>
                <Button
                  component="button"
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{
                    mt: 3,
                    mb: 2,
                    backgroundColor: '#3669EF',
                    color: 'white',
                    '&: hover': {
                      backgroundColor: '#3669EF',
                      color: 'white',
                    },
                  }}
                >
                  Change Password
                </Button>                  
              </Box>
            </form>
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
              {message.formLoginLink && (
                <Button
                  component="button"
                  href="/login"
                  fullWidth
                  variant="contained"
                  sx={{
                    mt: 3,
                    mb: 2,
                    backgroundColor: '#3669EF',
                    color: 'white',
                    '&: hover': {
                      backgroundColor: '#3669EF',
                      color: 'white',
                    },
                  }}
                >
                  Login
                </Button>                  
              )}
            </Box>
          </Box>
        )}
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default ForgotVerify;
