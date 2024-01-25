import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import PrivateContestHowItWork from './how_it_works/private_contest_how_it_work';
import PrivateContestCTA from './private_contest_cta';
import PrivateContestInvite from './private_contest_invite';
import PrivateContestSteps from './private_contest_steps';
import PrivateContestTest from './private_contest_test';

import UserService  from './../../services/user-service';

const PrivateContestLanding = () => {
  const theme = useTheme();
  const isBelowLg = useMediaQuery(theme.breakpoints.down(1200));
  const isBelowSm = useMediaQuery(theme.breakpoints.down(600));
  let px = 10;
  let gap = 8;
  if (isBelowLg) {
    px = 3;
    gap = 6;
  }
  let my = 4;
  if (isBelowSm) {
    my = 1;
    gap = 4;
  }
  
  const { contest_key } = useParams();
  const [contestDetails, setContestDetails] = useState([]);
  const [displayMode, setDisplayMode] = useState('loaded');
  const [invalidContest, setInvalidContest] = useState(false);
  
  useEffect(() => {
    document.title = "DIYSE Private Contest";
  });  
  
  useEffect(() => {
    setDisplayMode('loading');    
    UserService.getPrivateContestDetails(contest_key)
    .then((response) => {
      if (response) {
        setContestDetails(response.data);
        localStorage.setItem('private_contest_key', contest_key);
        setDisplayMode('loaded');    
      }
    })
    .catch(error => {
      setInvalidContest(true);
      setDisplayMode('loaded');    
    });    
  },[contest_key]);
  
  
  return (
    <Box className={displayMode} 
      sx={{
        my,
        px,
        color: 'text.primary',
        display: 'flex',
        flexDirection: 'column',
        gap,
      }}
    >
      {invalidContest === false && 
        <PrivateContestInvite contestDetails={contestDetails} />
      }
      <PrivateContestSteps />
      <PrivateContestTest />
      <PrivateContestHowItWork />
      <PrivateContestCTA />
    </Box>
  );
};

export default PrivateContestLanding;
