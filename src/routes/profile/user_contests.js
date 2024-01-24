import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { useTheme } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import useMediaQuery from '@mui/material/useMediaQuery';

import Contest from "../main_page/contest";

import UserService  from './../../services/user-service';


const UserContests = () => {
  const [contestsDataJoined, setContestsDataJoined] = useState([]);
  const [displayMode, setDisplayMode] = useState('loaded');  

  useEffect(() => {
    setDisplayMode('loading');
    document.title = "DIYSE Your Contests";
  }, []);

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
    const fetchData = async () => {
      let contestsInfoJoined = await UserService.getAllContestsEntered();

      if (contestsInfoJoined) {
        setContestsDataJoined(contestsInfoJoined.data.contests);
        setDisplayMode('loaded');
      }
    };
    fetchData();
  }, []);

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
          Your Contests
        </Typography>

        <Box textAlign="center">

            {(!contestsDataJoined.length) ?
              <Typography
                variant="h1"
                component="div"
                sx={{ fontWeight: 700, fontSize: 16, textDecoration: "none" }}
                color="primary" >
                You have not joined or created any contests.
              </Typography>
              :
              <Box>
              {contestsDataJoined.map((contests, index) => {
                  return (
                    <Contest contests={contests} key={index }/>
                  );
                })}
              </Box>
            }
        </Box>
      </Box>
    </Box>    
  
  );
};

export default UserContests;
