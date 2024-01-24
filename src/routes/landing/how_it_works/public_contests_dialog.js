import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  useTheme,
} from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';

export default function PublicContestsDialog({ isOpen, onClose }) {
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
        Public Contests
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
            Public Contests
          </Typography>
          </Box>
          <Box sx={{mb:1}}>
          <Typography sx={{ display: 'inline', fontWeight: 400, fontSize: 14 }}>          
            To get started, first register a new DIYSE user account. After you verify your new account, you will log in and view our current public DIYSE contests that anyone can enter.
          </Typography>
          </Box>
          <Box sx={{mb:1}}>
          <Typography sx={{ display: 'inline', fontWeight: 400, fontSize: 14 }}>          
            Click on any public contest to view additional details, 
            which include when the contest starts, how long it lasts (contests may last a single day, a week, or a month) and 
            the entry fee for paid contests.
          </Typography>
          </Box>
          <Box sx={{mb:1}}>
          <Typography sx={{ display: 'inline', fontWeight: 400, fontSize: 14 }}>          
            After joining a contest, you choose the stocks that you want to include in the portfolio. You can search for any stock in 
            the DIYSE 5000, or you can use our stock groups to 
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
