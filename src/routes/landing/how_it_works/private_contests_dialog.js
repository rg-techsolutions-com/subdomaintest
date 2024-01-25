import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  useTheme,
} from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';

export default function PrivateContestsDialog({ isOpen, onClose }) {
  const theme = useTheme();
  const isBelowSm = useMediaQuery(theme.breakpoints.down(600));

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}

      PaperProps={{
        style: {
          background: theme.palette.primary.mainGradient.split(';')[0],
        },
      }}
    >
      <DialogTitle
        sx={{ mt: 5, fontWeight: 700, fontSize: 18, color: 'primary.orange' }}
      >
        Private Contests
      </DialogTitle>
      <DialogContent
        sx={{
          width: isBelowSm ? 'auto' : 380,
          fontSize: 14,
        }}
      >
        <Box>
          <Box sx={{mb:1}}>
          <Typography sx={{ fontWeight: 600, fontSize: 14 }}>
            Joining Private Contests
          </Typography>
          </Box>
          <Box sx={{mb:1}}>
          <Typography sx={{ display: 'inline', fontWeight: 400, fontSize: 14 }}>
            To join a private contest, first register a new DIYSE user account. After you verify your new account, you will log in and be able to view the details of the private contest
            that you were invited to, and can view additional details which include when the contest starts, how long it lasts (contests may last a single day, a week, or a month) and 
            the entry fee for paid contests.
          </Typography>
          </Box>
          <Box sx={{mb:1}}>
          <Typography sx={{ display: 'inline', fontWeight: 400, fontSize: 14 }}>
            After joining a private contest, you choose the stocks that you want to include in the portfolio. You can search for any stock in the DIYSE 5000, or you can use our stock groups to 
            quickly find high market cap, biggest gainers, or correlated stocks to your other picks.
          </Typography>
          </Box>
          <Box sx={{mb:1}}>
          <Typography sx={{ display: 'inline', fontWeight: 400, fontSize: 14 }}>
            Once you are satisfied with your stock picks, you can submit your portfolio to the contest. You can make changes to your portfolio up until the start time of the contest,
            but after the contest starts, no changes can be made.
          </Typography>
          </Box>
          <Box sx={{mb:1}}>
          <Typography sx={{ display: 'inline', fontWeight: 400, fontSize: 14 }}>
            Once the contest starts, you can view the Leaderboard to see how your 
            portfolio compares to other contest entries. Contest results are displayed at the end of the contest,
            and you are able to see how your competitors performed as well as their portfolio selections.
          </Typography>
          </Box>
          <Box sx={{mb:1}}>
          <Typography sx={{ fontWeight: 600, fontSize: 14 }}>
            Hosting Private Contests
          </Typography>
          </Box>
          <Box sx={{mb:1}}>
          <Typography sx={{ display: 'inline', fontWeight: 400, fontSize: 14 }}>
            To host a private contest, first register a new DIYSE user account. After you verify your new account, you will log in and a button will appear in the Contest Lobby to create a private 
            contest. As the host, you can choose the entry fee and payout structure, the start and end dates, the stock universe (the DIYSE 5000 or DIYSE 600) 
            and a custom name for the contest.
          </Typography>
          </Box>
          <Box sx={{mb:1}}>
          <Typography sx={{ display: 'inline', fontWeight: 400, fontSize: 14 }}>
            After creating a private contest, you will receive an email with a custom link to your private contest as well as a sample message that you can cut-and-paste to send to your
            friends using your email, social media or other method. When they receive the message from you, they will go to a page just like this in order to get started.
          </Typography>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions
        sx={{
          mb: 5,
          px: isBelowSm ? '32px' : '48px',
        }}
      >
        <Button
          fullWidth
          variant="outlined"
          onClick={onClose}
          sx={{
            fontWeight: 700,
            fontSize: 14,
            borderColor: 'primary.orange',
            '&: hover': {
              backgroundColor: 'transparent',
              borderColor: 'primary.orange',
            },
          }}
        >
          CLOSE
        </Button>
      </DialogActions>
    </Dialog>
  );
}
