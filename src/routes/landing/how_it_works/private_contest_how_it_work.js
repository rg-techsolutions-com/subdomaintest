import { useState } from 'react';
import {
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  CardActions,
  Button,
} from '@mui/material';
import PublicContestsDialog from './public_contests_dialog';
import PrivateContestsDialog from './private_contests_dialog';

export default function PrivateContestHowItWork() {
  const theme = useTheme();
  const isBelowMd = useMediaQuery(theme.breakpoints.down('md'));
  let bg = theme.palette.primary.mainGradient.split(';')[0];
  let isDark = theme.palette.mode === 'dark';
  //White card background for light mode
  if (!isDark) {
    bg = 'white';
  }

  const [isPublicDialogOpen, setIsPublicDialogOpen] = useState(false);
  const openPublicDialogHandler = () => {
    setIsPublicDialogOpen(true);
  };
  const closePublicDialogHandler = () => {
    setIsPublicDialogOpen(false);
  };

  const [isPrivateDialogOpen, setIsPrivateDialogOpen] = useState(false);
  const openPrivateDialogHandler = () => {
    setIsPrivateDialogOpen(true);
  };
  const closePrivateDialogHandler = () => {
    setIsPrivateDialogOpen(false);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <PublicContestsDialog
        isOpen={isPublicDialogOpen}
        onClose={closePublicDialogHandler}
      />
      <PrivateContestsDialog
        isOpen={isPrivateDialogOpen}
        onClose={closePrivateDialogHandler}
      />
      <Typography sx={{ fontSize: 24, fontWeight: 700, textAlign: 'center' }}>
        How do the Contests Work?
      </Typography>
      <Box
        sx={{
          display: 'flex',
          gap: 4,
          flexDirection: isBelowMd ? 'column' : 'row',
        }}
      >
        <Card sx={{ background: bg, flex: 1, minHeight: 200 }}>
          <CardContent
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
            }}
          >
            <Typography
              sx={{ fontSize: 24, textAlign: 'center', fontWeight: 700 }}
            >
              Public Contests
            </Typography>
            <Typography color="text.secondary" sx={{ textAlign: 'center' }}>
              How do I enter a contest, and what does it take to win?
            </Typography>
          </CardContent>
          <CardActions sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              onClick={openPublicDialogHandler}
              variant="outlined"
              size="large"
              sx={{
                fontWeight: 700,
                fontSize: 14,
                borderColor: 'primary.blue',
                '&: hover': {
                  borderColor: 'primary.blue',
                },
              }}
            >
              LEARN MORE
            </Button>
          </CardActions>
        </Card>
        <Card sx={{ background: bg, flex: 1, minHeight: 200 }}>
          <CardContent
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
            }}
          >
            <Typography
              sx={{ fontSize: 24, textAlign: 'center', fontWeight: 700 }}
            >
              Private Contests
            </Typography>
            <Typography color="text.secondary" sx={{ textAlign: 'center' }}>
              How do I host a contest for my friends, or join a contest hosted
              by them?
            </Typography>
          </CardContent>
          <CardActions sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              onClick={openPrivateDialogHandler}
              variant="outlined"
              size="large"
              sx={{
                fontWeight: 700,
                fontSize: 14,
                borderColor: 'primary.blue',
                '&: hover': {
                  borderColor: 'primary.blue',
                },
              }}
            >
              LEARN MORE
            </Button>
          </CardActions>
        </Card>
      </Box>
    </Box>
  );
}
