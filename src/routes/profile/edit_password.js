import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import OutlinedInput from '@mui/material/OutlinedInput';

import { useTheme } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import useMediaQuery from '@mui/material/useMediaQuery';

import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import InputAdornment from '@mui/material/InputAdornment';

import UserService  from './../../services/user-service';
import history from "../../services/history.js";

const EditPassword = () => {
  const [profileData, setProfileData] = useState([]);
  const [message, setMessage] = useState("");
  const [displayMode, setDisplayMode] = useState('loaded');  
  
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
    document.title = "DIYSE Edit Password";
  }, []);

  const [currentPassword, setCurrentPassword] = useState({
    current_password: '',
    showPassword: false,
  });

  const [updatePassword, setUpdatePassword] = useState({
    password: '',
    showPassword: false,
  });

  const [confirmPassword, setConfirmPassword] = useState({
    password_repeat: '',
    showPasswordRepeat: false,
  });

  const handleCurrentPasswordChange = (prop) => (event) => {
    setCurrentPassword({ ...currentPassword, [prop]: event.target.value });
  };

  const handleClickShowCurrentPassword = () => {
    setCurrentPassword({
      ...currentPassword,
      showPassword: !currentPassword.showPassword,
    });
  };

  const handlePasswordChange = (prop) => (event) => {
    setUpdatePassword({ ...updatePassword, [prop]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setUpdatePassword({
      ...updatePassword,
      showPassword: !updatePassword.showPassword,
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

  const handleMouseDownCurrentPassword = (event) => {
    event.preventDefault();
  };

  useEffect(() => {
    const fetchData = async () => {
      UserService.getProfileData()
      .then(
        (response) => {
          if (response) {
            setProfileData(response.data);
          }
        });
    };
    fetchData();
  }, []);

  const handleSubmitPassword = (e) => {
    e.preventDefault();
    let passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    let display_name = profileData.display_name;
    let email = profileData.email;
    let timezone = profileData.timezone;
    let password_repeat = confirmPassword.password_repeat;
    let password = updatePassword.password;
    let current_password = currentPassword.current_password;
    if ( password_repeat === password ) {
      if (passwordRegex.test(password)) {
        setDisplayMode('loading');    
        UserService.sendProfileData(email, display_name, timezone, password, password_repeat, current_password)
        .then(() => {
            history.push("/profile");
        })
        .catch(err => {
          setMessage({ ErrorPassword: err.data.error_mesg });
          setDisplayMode('loaded');    
        });
      } else {
        setMessage({ ErrorPassword: "The password must be between 8 and 40 characters and contain at least one each of an uppercase letter, number and a special character." });
        setDisplayMode('loaded');    
      }
    } else {
      setMessage({ ErrorPassword: "Passwords must match" });
      setDisplayMode('loaded');    
    }
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
          Change Password
        </Typography>
      </Box>
      <Box>
        <Box sx={{ mt:2, marginLeft:'auto', marginRight:'auto', width: isBelowSm? '100%' : '50%' }}>
           <Typography color="primary" sx={{ fontWeight: 700, fontSize: 15, textTransform: 'uppercase', pb:2}}>current password</Typography>
            <OutlinedInput
              fullWidth
              id="current password"
              placeholder="Your current password"
              aria-describedby="current password"
              type={currentPassword.showPassword ? 'text' : 'password'}
              value={currentPassword.password}
              onChange={handleCurrentPasswordChange('current_password')}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    sx={{mr:2}}
                    aria-label="toggle password visibility"
                    onClick={handleClickShowCurrentPassword}
                    onMouseDown={handleMouseDownCurrentPassword}
                    edge="end"
                  >
                    {currentPassword.showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
          </Box>
          
          <Box sx={{ mt:2, marginLeft:'auto', marginRight:'auto', width: isBelowSm? '100%' : '50%' }}>
            <Typography color="primary" sx={{ fontWeight: 700, fontSize: 15, textTransform: 'uppercase', pb:2}}>new password</Typography>
            <OutlinedInput
              fullWidth
              id="update password"
              placeholder="Update your password"
              aria-describedby="update password"
              type={updatePassword.showPassword ? 'text' : 'password'}
              value={updatePassword.password}
              onChange={handlePasswordChange('password')}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    sx={{mr:2}}
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {updatePassword.showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
          </Box>
  
        <Box sx={{ mt:2, marginLeft:'auto', marginRight:'auto', width: isBelowSm? '100%' : '50%' }}>
          <Typography color="primary" sx={{ fontWeight: 700, fontSize: 15, textTransform: 'uppercase', pb:2}}>re-enter new password</Typography>
          <OutlinedInput
            fullWidth
            id="re-enter password"
            placeholder="Re-enter your password"
            aria-describedby="re-enter password"
            type={confirmPassword.showPasswordRepeat ? 'text' : 'password'}
            value={confirmPassword.password_repeat}
            onChange={handleConfirmPasswordChange('password_repeat')}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  sx={{mr:2}}
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
          {message &&(
            <Box role="alert">
              <Typography variant="h6" component="div" sx={{ flexGrow: 1, mt: 1, fontWeight: 400, lineHeight: "21.86px", fontSize: 16}} color="error.main">
               {message.ErrorPassword}
              </Typography>
            </Box>
          )}
          <Button variant="contained"  onClick={(e) => handleSubmitPassword(e) } sx={{ mt:1, backgroundColor: 'primary.blue', color: 'white', '&:hover': { backgroundColor: 'primary.blue', color: 'white',},}}>UPDATE PASSWORD</Button>            
        </Box>
      </Box>

    </Box>

  );
};

export default EditPassword;
