import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  Pagination as MuiPagination,
} from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import ContestDetailSecurityDialog from './security_dialog';

import UserService  from './../../services/user-service';
import settings from './../../services/settings';

const colorBluePagination = '#3469ef';
const colorBlueActiveTableBG = '#3669EF';
const colorYellow = '#FFB821';
const boxShadowActiveTable =
  '0px 8px 32px rgba(23, 68, 130, 0.06), 0px 0px 1px rgba(23, 68, 130, 0.48)';
const borderRadiusActiveTable = '6px';

const Pagination = styled((props) => <MuiPagination {...props} />)(
  ({ theme }) => ({
    '& button': { fontWeight: 700 },
    '& .MuiPaginationItem-page.Mui-selected': {
      background: 'transparent',
      border: '1px solid',
      borderColor: colorBluePagination,
    },
  })
);

export default function ContestDetailsTable(props) {
  const { contest_key } = useParams();
  
  const [showDialog, setShowDialog] = useState(false);
  const [dialogDisplayName, setDialogDisplayName] = useState(null);
  const [displayMode, setDisplayMode] = useState('loaded');
  
  const [resultType, setResultType] = useState(false);
  const [resultsPage, setResultsPage] = useState(1);
  const [resultsCount, setResultsCount] = useState(1);
  const [resultsData, setResultsData] = useState([]);
  const [resultsUser, setResultsUser] = useState([]);
  const [isCancelled, setIsCancelled] = useState(false);
  const [pieChartData, setPieChartData] = useState([]);

  const contestName = props.contestName;

  useEffect(() => {
    setResultType(props.resultType);
    setResultsData(props.resultsData);
    setResultsUser(props.resultsUser);
    setResultsCount(props.resultsCount);
    setIsCancelled(props.isCancelled);
  }, [props]);    

  const theme = useTheme();
  const isBelowMd = useMediaQuery(theme.breakpoints.down(930));
  const isBelowSm = useMediaQuery(theme.breakpoints.down(600));
  const closeDialogHandler = () => {
    setShowDialog(false);
  };
  const openDialogHandler = (contest_entry_key, display_name) => {
    UserService.getPieChartData(contest_key, contest_entry_key)
    .then((response) => {
      setPieChartData(response.data.entries);
      setShowDialog(true);
      setDialogDisplayName(display_name);
    })
    .catch(error => {
      console.log('No pie chart data');
      //setMessage({ ErrorPieChart: "No data" });
    });
  };

  const handleResultsPagination = (event, value) => {
    setDisplayMode('loading');
    setResultsPage(value);
    if (resultType === 'Results') {
      UserService.getContestResults(contest_key, value)
      .then((response) => {
        if (response) {
          setResultsCount(response.data.total_pages);
          setResultsData(response.data.all_entries);
          setResultsUser(response.data.user_entries);
          setDisplayMode('loaded');
        }
      });
    }
    if (resultType === 'Leaderboard') {
      UserService.getLeaderBoards(contest_key, value)
      .then((response) => {
        if (response) {
          setResultsCount(response.data.total_pages);
          setResultsData(response.data.all_entries);
          setResultsUser(response.data.user_entries);
          setDisplayMode('loaded');
        }
      });
    }
  };
  
  return (
    <Box
      className={displayMode}
      sx={{
        mt: isBelowSm ? 2 : 3,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        alignItems: 'center',
      }}
    >

      {resultsData.length === 0 && resultType === 'Results' && isCancelled === false && (
        <>
          <Typography
            variant="h1"
            sx={{ fontWeight: 700, fontSize: 24, textDecoration: "none", pb:5 }}
            color="primary" >
            RESULTS BEING CALCULATED....
          </Typography>
        </>
      )}
    
      {resultsData.length > 0 && (
        <>
          <ContestDetailSecurityDialog
            isOpen={showDialog}
            onClose={closeDialogHandler}
            displayName={dialogDisplayName}
            contestName={contestName}
            pieChartData={pieChartData}
          />
          <Typography
            sx={{ fontSize: isBelowSm ? 20 : 32, fontWeight: 700 }}
          >
            {resultType}
          </Typography>
          <Typography
            variant="h1"
            sx={{ fontSize: isBelowSm ? 12 : 18, fontWeight: 700 }}            
            color="primary" >
            <a href={ `${settings.faq_results_calculated}` } style={{color:'RoyalBlue'}} target="_new">How are results calculated?</a>
          </Typography>
          <TableContainer
            component={Paper}
            sx={{
              background: 'transparent',
              boxShadow: 'none',
            }}
          >
          
            <Table
              sx={{
                minWidth: 428,
                '& td': {
                  fontWeight: 700,
                  fontSize: isBelowMd ? 15 : 18,
                  borderColor: 'rgba(97, 103, 113, 0.2)',
                },
                '& th': {
                  fontWeight: 400,
                  fontSize: isBelowMd ? 15 : 18,
                  borderColor: 'rgba(97, 103, 113, 0.2)',
                },
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell align="center">Place</TableCell>
                  <TableCell align="center">Display Name</TableCell>
                  {resultType === 'Results' && (
                    <TableCell align="center">Prize Payout</TableCell>
                  )}
                  <TableCell align="center">Portfolio Percent Gain/Loss</TableCell>
                  <TableCell align="center"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {resultsPage === 1 && resultsUser.map((row) => (
                  <TableRow
                    key={row.place}
                    onClick={openDialogHandler.bind(null, row.contest_entry_key, row.display_name)}                    
                    sx={{
                      cursor: 'pointer',
                      backgroundColor: true
                        ? colorBlueActiveTableBG
                        : 'transparent',
                      boxShadow: true ? boxShadowActiveTable : 'none',
                      borderRadius: true ? borderRadiusActiveTable : '0px',
                    }}
                  >
                    <TableCell align="center">{row.place}</TableCell>
                    <TableCell align="center">{row.display_name}</TableCell>
                    {resultType === 'Results' && (
                      <TableCell align="center">
                        {row.prize ? '$'+row.prize.toFixed(2) : ''}
                      </TableCell>
                    )}
                    <TableCell align="center">
                      {row.formatted_loss_gain}
                    </TableCell>
                    <TableCell align="center">
                      <Typography
                        sx={{
                          color: true ? colorYellow : 'inherit',
                          textDecoration: 'underline',
                          fontWeight: 'bold'
                        }}
                      >
                        VIEW SECURITIES
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
                {resultsData.map((row) => (
                  <TableRow
                    key={row.place}
                    onClick={openDialogHandler.bind(null, row.contest_entry_key, row.display_name)}                    
                    sx={{
                      cursor: 'pointer',                    
                      backgroundColor: false
                        ? colorBlueActiveTableBG
                        : 'transparent',
                      boxShadow: false ? boxShadowActiveTable : 'none',
                      borderRadius: false ? borderRadiusActiveTable : '0px',
                    }}
                  >
                    <TableCell align="center">{row.place}</TableCell>
                    <TableCell align="center">{row.display_name}</TableCell>
                    {resultType === 'Results' && (
                      <TableCell align="center">
                        {row.prize ? '$'+row.prize.toFixed(2) : ''}
                      </TableCell>
                    )}
                    <TableCell align="center">
                      {row.formatted_loss_gain}
                    </TableCell>
                    <TableCell align="center">
                      <Typography
                        sx={{
                          color: false ? colorYellow : 'inherit',
                          textDecoration: 'underline',
                          fontWeight: 'bold'
                        }}
                      >
                        VIEW SECURITIES
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
    
          </TableContainer>
          <Box>
            <Pagination shape="rounded" count={resultsCount} page={resultsPage} onChange={handleResultsPagination} variant="outlined" size="large"/>
          </Box>
        </>
      )}
      
      {resultsData.is_cancelled === false && (
        <Box>
          <Typography color="primary" sx={{mt: 10, fontWeight: 600, fontSize: 12, textDecoration: "none", textAlign: "center" }}><a style={{ color: 'RoyalBlue' }}  href={ `${settings.faq_stock_delisted}` } target="_new">What if a stock in my portfolio was de-listed?</a></Typography>
        </Box>
      )}
    </Box>
  );
}
