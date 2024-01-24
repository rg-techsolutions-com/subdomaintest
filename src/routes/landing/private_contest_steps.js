import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  useTheme,
  useMediaQuery,
} from '@mui/material';

const STEPS = [
  {
    title: 'Choose a Contest',
    content:
      ' Choose from our daily or weekly contests. You can play against your friends in private contests where you choose the stakes, or test your investing skills in public contests.',
  },
  {
    title: 'Select Your Portfolio',
    content:
      'Allocate your notional budget across your favorite stocks. Create multiple entries to test different investing theories and market insights.',
  },
  {
    title: 'Track The Leaderboard',
    content:
      'Benchmark your performance and profit from your investing skills. Watch the leaderboard throughout the contest and see how you perform against other investors and market indicies.',
  },
];

const Step = ({ stepNum, title, content, bg }) => (
  <Card sx={{ background: bg, flex: 1 }}>
    <CardContent
      sx={{
        minHeight: '160px',
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
      }}
    >
      <Box
        sx={{
          width: '100%',
          fontWeight: '700',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Avatar sx={{ color: 'white', bgcolor: 'primary.blue' }}>
          {stepNum}
        </Avatar>
      </Box>
      <Typography sx={{ fontSize: 24, textAlign: 'center', fontWeight: 700 }}>
        {title}
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ textAlign: 'center' }}
      >
        {content}
      </Typography>
    </CardContent>
  </Card>
);

export default function PrivateContestSteps() {
  const theme = useTheme();
  let bg = theme.palette.primary.mainGradient.split(';')[0];
  const isDark = theme.palette.mode === 'dark';
  //White card background for light mode
  if (!isDark) {
    bg = 'white';
  }
  const isBelowMd = useMediaQuery(theme.breakpoints.down('md'));
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        gap: 2,
        flexDirection: isBelowMd ? 'column' : 'row',
      }}
    >
      {STEPS.map((step, i) => (
        <Step
          key={i}
          bg={bg}
          stepNum={i + 1}
          title={step.title}
          content={step.content}
        />
      ))}
    </Box>
  );
}
