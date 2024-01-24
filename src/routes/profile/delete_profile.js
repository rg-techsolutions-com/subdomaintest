import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import UserService  from './../../services/user-service';
import { useAuth } from "../../services/use-auth.js";

import { useTheme } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import useMediaQuery from '@mui/material/useMediaQuery';

import Dialog from '@mui/material/Dialog';

const DeleteProfile = () => {
  const [profileData, setProfileData] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const handleOpenModal = () => setOpenModal(true);
  const auth = useAuth();

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
    document.title = "DIYSE Delete Your Account";
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

  const deleteAcc = () => {
    UserService.deleteAccount();
  };
  return (
  <>
   <Box sx={{ my, px, color: 'text.primary' }}>
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
          Delete Your Account
        </Typography>

        <Box textAlign="center">
          <Box>
            <Typography color="primary" sx={{ fontWeight: 700, fontSize: 15, textTransform: 'uppercase', pb:2 }}>{profileData.email}</Typography>
            <Box sx={{ mb:1, pb:3}}>
              <Typography color="primary" sx={{ fontWeight: 400, fontSize: 13, pb:4, display: 'inline' }}>Joined </Typography>
              <Typography color="primary" sx={{ fontWeight: 700, fontSize: 13, textTransform: 'uppercase', pb:4, display: 'inline' }}>{profileData.signup_date}</Typography>
            </Box>
          </Box>
          <Box>
            <Button variant="outlined" onClick={(e) => handleOpenModal() }  sx={{ mt:2, width: isBelowSm? '100%' : '50%', borderColor: 'primary.orange', '&:hover': { backgroundColor: 'transparent', borderColor: 'primary.orange', }, }}>DELETE YOUR ACCOUNT</Button>            
          </Box>
          
        </Box>
      </Box>
 
      <Dialog
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={openModal}
      >
          <Box textAlign="center" sx={{p:3}}>
            <Typography variant="h1" component="div" sx={{ flexGrow: 1, fontWeight: 700, fontSize: 25, mb:5 }} color="primary">CONFIRM ACCOUNT DELETION</Typography>
            <Typography color="primary" sx={{ fontWeight: 700, fontSize: 15, pb:2 }}>Are you sure? You are about to permanently delete your account. This action cannot be undone.</Typography>
              <Box>
                <Button variant="outlined" onClick={() => {deleteAcc(); auth.logout()}}  sx={{ mt:2, width: isBelowSm? '100%' : '50%', borderColor: 'primary.orange', '&:hover': { backgroundColor: 'transparent', borderColor: 'primary.orange', }, }}>DELETE YOUR ACCOUNT</Button>            
              <Box>
              </Box>
                <Button variant="contained" onClick={() => { setOpenModal(false)}} sx={{ mt:2, width: isBelowSm? '100%' : '50%', backgroundColor: 'primary.blue', color: 'white', '&:hover': { backgroundColor: 'primary.blue', color: 'white',},}}>CLOSE</Button>
              </Box>
          </Box>
      </Dialog>
    </Box>
  </>
  );
};

export default DeleteProfile;
