import { useHistory } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  useTheme,
  useMediaQuery,
} from '@mui/material';

export default function PrivateContestInvite(props) {
  const history = useHistory();
  const theme = useTheme();
  const isBelowSm = useMediaQuery(theme.breakpoints.down('sm'));
  const contestDetails = props.contestDetails;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: isBelowSm ? 'column' : 'row',
        gap: 4,
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
        <Box>
          {contestDetails.is_cancelled === false && contestDetails.status === "pending" && (        
            <Typography component="div" sx={{ fontWeight: 700, fontSize: 16 }}>You have been invited to join a private contest!</Typography>
          )}
          <Typography sx={{ fontWeight: 700, fontSize: 22, mt: 1 }}>{contestDetails.name}</Typography>
          <Typography sx={{ fontWeight: 600, fontSize: 14 }}>created by {contestDetails.private_username}</Typography>
        </Box>
          {contestDetails.is_cancelled===false &&
            <>
            <Box>
              <Box>
                <Typography sx={{ display: 'inline', fontWeight: 700, fontSize: 15 }}>Starts: </Typography>
                <Typography sx={{ display: 'inline', fontWeight: 400, fontSize: 14 }}>
                  {contestDetails.start_date_formatted} {contestDetails.start_time_formatted}
                  {contestDetails.status === "pending" && 
                    <>
                      {' '}({contestDetails.time_until_start})
                    </>
                  }
                </Typography>
              </Box>
              <Box>
                <Typography sx={{ display: 'inline', fontWeight: 700, fontSize: 15 }}>Ends: </Typography>
                <Typography sx={{ display: 'inline', fontWeight: 400, fontSize: 14 }}>
                  {contestDetails.end_date_formatted} {contestDetails.end_time_formatted}
                </Typography>
              </Box>
            </Box>
            </>
          }
          {contestDetails.allow_multiple_entries === false &&
            <Box>
              <Typography sx={{ display: 'inline', fontWeight: 700, fontSize: 15 }}>Only one entry per person</Typography>
            </Box>
          }
          {contestDetails.is_cancelled===true &&
            <Box>
              <Typography sx={{ display: 'inline', fontWeight: 700, fontSize: 15 }}>This contest has been cancelled</Typography>
            </Box>
          }
          {contestDetails.status!=="pending" &&              
            <Box>
              <Typography sx={{ display: 'inline', fontWeight: 700, fontSize: 15 }}>This contest has started and new entries cannot be made</Typography>
            </Box>
          }
          {contestDetails.is_cancelled===false && contestDetails.status === "pending" &&       
            <>
              {contestDetails.entry_fee > 0 && (
                <>
                  <Box>
                    <Typography sx={{ fontWeight: 700, fontSize: 15, display: 'inline'}}>Entry fee:</Typography>{' '}
                    <Typography sx={{ display: 'inline', fontWeight: 400, fontSize: 14}}>${contestDetails.entry_fee}</Typography>
                  </Box>
                  <Box>
                    <Typography sx={{ fontWeight: 700, fontSize: 18, display: 'inline'}}>Prize pool:</Typography>{' '}
                    <Typography sx={{ display: 'inline', fontWeight: 400, fontSize: 18}}>${contestDetails.total_prize_amount.toFixed(2)}</Typography>
                    <Box>
                      {contestDetails.payout_structure && contestDetails.payout_structure.map((item, index) =>
                        <Box key={index}>
                          <Typography sx={{ fontWeight: 700, fontSize: 15, display: 'inline'}}>{item.start_place_formatted}{item.end_place_formatted ? '-'+item.end_place_formatted : ''}: </Typography>
                          <Typography sx={{ display: 'inline', fontWeight: 400, fontSize: 14}}>{item.payout_formatted}</Typography>
                        </Box>
                      )}
                    </Box>
                  </Box>
                </>
              )}
              {contestDetails.entry_fee === 0 && (              
                <Box>
                  <Typography sx={{ fontWeight: 700, fontSize: 15, display: 'inline'}}>Free contest</Typography>
                </Box>
              )}
            </>
          }
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
          flex: 1,
          alignItems: isBelowSm ? 'flex-start' : 'center',
        }}
      >
        <Box>
          <Typography sx={{ fontSize: 14 }}>
            {' '}
            Ready to join the contest?
          </Typography>
          <Button
            onClick={() => history.push('/')}
            variant="contained"
            size="large"
            sx={{
              mt: 2,
              fontWeight: 700,
              backgroundColor: 'primary.blue',
              color: 'white',
              '&: hover': {
                backgroundColor: 'primary.blue',
                color: 'white',
              },
            }}
          >
            LOG IN
          </Button>
        </Box>
        <Box>
          <Typography sx={{ fontSize: 14 }}>
            {' '}
            Need to create an account?
          </Typography>
          <Button
            onClick={() => history.push('/signup')}
            variant="outlined"
            size="large"
            sx={{
              mt: 2,
              fontWeight: 700,
              borderColor: 'primary.blue',
              '&: hover': {
                borderColor: 'primary.blue',
              },
            }}
          >
            SIGN UP
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
