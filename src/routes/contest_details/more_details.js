import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import {
  Link,
  Box,
  Menu,
  Typography,
  Accordion as MuiAccordion,
  AccordionSummary as MuiAccordionSummary,
  AccordionDetails as MuiAccordionDetails,
} from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  useTheme,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import UserService  from './../../services/user-service';  
import history from './../../services/history';
import settings from './../../services/settings';

const Content = (props) => {
  const { contest_key } = useParams();  
  const [warningMessage, setWarningMessage] = useState([]);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [portfolioEntries, setPortfolioEntries] = useState([]);  
  const contestDetails = props.contestDetails;
  const participants = props.participants;

  const theme = useTheme();
  const isBelowSm = useMediaQuery(theme.breakpoints.down(600));
  const handleOpenModal = () => setOpenModal(true);
  const handleClose = () => setOpenModal(false);
  
  const handleCancelPopup = (e) => {
    e.preventDefault();
    setWarningMessage({
      headerMes: 'CANCEL CONTEST?',
      mess: 'Cancelling the contest will refund the entry fee to any current participants, if applicable.',
      closeButton: true
    });    
    setShowCancelDialog(true);
  };  

  const handleCancelContest = (e) => {
    e.preventDefault();
    UserService.cancelPrivateContest(contest_key)
    .then((response) => {
      history.push("/contests");
    });
  };
    
  const handleOldEntries = (e, contestEntryKey) => {
    e.preventDefault();
    UserService.getPortfolioList(contestEntryKey)
    .then((response) => {
      setPortfolioEntries(response.data.entries);
    });
  };

  return (
    <Box
      sx={{
        maxWidth: 338,
        '& p': {
          display: 'flex',
          flexDirection: 'column'
        },
      }}
    >
      <Box>
        <Typography>
          {contestDetails.start_date_formatted === contestDetails.end_date_formatted && (
            <>
              Contest date: {contestDetails.start_date_formatted}
            </>
          )}

          {contestDetails.start_date_formatted !== contestDetails.end_date_formatted && (
            <>
              Start date: {contestDetails.start_date_formatted}{' '}
              End date: {contestDetails.end_date_formatted} {contestDetails.end_time_formatted}
            </>
          )}
        </Typography>        
      </Box>
      
      {contestDetails.entry_fee > 0 && (
        <>
          <Box>
            <Typography>Entry fee: ${contestDetails.entry_fee}</Typography>
            <Typography>Your account balance: ${contestDetails.user_balance}</Typography>
            {contestDetails.allow_free_entries === true &&
              <Typography>Non-prize eligible free entries allowed</Typography>
            }
            {contestDetails.allow_multiple_entries === false &&
              <Typography>Only one entry allowed per person</Typography>
            }            
          </Box>
          <Box sx={{ mt: 2 }}>
            <Typography sx={{ color: '#E76F51' }}>Payouts: ${contestDetails.total_prize_amount}</Typography>
            {contestDetails.is_resized === true && (
              <Box>
                <Typography>
                  <a href={ `${settings.faq_adjust_contest}` } style={{color:"RoyalBlue", fontSize: 14}} target="_new">(Adjusted based on actual number of entries)</a>
                </Typography>
              </Box>
            )}
            {contestDetails.payout_structure && contestDetails.payout_structure.map((item, index) =>
              <Typography key={index}>{item.start_place_formatted}{item.end_place_formatted ? '-'+item.end_place_formatted : ''} place: {item.payout_formatted}</Typography>
            )}
          </Box>
        </>
      )}
      {contestDetails.entry_fee === 0 && (
        <>
          <Box>
            <Typography>Free contest</Typography>
          </Box>
        </>
      )}
      {contestDetails.sponsor_prize !== false && (
        <>
          <Box sx={{ mt: 2 }}>
            <Typography sx={{ color: '#E76F51' }}>Sponsored Prize: {contestDetails.sponsor_prize}</Typography>
            <Typography>
              {contestDetails.sponsor_details}
            </Typography>
            <Typography>
              <a href={ `${contestDetails.sponsor_url}` } style={{color:"RoyalBlue"}} target="_new">{contestDetails.sponsor_url}</a>
            </Typography>
          </Box>
        </>
      )}      
      <Box sx={{ mt: 2 }}>
        <Typography sx={{ fontWeight: 600, fontSize: 16 }}>Security universe:</Typography>
        <Typography sx={{ fontWeight: 400, fontSize: 16 }}>{contestDetails.stock_universe} ({contestDetails.universe_description})</Typography>
        <Typography sx={{ fontWeight: 600, fontSize: 16 }}>Participants:</Typography>
        <Typography sx={{ fontWeight: 400, fontSize: 16 }}>{participants}</Typography>
      </Box>
      {contestDetails.status==="pending" && contestDetails.is_private_owner === true && contestDetails.is_public === false && contestDetails.is_cancelled === false && (
        <Box>
          <Button
            onClick={(event) => { handleCancelPopup(event)}}
            variant="contained"
            sx={{
              mt: 2,
              width: 300,
              height: 28,
              fontWeight: 700,
              fontSize: 15,
              backgroundColor: '#3669EF',
              color: 'white',
              '&: hover': { backgroundColor: '#3669EF', color: 'white' },
            }}
           >Cancel Contest</Button>
        </Box>
      )}      
      
      {(contestDetails.status==="started" || contestDetails.status==="closed") &&(
        <Box>
         {contestDetails.previous_entries && contestDetails.previous_entries.map((item, index) =>
           <Box key={index}>
            <Button
              onClick={(event) => { handleOpenModal(); handleOldEntries(event, item.contest_entry_key);}}
              disabled={item.cancelled_entry}
              to={{pathname: `/portfolio/${contest_key}/${item.contest_entry_key}`}}
              variant="contained"
              sx={{
                my:1,
                backgroundColor: '#E76F51',
                color: 'white',
                '&: hover': { backgroundColor: '#E76F51', color: 'white' },
              }}
            >
              <Box>{item.cancelled_entry ? 'CANCELLED' : 'VIEW'} {item.paid_entry===true ? 'PAID' : 'FREE'} ENTRY{' '}</Box>
              <Box>({item.entry_date})</Box>
            </Button>
                 
           </Box>
         )}
        </Box>
      )}

      {showCancelDialog  && (
        <Dialog
          open={showCancelDialog}
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
            {warningMessage.headerMes}
          </DialogTitle>
          <DialogContent
            sx={{
              width: isBelowSm ? 'auto' : 380,
              fontSize: 14,
              textAlign: 'center',
            }}
          >
            <DialogContentText sx={{ maxWidth: 300, margin: '0 auto' }}>
             {warningMessage.mess}
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
              onClick={(event) => { handleCancelContest(event)}}
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
              CANCEL CONTEST
            </Button>
            <Button
              fullWidth
              variant="outlined"
              onClick={(event) => { setShowCancelDialog(false)}}
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
              CLOSE
            </Button>
          </DialogActions>
        </Dialog>      
      )}      

        <Dialog
          open={openModal}
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
            <Box item md={12} >
              <Button
                fullWidth
                variant="outlined"
                onClick={handleClose}
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
                CLOSE
              </Button>
            </Box>
          </DialogTitle>
          <DialogContent
            sx={{
              width: isBelowSm ? 'auto' : 380,
              fontSize: 14,
              textAlign: 'center',
            }}
          >
            {portfolioEntries.map((portfolio, index) => (
              <Box
                item
                container
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                xs={12}
                sx={{mb:4, borderBottom: 3, pb: 4, borderColor: 'secondary.main'}} portfolio={portfolio} key={index}>
                <Box sx={{ display: 'block' }}>
                  <Typography
                    sx={{ fontWeight: 400, fontSize: 14, pb:1 }}
                    color="primary"
                    >
                    {portfolio.security_name} ({portfolio.symbol})
                  </Typography>
                  {portfolio.is_short
                    ?  <Typography component="div" sx={{ fontWeight: 700, fontSize: 14, color:'#FF5151', textAlign: 'center' }}>SHORT POSITION, {portfolio.percent}%</Typography>
                    :  <Typography component="div" sx={{ fontWeight: 700, fontSize: 14, color:'#00DE81', textAlign: 'center' }}>LONG POSITION, {portfolio.percent}%</Typography>
                  }
                </Box>
              </Box>
            ))}
          </DialogContent>
        </Dialog>

    </Box>
    
  );
};

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  backgroundColor: 'transparent',
  display: 'inline-block',
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&:before': {
    display: 'none',
  },
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor: 'transparent',
  display: 'inline-flex',
  padding: 0,
  '& .MuiAccordionSummary-expandIconWrapper': {
    transform: 'rotate(90deg)',
    display: 'inline-block',
    marginLeft: 2,
  },
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(-90deg)',
    marginLeft: 6,
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

const MoreDetailsMobile = (props) => (
  <Accordion>
    <AccordionSummary aria-controls="panel1d-content" id="panel1d-header" sx={{width:1}} expandIcon={<ExpandMoreIcon sx={{ color: 'primary.main', transform: 'rotate(90deg)' }} />}>
      <Typography sx={{ color: '#E76F51', fontWeight: 500 }}>
        More Details
      </Typography>
    </AccordionSummary>
    <AccordionDetails><Content contestDetails={props.contestDetails} participants={props.participants} /></AccordionDetails>
  </Accordion>
);

const MoreDetailsDeskTop = (props) => {
  const theme = props.theme;
  const contestDetails = props.contestDetails;
  const participants = props.participants;

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseDeskTop = () => {
    setAnchorEl(null);
  };
  return (
    <Box sx={{ mt: 3 }}>
      <Link
        sx={{
          color: '#E76F51',
          fontWeight: 500,
          cursor: 'pointer',
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
        }}
        onClick={handleClick}
      >
        <Typography>More Details</Typography>
        <Box
          sx={{
            color: 'primary.main',
            mt: open ? 0 : 1,
            mb: open ? 1 : 0,
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        >
          <KeyboardArrowDownIcon />
        </Box>
      </Link>
      <Menu
        open={open}
        anchorEl={anchorEl}
        onClose={handleCloseDeskTop}
        PaperProps={{
          sx: {
            background: theme.palette.primary.mainGradient.split(';')[0],
          },
        }}
      >
        <Box sx={{ padding: 4 }}>
          <Content contestDetails={contestDetails} participants={participants}/>
        </Box>
      </Menu>
    </Box>
  );
};

export default function ContestDetailsMoreDetails(props) {
  const theme = useTheme();
  const contestDetails = props.contestDetails;
  const participants = props.participants;

  const isDeskTop = useMediaQuery(theme.breakpoints.up(1200));
  let ret = false;
  if (isDeskTop) {
    ret = <MoreDetailsDeskTop theme={theme} contestDetails={contestDetails} participants={participants} />
  } else {
    ret = <MoreDetailsMobile contestDetails={contestDetails} participants={participants} />
  }
  return ret;
}
