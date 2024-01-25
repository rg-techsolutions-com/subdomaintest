import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { useTheme } from '@mui/material';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import useMediaQuery from '@mui/material/useMediaQuery';

import UserService  from './../../services/user-service';

const Profile = () => {
  const [profileData, setProfileData] = useState([]);

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
    document.title = "DIYSE Your Profile";
  }, []);

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
  
  return (
    <Box sx={{ my, px, color: 'text.primary' }}>
      <Box>
        <IconButton LinkComponent={Link} to={{ pathname: '/contests' }}>
          <ArrowBackIosIcon />
          <Typography sx={{ fontSize: isBelowSm ? 12 : 18, fontWeight: 500 }}>
            CONTEST LOBBY
          </Typography>
        </IconButton>
        <Typography
          sx={{ mt: 4, fontSize: isBelowSm ? 20 : 32, fontWeight: 700 }}
        >
          Profile
        </Typography>
        <Box sx={{borderBottom:2, borderColor: 'primary.main', mb:2, pb:1}}>
          <Typography color="primary" sx={{ fontWeight: 400, fontSize: 13, pb:4, display: 'inline' }}>Joined </Typography>
          <Typography color="primary" sx={{ fontWeight: 700, fontSize: 13, textTransform: 'uppercase', pb:4, display: 'inline' }}>{profileData.signup_date}</Typography>
        </Box>

        <Box>
          <Typography color="primary" sx={{ fontWeight: 700, fontSize: 15, textTransform: 'uppercase', pb:1, mt:4, mr:2, display: 'inline'}}>email address</Typography>
          <Typography color="primary" sx={{ fontWeight: 400, fontSize: 13, display: 'inline'}}>{profileData.email}</Typography>
        </Box>
        <Box>
          <Typography color="primary" sx={{ fontWeight: 700, fontSize: 15, textTransform: 'uppercase', pb:1, mt:4, mr:2, display: 'inline' }}>display name</Typography>
          <Typography color="primary" sx={{ fontWeight: 400, fontSize: 13, display: 'inline'}}>{profileData.display_name}</Typography>
        </Box>
        <Box>
          <Typography color="primary" sx={{ fontWeight: 700, fontSize: 15, textTransform: 'uppercase', pb:1, mt:4, mr:2, display: 'inline' }}>Referral Code</Typography>
          <Typography color="primary" sx={{ fontWeight: 400, fontSize: 13, display: 'inline'}}>{profileData.referral_code}</Typography>
        </Box>
        <Box>
          <Typography color="primary" sx={{ fontWeight: 700, fontSize: 15, textTransform: 'uppercase', pb:1, mt:4, mr:2, display: 'inline' }}>Timezone</Typography>
          <Typography color="primary" sx={{ fontWeight: 400, fontSize: 13, display: 'inline'}}>{profileData.timezone}</Typography>
        </Box>

        <Box textAlign="center">
          <Box>
            <Button variant="contained" component={Link} to={{ pathname: `/edit_profile` }} sx={{ mt:4, width: isBelowSm? '100%' : '50%', backgroundColor: 'primary.blue', color: 'white', '&:hover': { backgroundColor: 'primary.blue', color: 'white',},}}>EDIT PROFILE</Button>
          </Box>
          
          <Box>
            <Button variant="contained" component={Link} to={{ pathname: `/edit_password` }} sx={{ mt:2, width: isBelowSm? '100%' : '50%', backgroundColor: 'primary.blue', color: 'white', '&:hover': { backgroundColor: 'primary.blue', color: 'white',},}}>CHANGE PASSWORD</Button>
          </Box>
  
          <Box>
            <Button variant="contained" component={Link} to={{ pathname: `/eligibility` }} sx={{ mt:2, width: isBelowSm? '100%' : '50%', backgroundColor: 'primary.blue', color: 'white', '&:hover': { backgroundColor: 'primary.blue', color: 'white',},}}>AGE AND ELIGIBILITY</Button>
          </Box>
  
          <Box>
            <Button variant="contained" component={Link} to={{ pathname: `/account_balance` }} sx={{ mt:2, width: isBelowSm? '100%' : '50%', backgroundColor: 'primary.blue', color: 'white', '&:hover': { backgroundColor: 'primary.blue', color: 'white',},}}>ACCOUNT BALANCE</Button>
          </Box>
  
          <Box>
            <Button variant="contained" component={Link} to={{ pathname: `/add_funds` }} sx={{ mt:2, width: isBelowSm? '100%' : '50%', backgroundColor: 'primary.blue', color: 'white', '&:hover': { backgroundColor: 'primary.blue', color: 'white',},}}>ADD/WITHDRAW FUNDS</Button>
          </Box>
  
          <Box>
            <Button variant="contained" component={Link} to={{ pathname: `/user_contests` }} sx={{ mt:2, width: isBelowSm? '100%' : '50%', backgroundColor: 'primary.blue', color: 'white', '&:hover': { backgroundColor: 'primary.blue', color: 'white',},}}>YOUR CONTESTS</Button>
          </Box>
  
          <Box>
            <Button variant="outlined" component={Link} to={{ pathname: `/delete_profile` }} sx={{ mt:2, width: isBelowSm? '100%' : '50%', borderColor: 'primary.orange', '&:hover': { backgroundColor: 'transparent', borderColor: 'primary.orange', }, }}>DELETE YOUR ACCOUNT</Button>
          </Box>
        </Box>
      </Box>
    </Box>


  );
};

export default Profile;
