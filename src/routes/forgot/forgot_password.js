import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import OutlinedInput from '@mui/material/OutlinedInput';
import Container from '@mui/material/Container';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import CssBaseline from '@mui/material/CssBaseline';
import { useTheme, ThemeProvider } from '@mui/material/styles';

import AuthService from "../../services/auth-service";

const Forgot = () => {

  const [email, setEmail] = useState("");
  const [successful, setSuccessful] = useState(false);
  const [message, setMessage] = useState("");
  const [displayMode, setDisplayMode] = useState('loaded');
  
  const theme = useTheme();

  useEffect(() => {
    document.title = "DIYSE Reset Password";
  }, []);

  const onChangeEmail = (event) => {
    const email = event.target.value;
    setEmail(email);
  };

  const emailValidation = () => {
    let validEmailCheck = /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if ( validEmailCheck.test(email) ) {
      return true;
    } else {
      setMessage({ ErrorEmailMessage: 'This is not a valid email.' });
    }
  };

  const requiredValidation = () => {
    if ( email !== "" ) {
      return true;
    } else {

      setMessage({
        ErrorPassword: "This field is required.",
        ErrorEmailMessage: "This field is required."
      });
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();

    setMessage("");
    setSuccessful(false);

    if ( requiredValidation() && emailValidation() ) {
      setDisplayMode('loading');
      AuthService.forgot_password(email).then(
        (response) => {
          setMessage({
            formSuccess: 'EMAIL SENT',
            formSuccessInfo: 'We have sent you a link to change the password for your DIYSE account. The email will be sent from do_not_reply@mydiyse.com, and should arrive within a minute. If you do not see an email within a few minutes, check your Spam folder.',
          });
          setSuccessful(true);
          setDisplayMode('loaded');
        },
        (error) => {
          setMessage({
            headerMes: 'ERROR',
            mess: 'There was an error sending the email. Try again in a few minutes.',
          });
          setSuccessful(false);
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
                <form onSubmit={handleRegister}>
                  <Typography
                    variant="h5"
                    component="div"
                    color="primary"
                  >
                    Enter your email address, and we'll send a link to reset your password.
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
                
                  {message &&(
                    <Box role="alert">
                      <Typography variant="h6" component="div" sx={{ flexGrow: 1, mt: 1, fontWeight: 400, lineHeight: "21.86px", fontSize: 16}} color="error.main">
                       {message.ErrorEmailMessage}
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
                      Send Link
                    </Button>                  
                  </Box>
                  
                  <Grid container>
                    <Grid item xs>
                      <Typography component={Link} to="/signup" color="primary">Don't have an account? Sign Up</Typography>
                    </Grid>
                    <Grid item xs>
                      <Typography component={Link} to="/login" color="primary">Login</Typography>
                    </Grid>
                  </Grid>
                </form>
              </Box>
            )}
  
        </Box>
      </Container>
        {message && (
          <Box>
            <Box sx={{mx: 4, mt:3}}>
              <Typography variant="h4" component="div" color="primary" justify="center" alignItems="center" align="center">
                {message.formSuccess}
              </Typography>
              <Typography variant="h6" component="div" color="secondary.main" justify="center" alignItems="center" align="center">
                {message.formSuccessInfo}
              </Typography>
            </Box>
          </Box>
        )}        
    </ThemeProvider>
  );
};

export default Forgot;
