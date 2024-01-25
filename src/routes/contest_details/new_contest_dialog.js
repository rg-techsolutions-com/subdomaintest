import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  useTheme,
} from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';

import UserService  from './../../services/user-service';  
import history from './../../services/history';
import { useAuth } from "./../../services/use-auth.js";

export default function ContestDetailNewContestDialog({ isOpen, onClose, contestDetails }) {
  const { contest_key } = useParams();
  const theme = useTheme();
  const isBelowSm = useMediaQuery(theme.breakpoints.down(600));
  const [displayNameDialog, setDisplayNameDialog] = useState(false);
  const [displayContactDialog, setDisplayContactDialog] = useState(false);

  const auth = useAuth();

  useEffect(() => {
    if (auth.user.display_name.includes("diyser-")) {
      setDisplayNameDialog(true);
    } else {
      if (contestDetails.entry_fee > 0) {
        UserService.getContactData()
        .then(
          (response) => {
            if (response) {
              if (! response.data.first_name) {
                setDisplayContactDialog(true);
              }
            }
          }
        );
      }
    }
  }, [auth.user.display_name, contestDetails.entry_fee]);
  


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
  
  const handlePrevEntry = (e) => {
    e.preventDefault();    
    UserService.getEntryKey(contest_key)
    .then((response) => {
      if (response) {
        history.push("/portfolio/"+contest_key+"/"+response.data.contest_entry_key+"/previous-portfolios");
      }
    });
  };

  return (
    <>
      {displayNameDialog === false && (
        <Dialog
          open={isOpen}
          onClose={onClose}
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
            NEW OR PREVIOUS PORTFOLIO?
          </DialogTitle>
          <DialogContent
            sx={{
              width: isBelowSm ? 'auto' : 380,
              fontSize: 14,
              textAlign: 'center',
            }}
          >
            <DialogContentText sx={{ maxWidth: 300, margin: '0 auto' }}>
              Would you like to start a completely new portfolio, or re-use or modify an
              existing portfolio?
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
              onClick={handleNewEntry}
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
              NEW ENTRY
            </Button>
            <Button
              fullWidth
              variant="outlined"
              onClick={handlePrevEntry}
              sx={{
                fontWeight: 700,
                fontSize: 14,
                borderColor: '#3669EF',
                '&: hover': {
                  backgroundColor: 'transparent',
                  borderColor: '#3669EF',
                },
              }}
            >
              VIEW PREVIOUS PORTFOLIOS
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {displayNameDialog === true && (
        <Dialog
          open={isOpen}
          onClose={onClose}
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
          open={isOpen}
          onClose={onClose}
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

    </>
  );
}
