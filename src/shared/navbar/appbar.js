import React, { useState, useEffect } from "react";
import { Link, useLocation } from 'react-router-dom';
import { useMediaQuery } from '@mui/material';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import IconButton from '@mui/material/IconButton';
import { ReactComponent as Logo } from '../../shared/images/logo.svg';
import Stack from '@mui/material/Stack';

import { useTheme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';

import { useAuth } from "../../services/use-auth";
import UserService  from '../../services/user-service';
import history from '../../services/history';
import settings from '../../services/settings';

const useStyles = makeStyles(theme => ({
  customHoverFocus: {
    "&:hover, &.Mui-focusVisible": { backgroundColor: '#FE6B8B' }
  },
  btn: {
    background: 'linear-gradient(90.45deg, #613BFB 0%, #316BFF 100%)',
  },
  icon:{
    '&:hover': {
      background: 'none',
    },
  }
}));

const Appbar = (props) => {
  const classes = useStyles();
  const colorTheme = useTheme();
  const colorMode = React.useContext(props.ColorModeContext);

  const auth = useAuth();
  const isLoggedIn = auth.user;
  const [balance, setBalance] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
    
  const location = useLocation();

  useEffect(() => {
    if (auth.user) {
      UserService.getBalance()
        .then((response) => {
          if (response) {
            setBalance(response.data.balance);
          }
        });
    }
  }, [auth]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const handleAddFunds = () => {
    history.push("/account_balance");
  };

  const matches = useMediaQuery('(min-width:1200px)');

  const LogoComponent = (
    <Box
      component="div"
      sx={
        matches
          ? { flexGrow: 1, width: '350px' }
          : { flexGrow: 1, maxWidth: '50px' }
      }
      color="primary"
    >
      {isLoggedIn && location.pathname.startsWith('/contest') && (
        <Button
          className={classes.icon}
          sx={
            matches
              ? {
                  width: '140px',
                  height: '37px',
                }
              : {
                  width: '100px',
                  height: '67px',
                }
          }
          component={Link}
          to="/contests"
        >
          <Logo />
        </Button>
      )}
      {isLoggedIn && !location.pathname.startsWith('/contest') && (
        <Stack spacing={0}>
          <div>
            <Button
              className={classes.icon}
              sx={
                matches
                  ? {
                      width: '140px',
                      height: '37px',
                    }
                  : {
                      width: '100px',
                      height: '67px',
                    }
              }
              component={Link}
              to="/login"
            >
              <Logo />
            </Button>
          </div>
        </Stack>
      )}
      {!isLoggedIn && (
        <Button
          className={classes.icon}
          sx={
            matches
              ? {
                  width: '140px',
                  height: '37px',
                }
              : {
                  width: '100px',
                  height: '67px',
                }
          }
          component={Link}
          to="/"
        >
          <Logo />
        </Button>
      )}
    </Box>
  );

  return (
    <Box>
      <AppBar
        position="static"
        elevation={0}
        color="transparent"
        sx={matches ? { px: 7 } : {}}
      >
        <Toolbar>
          {/*{matches ? "true" : "false"}*/}
          {LogoComponent}
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              width: '100%',
              alignItems: 'center',
            }}
          >
            <Box
              onClick={colorMode.toggleColorMode}
              sx={{ mr: 2, cursor: 'pointer' }}
            >
              {colorTheme.palette.mode === 'dark' ? (
                <svg
                  width="38"
                  height="22"
                  viewBox="0 0 38 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g filter="url(#filter0_d_27_822)">
                    <rect
                      x="1"
                      y="1"
                      width="36"
                      height="20"
                      rx="10"
                      fill="#4A4E75"
                    />
                  </g>
                  <g filter="url(#filter1_d_27_822)">
                    <circle cx="27" cy="11" r="9" fill="#36395B" />
                  </g>
                  <g clipPath="url(#clip0_27_822)">
                    <path
                      d="M27.0057 10.9966C25.8157 8.9355 26.0692 6.44125 27.4481 4.6829C27.8419 4.17839 27.3178 3.45718 26.7051 3.64927C25.99 3.87737 25.2945 4.23273 24.6492 4.72844C22.2454 6.57818 21.3978 9.92348 22.6331 12.6898C24.2785 16.3663 28.6763 17.7301 32.0711 15.7701C32.4925 15.5268 32.87 15.2473 33.2184 14.9307C33.6969 14.4928 33.3435 13.6807 32.7005 13.7671C30.4115 14.0956 28.1533 12.9976 27.0057 10.9966Z"
                      fill="white"
                    />
                  </g>
                  <defs>
                    <filter
                      id="filter0_d_27_822"
                      x="0"
                      y="0"
                      width="38"
                      height="22"
                      filterUnits="userSpaceOnUse"
                      colorInterpolationFilters="sRGB"
                    >
                      <feFlood floodOpacity="0" result="BackgroundImageFix" />
                      <feColorMatrix
                        in="SourceAlpha"
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                        result="hardAlpha"
                      />
                      <feOffset />
                      <feGaussianBlur stdDeviation="0.5" />
                      <feComposite in2="hardAlpha" operator="out" />
                      <feColorMatrix
                        type="matrix"
                        values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.8 0"
                      />
                      <feBlend
                        mode="normal"
                        in2="BackgroundImageFix"
                        result="effect1_dropShadow_27_822"
                      />
                      <feBlend
                        mode="normal"
                        in="SourceGraphic"
                        in2="effect1_dropShadow_27_822"
                        result="shape"
                      />
                    </filter>
                    <filter
                      id="filter1_d_27_822"
                      x="17"
                      y="1"
                      width="20"
                      height="20"
                      filterUnits="userSpaceOnUse"
                      colorInterpolationFilters="sRGB"
                    >
                      <feFlood floodOpacity="0" result="BackgroundImageFix" />
                      <feColorMatrix
                        in="SourceAlpha"
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                        result="hardAlpha"
                      />
                      <feOffset />
                      <feGaussianBlur stdDeviation="0.5" />
                      <feComposite in2="hardAlpha" operator="out" />
                      <feColorMatrix
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"
                      />
                      <feBlend
                        mode="normal"
                        in2="BackgroundImageFix"
                        result="effect1_dropShadow_27_822"
                      />
                      <feBlend
                        mode="normal"
                        in="SourceGraphic"
                        in2="effect1_dropShadow_27_822"
                        result="shape"
                      />
                    </filter>
                    <clipPath id="clip0_27_822">
                      <rect
                        width="16"
                        height="16"
                        fill="white"
                        transform="translate(16.0718 8.07178) rotate(-30)"
                      />
                    </clipPath>
                  </defs>
                </svg>
              ) : (
                <svg
                  width="38"
                  height="22"
                  viewBox="0 0 38 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g filter="url(#filter0_d_142_1078)">
                    <rect
                      x="1"
                      y="1"
                      width="36"
                      height="20"
                      rx="10"
                      fill="#E9E9E9"
                    />
                  </g>
                  <g filter="url(#filter1_d_142_1078)">
                    <circle cx="11" cy="11" r="9" fill="white" />
                  </g>
                  <path
                    d="M7.03096 6.69901C7.29318 6.43865 7.29333 6.01459 7.03131 5.75403L6.77728 5.5014C6.51713 5.2427 6.0967 5.24329 5.83728 5.50271C5.57735 5.76265 5.57735 6.18408 5.83728 6.44402L6.09061 6.69735C6.35009 6.95683 6.77056 6.95758 7.03096 6.69901ZM5.66663 10.6667C5.66663 10.2985 5.36815 10 4.99996 10H4.33329C3.9651 10 3.66663 10.2985 3.66663 10.6667C3.66663 11.0349 3.9651 11.3334 4.33329 11.3334H4.99996C5.36815 11.3334 5.66663 11.0349 5.66663 10.6667ZM11.6666 4.03337C11.6666 3.66518 11.3681 3.3667 11 3.3667C10.6318 3.3667 10.3333 3.66518 10.3333 4.03337V4.6667C10.3333 5.03489 10.6318 5.33337 11 5.33337C11.3681 5.33337 11.6666 5.03489 11.6666 4.6667V4.03337ZM16.1633 6.44336C16.4229 6.18379 16.4229 5.76294 16.1633 5.50337C15.9037 5.24379 15.4829 5.24379 15.2233 5.50337L14.97 5.7567C14.7104 6.01627 14.7104 6.43712 14.97 6.6967C15.2295 6.95627 15.6504 6.95627 15.91 6.6967L16.1633 6.44336ZM14.96 14.64C14.702 14.898 14.7014 15.316 14.9587 15.5747L15.2179 15.8354C15.4766 16.0955 15.8973 16.0961 16.1566 15.8367C16.416 15.5773 16.4154 15.1566 16.1553 14.898L15.8946 14.6387C15.6359 14.3815 15.2179 14.3821 14.96 14.64ZM17 10C16.6318 10 16.3333 10.2985 16.3333 10.6667C16.3333 11.0349 16.6318 11.3334 17 11.3334H17.6666C18.0348 11.3334 18.3333 11.0349 18.3333 10.6667C18.3333 10.2985 18.0348 10 17.6666 10H17ZM11 6.6667C8.79329 6.6667 6.99996 8.46003 6.99996 10.6667C6.99996 12.8734 8.79329 14.6667 11 14.6667C13.2066 14.6667 15 12.8734 15 10.6667C15 8.46003 13.2066 6.6667 11 6.6667ZM10.3333 17.3C10.3333 17.6682 10.6318 17.9667 11 17.9667C11.3681 17.9667 11.6666 17.6682 11.6666 17.3V16.6667C11.6666 16.2985 11.3681 16 11 16C10.6318 16 10.3333 16.2985 10.3333 16.6667V17.3ZM5.83401 14.89C5.57567 15.1498 5.57625 15.5697 5.83532 15.8287C6.0954 16.0888 6.51726 16.0882 6.77662 15.8274L7.03258 15.57C7.29091 15.3102 7.29033 14.8904 7.03127 14.6313C6.77118 14.3713 6.34932 14.3718 6.08996 14.6327L5.83401 14.89Z"
                    fill="#939393"
                  />
                  <defs>
                    <filter
                      id="filter0_d_142_1078"
                      x="0"
                      y="0"
                      width="38"
                      height="22"
                      filterUnits="userSpaceOnUse"
                      colorInterpolationFilters="sRGB"
                    >
                      <feFlood floodOpacity="0" result="BackgroundImageFix" />
                      <feColorMatrix
                        in="SourceAlpha"
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                        result="hardAlpha"
                      />
                      <feOffset />
                      <feGaussianBlur stdDeviation="0.5" />
                      <feComposite in2="hardAlpha" operator="out" />
                      <feColorMatrix
                        type="matrix"
                        values="0 0 0 0 0.2 0 0 0 0 0.2 0 0 0 0 0.2 0 0 0 0.8 0"
                      />
                      <feBlend
                        mode="normal"
                        in2="BackgroundImageFix"
                        result="effect1_dropShadow_142_1078"
                      />
                      <feBlend
                        mode="normal"
                        in="SourceGraphic"
                        in2="effect1_dropShadow_142_1078"
                        result="shape"
                      />
                    </filter>
                    <filter
                      id="filter1_d_142_1078"
                      x="1"
                      y="1"
                      width="20"
                      height="20"
                      filterUnits="userSpaceOnUse"
                      colorInterpolationFilters="sRGB"
                    >
                      <feFlood floodOpacity="0" result="BackgroundImageFix" />
                      <feColorMatrix
                        in="SourceAlpha"
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                        result="hardAlpha"
                      />
                      <feOffset />
                      <feGaussianBlur stdDeviation="0.5" />
                      <feComposite in2="hardAlpha" operator="out" />
                      <feColorMatrix
                        type="matrix"
                        values="0 0 0 0 0.2 0 0 0 0 0.2 0 0 0 0 0.2 0 0 0 0.25 0"
                      />
                      <feBlend
                        mode="normal"
                        in2="BackgroundImageFix"
                        result="effect1_dropShadow_142_1078"
                      />
                      <feBlend
                        mode="normal"
                        in="SourceGraphic"
                        in2="effect1_dropShadow_142_1078"
                        result="shape"
                      />
                    </filter>
                  </defs>
                </svg>
              )}
            </Box>
            {isLoggedIn && (
              <Box>
                <div className="balance">
                  <Typography color="primary" component={'span'}>
                      {balance > 0 && (
                        <p>
                          Balance: <b>${ balance }</b>
                        </p>
                      )}
                    <Button onClick={handleAddFunds} variant="outlined" size="small">Add Funds</Button>
                  </Typography>
                </div>
              </Box>
            )}
            <IconButton
              id="basic-button"
              aria-controls={open ? 'basic-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={handleClick}
            >
              <MenuIcon color="primary" />
            </IconButton>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              onClick={handleClose}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              {isLoggedIn && (
                <Box>
                  <MenuItem>
                    <Typography
                      variant="h6"
                      component="div"
                      className={classes.textB}
                      sx={{
                        flexGrow: 1,
                        paddingTop: 0,
                        paddingBottom: 0,
                        fontWeight: 400,
                        fontSize: 14,
                      }}
                      color="primary"
                    >
                      Logged in as: {auth.user.display_name}
                    </Typography>
                  </MenuItem>
                  <MenuItem>
                    <Typography
                      variant="h6"
                      component="div"
                      className={classes.textB}
                      sx={{
                        flexGrow: 1,
                        paddingTop: 0,
                        paddingBottom: 0,
                        fontWeight: 400,
                        fontSize: 12,
                      }}
                      color="primary"
                    >
                      {auth.user.email}
                    </Typography>
                  </MenuItem>
                </Box>
              )}

              <div key="spacer1">
                {isLoggedIn && (
                  <div>
                    <MenuItem
                      component={Link}
                      to="/profile"
                      color="primary"
                      sx={{ fontWeight: 700, fontSize: 14, py: 1 }}
                    >
                      PROFILE
                    </MenuItem>
                    <MenuItem
                      component={Link}
                      to="/account_balance"
                      color="primary"
                      sx={{ fontWeight: 700, fontSize: 14, py: 1 }}
                    >
                      ACCOUNT BALANCE
                    </MenuItem>
                  </div>
                )}
              </div>
              <MenuItem
                onClick={() => window.open(settings.help, '_blank')}
                color="primary"
                sx={{ fontWeight: 700, fontSize: 14, py: 1 }}
              >
                HELP
              </MenuItem>
              <div key="spacer2">
                {isLoggedIn ? (
                  <MenuItem
                    onClick={() => auth.logout()}
                    color="primary"
                    sx={{ fontWeight: 700, fontSize: 14, py: 1 }}
                  >
                    LOG OUT
                  </MenuItem>
                ) : (
                  <MenuItem
                    component={Link}
                    to="/login"
                    color="primary"
                    sx={{ fontWeight: 700, fontSize: 14, py: 1 }}
                  >
                    LOG IN
                  </MenuItem>
                )}
              </div>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Appbar;
