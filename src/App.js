import React, { createContext } from 'react';
import { Route, Switch, Redirect } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";

import './App.css';

import Error from "./shared/errorpage/error";

import AppBar from "./shared/navbar/appbar";
import Signup from "./routes/signup/signup";
import AccVerify from "./services/acc-verification";
import Signin from "./routes/signin/signin";
import Forgot from "./routes/forgot/forgot_password";
import ForgotVerify from "./routes/forgot/forgot_verification";
import MainPage from "./routes/main_page/contests";
import ContestDetails from "./routes/contest_details/contest_details";
import CreateContest from "./routes/main_page/create_contest";
import Portfolio from "./routes/portfolio/create_portfolio";
import PreviousPortfolios from "./routes/portfolio/previous_portfolios";
import Profile from "./routes/profile/profile";
import EditProfile from "./routes/profile/edit_profile";
import EditPassword from "./routes/profile/edit_password";
import DeleteProfile from "./routes/profile/delete_profile";
import AccountBalance from "./routes/profile/account_balance";
import AddFunds from "./routes/profile/add_funds";
import AddFundsPaypal from "./routes/profile/add_funds_paypal";
import AddFundsVenmo from "./routes/profile/add_funds_venmo";
import AddFundsZelle from "./routes/profile/add_funds_zelle";
import AddFundsWire from "./routes/profile/add_funds_wire";
import WithdrawFunds from "./routes/profile/withdraw_funds";
import UserContests from "./routes/profile/user_contests";
import PrivateContestLanding from "./routes/landing/private_contest";
import Eligibility from "./routes/profile/eligibility";
import Footer from "./shared/footbar/footer";

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

import { useAuth, ProvideAuth } from "./services/use-auth.js";
import history from './services/history';

const ColorModeContext = React.createContext({ toggleColorMode: () => {} });
export const ContextMode = createContext('');

const App = () => {
  const font = "'Archivo', sans-serif";
  const lightFont= "'Nunito', sans-serif";
  const [ mode, setMode ] = React.useState('light');
  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'dark' ? 'light' : 'dark'));
      },
    }),
    [],
  );
  const colorTheme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === 'dark' && {
            primary: {
              main: '#fff',
              main2: '#46496F',
              main3: '#3a3e66',
              mainGradient:
                'linear-gradient(180deg, #444870 0%, #171933 100%);',
              blue: '#3669EF',
              green: '#01D27A',
              red: '#FE5959',
              orange: '#E76F51',
            },
            secondary: {
              main: '#F9F8FF',
            },
          }),
          ...(mode === 'light' && {
            primary: {
              main: '#2D3436',
              main2: '#fff',
              main3: '#F2F2F2',
              mainGradient:
                'linear-gradient(180deg, #F2F2F2 0%, #F2F2F2 100%);',
              lightGradient:
                'linear-gradient(90.45deg, #613BFB 0%, #316BFF 100%)',
              blue: '#3669EF',
              green: '#01D27A',
              red: '#FE5959',
              orange: '#E76F51',
            },
            secondary: {
              main: '#121212',
            },
          }),
        },
        typography: {
          fontFamily: font,
          b: {
            fontFamily: lightFont,
          },
        },
      }),
    [mode]
  );  
  function PrivateRoute({ children, ...rest }) {
    let auth = useAuth();
    if (! auth.user) {
      let redirectURL = localStorage.getItem('redirectURL');
      if (! redirectURL) {
        if (history.location) {
          localStorage.setItem('redirectURL', history.location.pathname);
        }
      } else {
        if (redirectURL === 'logout') {
          localStorage.removeItem('redirectURL');
        }
      }
    }

    return (
      <Route
        {...rest}
        render={({ location }) =>
            auth.user ? (
              children
            ) : (
              <Redirect
                to={{
                  pathname: "/login",
                  state: { from: location }
                }}
              />
            )
        }
      />
    );
  }
  function PublicRoute({ children, ...rest }) {
    let auth = useAuth();
    return (
      <Route
        {...rest}
        render={({ location }) =>
          auth.user ? (
            <Redirect
              to={{
                pathname: "/contests",
                state: { from: location }
              }}
            />
          ) : (
            children
          )
        }
      />
    );
  }
  function PublicPrivateRoute({ children, ...rest }) {
    let auth = useAuth();
    let private_url = "/contests";
    if (auth.user) {
      if (history.location.pathname.includes("private_contest")) {
        private_url = history.location.pathname.replace("private_contest", "contest");
      }
    }
    return (
      <Route
        {...rest}
        render={({ location }) =>
          auth.user ? (
            <Redirect
              to={{
                pathname: private_url,
                state: { from: location }
              }}
            />
          ) : (
            children
          )
        }
      />
    );
  }

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ContextMode.Provider value={mode}>
        <ThemeProvider theme={colorTheme}>
          <main>
            <Grid
              sx={{
                background: colorTheme.palette.primary.mainGradient,
                minHeight: '100vh',
              }}
            >
              <Box>
                <ProvideAuth>
                  <Grid container>
                    <Grid item xs={12}>
                      <AppBar ColorModeContext={ColorModeContext} />
                    </Grid>
                    <Grid item xs={12}>
                        <Switch>
                          <PublicPrivateRoute path="/private_contest/:contest_key">
                            <PrivateContestLanding />
                          </PublicPrivateRoute>

                          <PrivateRoute path="/profile">
                            <Profile />
                          </PrivateRoute>
                          <PrivateRoute path="/account_balance">
                            <AccountBalance />
                          </PrivateRoute>
                          <PrivateRoute path="/add_funds">
                            <AddFunds />
                          </PrivateRoute>
                          <PrivateRoute path="/add_funds_paypal">
                            <AddFundsPaypal />
                          </PrivateRoute>
                          <PrivateRoute path="/add_funds_venmo">
                            <AddFundsVenmo />
                          </PrivateRoute>
                          <PrivateRoute path="/add_funds_zelle">
                            <AddFundsZelle />
                          </PrivateRoute>
                          <PrivateRoute path="/add_funds_wire">
                            <AddFundsWire />
                          </PrivateRoute>
                          <PrivateRoute path="/withdraw_funds">
                            <WithdrawFunds />
                          </PrivateRoute>
                          <PrivateRoute path="/delete_profile">
                            <DeleteProfile />
                          </PrivateRoute>
                          <PrivateRoute path="/edit_profile">
                            <EditProfile />
                          </PrivateRoute>
                          <PrivateRoute path="/edit_password">
                            <EditPassword />
                          </PrivateRoute>
                          <PrivateRoute path="/user_contests">
                            <UserContests />
                          </PrivateRoute>
                          <PrivateRoute path="/create_contest">
                            <CreateContest />
                          </PrivateRoute>
                          <PrivateRoute path="/eligibility">
                            <Eligibility />
                          </PrivateRoute>
                          <PrivateRoute path="/portfolio/:contest_key/:contestEntryKey/previous-portfolios">
                            <PreviousPortfolios />
                          </PrivateRoute>
                          <PrivateRoute path="/portfolio/:contest_key/:contestEntryKey">
                            <Portfolio />
                          </PrivateRoute>
                          <PrivateRoute path="/contest/:contest_key">
                            <ContestDetails />
                          </PrivateRoute>
                          <PrivateRoute path="/contests">
                            <MainPage />
                          </PrivateRoute>

                          <PublicRoute path="/password_reset/:forgot_password_code">
                            <ForgotVerify />
                          </PublicRoute>
                          <PublicRoute path="/account_verification/:verification_code">
                            <AccVerify />
                          </PublicRoute>
                          <PublicRoute path="/forgot">
                            <Forgot />
                          </PublicRoute>
                          <PublicRoute path="/signup/:incoming_referral_code">
                            <Signup />
                          </PublicRoute>
                          <PublicRoute path="/signup">
                            <Signup />
                          </PublicRoute>
                          <PublicRoute path="/login">
                            <Signin />
                          </PublicRoute>
                          <PublicRoute path="/">
                            <Signin />
                          </PublicRoute>                          
                          <Route component={Error} />
                        </Switch>
                    </Grid>
                    <Grid item xs={12}>
                      <Footer />
                    </Grid>
                  </Grid>
                </ProvideAuth>
              </Box>
            </Grid>
          </main>
        </ThemeProvider>
      </ContextMode.Provider>      
    </ColorModeContext.Provider>      
  );
};

export default App;

