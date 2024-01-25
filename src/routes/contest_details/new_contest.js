import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material';
import ContestDetailNewContestDialog from './new_contest_dialog';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';

import UserService  from './../../services/user-service';    
import history from './../../services/history';
import settings from './../../services/settings';
import { useAuth } from "./../../services/use-auth.js";

export default function ContestDetailNewContest(props) {
  const theme = useTheme();
  const { contest_key } = useParams();
  const contestDetails = props.contestDetails;
  const pendingEntry = props.pendingEntry;
  const prevPortfolioListCount = props.prevPortfolioListCount;
  const allowContestEntry = props.allowContestEntry;

  const auth = useAuth();

  const isAboveLg = useMediaQuery(theme.breakpoints.up(1400));
  const isBelowMd = useMediaQuery(theme.breakpoints.down(930));
  const isBelowSm = useMediaQuery(theme.breakpoints.down(600));
  const [showDialog, setShowDialog] = useState(false);
  const [displayNameDialog, setDisplayNameDialog] = useState(false);
  const [displayContactDialog, setDisplayContactDialog] = useState(false);

  const openDialogHandler = () => {
    if (prevPortfolioListCount > 0) {
      setShowDialog(true);
    } else {
      UserService.getContactData()
      .then(
        (response) => {
          if (response) {
            let allow_continue = true;
            if (contestDetails.entry_fee > 0) {
                if (! response.data.first_name) {
                  setDisplayContactDialog(true);
                  allow_continue = false;
                }
            }
            if (allow_continue === true) {
              if (auth.user.display_name.includes("diyser-")) {
                setDisplayNameDialog(true);
                allow_continue = false;            
              }
            }
            if (allow_continue === true) {
              UserService.getEntryKey(contest_key)
              .then((response) => {
                if (response) {
                  history.push("/portfolio/"+contest_key+"/"+response.data.contest_entry_key);
                }
              });
            }
          }
        }
      )}
    };

  const handleProfileLink = (e) => {
    e.preventDefault();
    localStorage.setItem('redirectAfterDisplayName', history.location.pathname);
    history.push("/edit_profile");
  };  
  
  const handleNewEntry = (e) => {
    e.preventDefault();    
    UserService.getEntryKey(contest_key)
    .then((response) => {
      if (response) {
        history.push("/portfolio/"+contest_key+"/"+response.data.contest_entry_key);
      }
    });
  };

  const handleBalanceLink = () => {
    history.push("/account_balance");
  };
  
  let screen = 'large';
  let gridTemplateColumns = '1fr 1fr 1fr';
  if (isAboveLg) {
    screen = 'xLarge';
    gridTemplateColumns = '1fr 1fr 1fr 1fr';
  } else if (isBelowSm) {
    screen = 'sm';
    gridTemplateColumns = '1fr';
  } else if (isBelowMd) {
    screen = 'mid';
    gridTemplateColumns = '1fr 1fr';
  }
  return (
    <Box
      sx={{
        mt: isBelowSm ? 2 : 4,
        display: 'flex',
        alignItems: 'center',
        textAlign: 'center',
        flexDirection: 'column',
        gap: isBelowSm ? 1 : 2,
      }}
    >
      {contestDetails.status==="pending" && contestDetails.is_cancelled===false &&
        <>
        {allowContestEntry && !pendingEntry && (
          <>
            <ContestDetailNewContestDialog
              isOpen={showDialog}
              contestDetails={contestDetails}
              onClose={() => setShowDialog(false)}
            />
            <Box sx={{ width: '100%' }}>
              <Button
                onClick={openDialogHandler}
                variant="contained"
                sx={{
                  width: isBelowSm ? '100%' : 600,
                  height: isBelowSm ? 30 : 56,
                  fontWeight: 700,
                  fontSize: isBelowSm ? 15 : 18,
                  backgroundColor: '#3669EF',
                  color: 'white',
                  '&: hover': { backgroundColor: '#3669EF', color: 'white' },
                }}
              >
                CREATE NEW CONTEST ENTRY
              </Button>
            </Box>
          </>
        )}

        {!allowContestEntry && !pendingEntry && contestDetails.entry_fee > 0 && contestDetails.allow_free_entries === false && contestDetails.certified === false && (
          <Typography color="primary" sx={{fontWeight: 600, fontSize: 24, textDecoration: "none", textAlign: "center" }}>Your account cannot join <a href={ `${settings.faq_join_paid_contest}` } target="_new">paid contests</a>.</Typography>
        )}
        {allowContestEntry && !pendingEntry && contestDetails.entry_fee > 0 && contestDetails.allow_free_entries === true && (
          <>
            <Typography color="primary" sx={{mb: 0, fontWeight: 600, fontSize: 12, textDecoration: "none", textAlign: "center" }}>This contest accepts both paid and free entries.</Typography>
            <Typography color="primary" sx={{mt: 0, fontWeight: 600, fontSize: 11, textDecoration: "none", textAlign: "center" }}>Free entries are not eligible to win real money, but can track to see how you perform against other user’s portfolios.</Typography>
          </>
        )}
        {allowContestEntry && !pendingEntry && contestDetails.entry_fee > 0 && contestDetails.allow_free_entries === false && (
          <Typography color="primary" sx={{fontWeight: 600, fontSize: 12, textDecoration: "none", textAlign: "center" }}>This contest accepts only paid entries.</Typography>
        )}
        {allowContestEntry && !pendingEntry && contestDetails.entry_fee === 0 && (
          <Typography color="primary" sx={{fontWeight: 600, fontSize: 12, textDecoration: "none", textAlign: "center" }}>This contest accepts free entries.</Typography>
        )}
        {pendingEntry && (
          <Button
            onClick={(event) => handleNewEntry(event)}
            variant="contained"
            sx={{
              width: isBelowSm ? '100%' : 600,
              height: isBelowSm ? 30 : 56,
              fontWeight: 700,
              fontSize: isBelowSm ? 15 : 18,
              backgroundColor: '#3669EF',
              color: 'white',
              '&: hover': { backgroundColor: '#3669EF', color: 'white' },
            }}
          >
            CONTINUE WITH EXISTING CONTEST ENTRY
          </Button>
        )}
    
        {contestDetails.number_of_entrants >= contestDetails.max_entrants && (
          <Typography color="primary" sx={{fontWeight: 800, fontSize: 16, textDecoration: "none" }}>The contest is full.</Typography>
        )}
    
        {contestDetails.entry_fee > 0 && contestDetails.allow_free_entries === false && contestDetails.user_balance < contestDetails.entry_fee && contestDetails.certified === true && (
          <>
            <Typography color="primary" sx={{fontWeight: 800, fontSize: 16, textDecoration: "none", display:'inline' }}>
              You do not have a high enough  <a href={ `${settings.faq_join_paid_contest}` } target="_new">account balance</a> to enter the contest. {' '}
              <Button 
                onClick={handleBalanceLink} 
                variant="contained"
                sx={{
                  width: isBelowSm ? '100%' : 300,
                  height: isBelowSm ? 30 : 28,
                  fontWeight: 700,
                  fontSize: isBelowSm ? 12 : 15,
                  backgroundColor: '#3669EF',
                  color: 'white',
                  '&: hover': { backgroundColor: '#3669EF', color: 'white' },
                }}
                >VIEW ACCOUNT BALANCE</Button>
            </Typography>
          </>
        )}
        
        {contestDetails.previous_entries && contestDetails.previous_entries.length>0 && contestDetails.status === "pending" && (
          <Typography sx={{fontWeight: 700, fontSize: 14 }}>Click on a previous entry to modify it before the contest starts: </Typography>
        )}
  
        <Box
          sx={{
            width: '100%',
            display: 'grid',
            gridTemplateColumns,
            alignItems: 'center',
            mt: isBelowSm ? 2 : 1,
            rowGap: isBelowSm ? 2 : 6,
            '& button': {
              width: isBelowSm ? '100%' : 285,
              height: isBelowSm ? 40 : 50,
              fontWeight: 700,
              fontSize: isBelowSm ? 12 : 14,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              lineHeight: 1.2,
            },
          }}
        >
        
          {contestDetails.previous_entries && contestDetails.previous_entries.map((entry, idx) => {
            let justifyContent = 'center';
            if (screen === 'large') {
              if (idx % 3 === 0) {
                justifyContent = 'flex-start';
              } else if (idx % 3 === 2) {
                justifyContent = 'flex-end';
              }
            }
            return (
              <Box
                key={idx}
                sx={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent,
                }}
              >
    
                  <Button
                    component={Link}
                    disabled={entry.cancelled_entry}
                    to={{pathname: `/portfolio/${contest_key}/${entry.contest_entry_key}`}}
                    variant="contained"
                    onClick={openDialogHandler}
                    sx={{
                      backgroundColor: '#E76F51',
                      color: 'white',
                      '&: hover': { backgroundColor: '#E76F51', color: 'white' },
                    }}
                  >
                    {!isBelowSm && (
                      <>
                        <Box>{entry.cancelled_entry ? 'CANCELLED' : 'VIEW'} {entry.paid_entry===true ? 'PAID' : 'FREE'} ENTRY{' '}</Box>
                        <Box>({entry.entry_date})</Box>
                      </>
                    )}
                    {isBelowSm && <Box>{entry.cancelled_entry ? 'CANCELLED' : 'VIEW'} {entry.paid_entry===true ? 'PAID' : 'FREE'} ENTRY ({entry.entry_date})</Box>}
                  </Button>
    
              </Box>
            );
          })}
        </Box>
        </>
      }
      
      {displayNameDialog === true && (
        <Dialog
          open={displayNameDialog}
          sx={{ textAlign: 'center' }}
          PaperProps={{
            style: {
              background: theme.palette.primary.mainGradient.split(';')[0],
            },
          }}
        >
          <DialogTitle
            sx={{ mt: 5, fontWeight: 700, fontSize: 18, color: '#E76F51' }}
          >
            SET YOUR DISPLAY NAME
          </DialogTitle>
          <DialogContent
            sx={{
              width: isBelowSm ? 'auto' : 380,
              fontSize: 14,
              textAlign: 'center',
            }}
          >
            <DialogContentText sx={{ maxWidth: 300, margin: '0 auto' }}>
              You need to set your display name before joining a contest.
            </DialogContentText>
          </DialogContent>
          <DialogActions
            sx={{
              mb: 5,
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              px: isBelowSm ? '32px' : '48px',
            }}
          >
            <Button
              fullWidth
              variant="contained"
              onClick={handleProfileLink}
              sx={{
                fontWeight: 700,
                fontSize: 14,
                backgroundColor: '#3669EF',
                color: 'white',
                '&: hover': {
                  backgroundColor: '#3669EF',
                  color: 'white',
                },
              }}
              autoFocus
            >
              SET DISPLAY NAME
            </Button>
          </DialogActions>
        </Dialog>
      )}
      
      {displayContactDialog === true && (
        <Dialog
          open={displayContactDialog}
          sx={{ textAlign: 'center' }}
          PaperProps={{
            style: {
              background: theme.palette.primary.mainGradient.split(';')[0],
            },
          }}
        >
          <DialogTitle
            sx={{ mt: 5, fontWeight: 700, fontSize: 18, color: '#E76F51' }}
          >
            SET YOUR CONTACT INFORMATION
          </DialogTitle>
          <DialogContent
            sx={{
              width: isBelowSm ? 'auto' : 380,
              fontSize: 14,
              textAlign: 'center',
            }}
          >
            <DialogContentText sx={{ maxWidth: 300, margin: '0 auto' }}>
              You need to set your contact information before joining a paid contest.
            </DialogContentText>
          </DialogContent>
          <DialogActions
            sx={{
              mb: 5,
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              px: isBelowSm ? '32px' : '48px',
            }}
          >
            <Button
              fullWidth
              variant="contained"
              onClick={handleProfileLink}
              sx={{
                fontWeight: 700,
                fontSize: 14,
                backgroundColor: '#3669EF',
                color: 'white',
                '&: hover': {
                  backgroundColor: '#3669EF',
                  color: 'white',
                },
              }}
              autoFocus
            >
              SET CONTACT DETAILS
            </Button>
          </DialogActions>
        </Dialog>
      )}      

    </Box>
  );
}
