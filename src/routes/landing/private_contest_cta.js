import { useHistory } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  useTheme,
  useMediaQuery,
} from '@mui/material';

export default function PrivateContestCTA() {
  const history = useHistory();
  const theme = useTheme();
  const isBelowMd = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 4,
        flexDirection: isBelowMd ? 'column' : 'row',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          flex: 1,
          gap: 2,
        }}
      >
        <Typography sx={{ fontWeight: 700, fontSize: 24 }}>
          Ready to join a contest?
        </Typography>
        <Button
          onClick={() => history.push('/signin')}
          variant="contained"
          fullWidth
          size="large"
          sx={{
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
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          flex: 1,
          gap: 2,
        }}
      >
        <Typography sx={{ fontWeight: 700, fontSize: 24 }}>
          Need to create an account?
        </Typography>
        <Button
          onClick={() => history.push('/signup')}
          variant="outlined"
          fullWidth
          size="large"
          sx={{
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
  );
}
