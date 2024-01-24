import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
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
import IconButton from '@mui/material/IconButton'

import { useAuth } from "../../services/use-auth.js";
import UserService  from '../../services/user-service';
import history from "../../services/history.js";


const Login = (props) => {

  const theme = useTheme();

  const auth = useAuth();

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [displayMode, setDisplayMode] = useState('loaded');
  const [passwordSignIn, setPassword] = useState({
    passwordInput: '',
    showPassword: false,
  });
  const [autoLoggedOut, setAutoLoggedOut] = useState(false);

  useEffect(() => {
    document.title = "DIYSE Login";
    let ru = localStorage.getItem('redirectURL');
    if (ru) {
      if (ru !== "logout") {
        setAutoLoggedOut(true);
      }
    }
  }, []);

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

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const emailValidation = () => {
    setMessage("");
    let validEmailCheck = /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if ( validEmailCheck.test(email) ) {
      return true
    } else {
      setMessage({ ErrorEmailMessage: 'This is not a valid email.' });
    }
  };

  const requiredValidation = () => {
    if ( email !== "" && passwordSignIn.passwordInput !== "" ) {
      return true
    } else {

      setMessage({
        ErrorPassword: "This field is required.",
        ErrorEmailMessage: "This field is required."
      });
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setDisplayMode('loading');    
    let password = passwordSignIn.passwordInput;

    setMessage("");

    if ( requiredValidation() && emailValidation() ) {
      auth.login(email, password).then(
        () => {
          UserService.getProfileData()
          .then(
            (response) => {
              if (response) {
                setDisplayMode('loaded');
                if (response.data.certify === null && response.data.over_eighteen === true) {
                  history.push("/eligibility");
                } else {
                  let privateContestURL = localStorage.getItem('private_contest_key');
                  if (privateContestURL) {
                    localStorage.removeItem('private_contest_key');
                    history.push("/contest/"+privateContestURL);
                  } else {
                    let redirectURL = localStorage.getItem('redirectURL');
                    if (redirectURL) {
                      localStorage.removeItem('redirectURL');
                      history.push(redirectURL);
                    } else {
                      history.push("/contests");
                    }
                  }
                }
              }
            });
        },
        (error) => {
          setAutoLoggedOut(false);
          let mesg = 'Incorrect email or password';
          if (error.response) {
            if (error.response.data) {
              mesg = error.response.data.error_mesg;
            }
          }
          setDisplayMode('loaded');
          setMessage({ ErrorMessage: mesg });
        }
      );
    } else {
      setDisplayMode('loaded');
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
          {autoLoggedOut && (
            <div>
              <Typography variant="h1" component="div" sx={{ flexGrow: 1, fontWeight: 700, fontSize: 14, ml:3, mb:2 }} color="red">
                You have been logged out due to inactivity.
              </Typography>
            </div>
          )}

          <Box>
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
                onKeyPress={(event) => {
                  if (event.key === 'Enter')
                    handleLogin(event);
                }}
              />
            </FormControl>

            {message &&(
              <Box role="alert">
                <Typography variant="h6" component="div" sx={{ flexGrow: 1, mt: 1, fontWeight: 400, lineHeight: "21.86px", fontSize: 16}} color="error.main">
                 {message.ErrorPassword}
                </Typography>
              </Box>
            )}

            <Button
              component="button"
              onClick={handleLogin}
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
              Log In
            </Button>
            
            {message &&(
              <Box role="alert">
                <Typography variant="h6" component="div" sx={{ flexGrow: 1, mb: 1, fontWeight: 400, lineHeight: "21.86px", fontSize: 16}} color="error.main">
                 {message.ErrorMessage}
                </Typography>
              </Box>
            )}
            
            <Grid container>
              <Grid item xs>
                <Typography component={Link} to="/forgot" color="primary">Forgot your password?</Typography>
              </Grid>
              <Grid item xs>
                <Typography component={Link} to="/signup" color="primary">Don't have an account? Sign Up</Typography>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
    
  );
};

export default Login;
