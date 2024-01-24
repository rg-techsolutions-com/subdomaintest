import {
  Box,
  Typography,
  TableContainer,
  Table,
  useTheme,
  useMediaQuery,
  Paper,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material';

const TABLE_DATA = [
  { title: 'Amplify returns by:', DIY: '', liveRetailTrading: '' },
  {
    title: 'Selecting highest performing stocks',
    DIY: 'Yes',
    liveRetailTrading: 'Yes',
  },
  { title: 'Concentrating holdings', DIY: 'No', liveRetailTrading: 'Yes' },
  { title: 'Trading more frequently', DIY: 'No', liveRetailTrading: 'Yes' },
  { title: 'Taking more downside risk', DIY: 'No', liveRetailTrading: 'Yes' },
  { title: 'Using more leverage', DIY: 'No', liveRetailTrading: 'Yes' },
  { title: 'Bingeing on intraday news', DIY: 'No', liveRetailTrading: 'Yes' },
];

const TableRowItem = ({ title, DIY, liveRetailTrading }) => {
  const isDIY = DIY === 'Yes';
  const isLiveRetailTrading = liveRetailTrading === 'Yes';
  return (
    <TableRow>
      <TableCell>{title}</TableCell>
      <TableCell sx={{ color: isDIY ? 'success.main' : 'error.main' }}>
        {DIY}
      </TableCell>
      <TableCell
        sx={{ color: isLiveRetailTrading ? 'success.main' : 'error.main' }}
      >
        {liveRetailTrading}
      </TableCell>
    </TableRow>
  );
};

export default function PrivateContestTest() {
  const theme = useTheme();
  const isBelowMd = useMediaQuery(theme.breakpoints.down('md'));
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box sx={{ textAlign: 'center' }}>
        <Typography sx={{ fontSize: 24, fontWeight: 700 }}>
          The DIYSE Contest Platform is the Purest Test of Relative Investing Skill
        </Typography>
        <Typography
          sx={{
            color: 'text.secondary',
            maxWidth: 960,
            margin: '0 auto',
            fontSize: 20,
            fontWeight: 500,
            mt: 1,
          }}
        >
          We put everyone on an equal footing by requiring diversification, prohibiting
          active portfolio rebalancing during a contest, and prohibiting leverage
          or option trading.
        </Typography>
      </Box>
      <TableContainer
        component={Paper}
        sx={{
          background: 'transparent',
          boxShadow: 'none',
        }}
      >
        <Table
          sx={{
            '& td': {
              fontWeight: 700,
              fontSize: isBelowMd ? 15 : 18,
              borderColor: 'rgba(97, 103, 113, 0.2)',
            },
          }}
        >
          <thead>
            <TableRow>
              <TableCell align="left"></TableCell>
              <TableCell align="left">DIYSE</TableCell>
              <TableCell align="left">Live Retail Trading</TableCell>
            </TableRow>
          </thead>
          <TableBody>
            {TABLE_DATA.map((item) => (
              <TableRowItem
                key={item.title}
                title={item.title}
                DIY={item.DIY}
                liveRetailTrading={item.liveRetailTrading}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
