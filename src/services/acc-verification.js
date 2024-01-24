import { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import { useParams } from "react-router-dom";
import AuthService from "./auth-service";
import { useTheme, ThemeProvider } from '@mui/material/styles';
import settings from "./settings";

const AccountVerify = () => {
  const [message, setMessage] = useState("");
  const {verification_code} = useParams();
  const [error, setError] = useState(false);
  const [displayMode, setDisplayMode] = useState('loaded');

  const theme = useTheme();

  useEffect(() => {
    document.title = "DIYSE Verify Your Account";
  }, []);

  useEffect(() => {
    setDisplayMode('loading');
    AuthService.accverify(verification_code)
    .then(
      (response) => {
        setMessage({
          headerMes: 'YOUR EMAIL ADDRESS IS CONFIRMED',
          mess: 'Your account is verified. You may now log in.',
        });
        setDisplayMode('loaded');
      })
    .catch(
      (error) => {
        setError(true);
        setMessage({
          headerMes: 'ACCCOUNT VALIDATION ERROR',
          mess: error.data.error_mesg,
        });
        setDisplayMode('loaded');
      }
    );
   }, [verification_code]
  );


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
          <Typography variant="h4" component="div" color="primary" justify="center" alignItems="center" align="center">
            {message.headerMes}
          </Typography>
          <Typography variant="h6" component="div" color="secondary.main" justify="center" alignItems="center" align="center">
            {message.mess}
          </Typography>        
          {! error &&
            <>
            <Typography variant="h7" component="div" color="secondary.main" justify="center" alignItems="center" align="center" sx={{mt:2}}>
              For an overview of how your stock picks, the market cap of those stocks, and your allocation across them are interrelated, please review this <a href={ `${settings.video_diyse_overview}` } style={{color:"RoyalBlue"}} target="_new">this short 3-minute video</a>.
            </Typography>        
            <Typography variant="h7" component="div" color="secondary.main" justify="center" alignItems="center" align="center">
              For an overview of the DIYSE tools available to you to build your portfolio, please review <a href={ `${settings.video_diyse_portfolios}` } style={{color:"RoyalBlue"}} target="_new">this short 5-minute video</a>.
            </Typography>        

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
            </>
          }
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default AccountVerify;
