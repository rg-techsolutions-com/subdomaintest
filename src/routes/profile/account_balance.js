import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ChevronRefreshIcon from '@mui/icons-material/Refresh';

import { useTheme } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import useMediaQuery from '@mui/material/useMediaQuery';

import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import UserService  from './../../services/user-service';
import history from './../../services/history';

const AccountBalance = () => {

  const [displayMode, setDisplayMode] = useState('loaded');
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [pending, setPending] = useState([]);
  
  const columns = ['Date','Type','Method','Amount'];
  const columns_pending = ['Date','Type','Method'];

  const theme = useTheme();
  const isBelowLg = useMediaQuery(theme.breakpoints.down(1200));  
  const isBelowSm = useMediaQuery(theme.breakpoints.down(600));
  let px = 10;
  if (isBelowLg) {
    px = 3;
  }
  let my = 4;
  if (isBelowSm) {
    my = 1;
  }
  
  useEffect(() => {
    setDisplayMode('loading');
    document.title = "DIYSE Account Balance";
  }, []);
  
  useEffect(() => {
    const fetchData = async () => {
      UserService.getAccountData()
      .then(
        (response) => {
          if (response) {
            setBalance(response.data.balance);
            setTransactions(response.data.transactions);
            setPending(response.data.pending);
            setDisplayMode('loaded');
          }
        });
    };
    fetchData();
  }, []);
  
  const handleClickRefresh = () => {
    setDisplayMode('loading');
    UserService.getAccountData()
    .then(
      (response) => {
        if (response) {
          setBalance(response.data.balance);
          setTransactions(response.data.transactions);
          setPending(response.data.pending);
          setDisplayMode('loaded');
        }
    });  
  };
  
  const handleClickContestEntry = (e, contest_key) => {
    e.preventDefault();
    if (contest_key) {
      history.push("/contest/"+contest_key);
    }
  };
  
  return (
  <>
    <Box className={displayMode} sx={{ my, px, color: 'text.primary' }}>
      <Box>
        <IconButton LinkComponent={Link} to={{ pathname: '/profile' }}>
          <ArrowBackIosIcon />
          <Typography sx={{ fontSize: isBelowSm ? 12 : 18, fontWeight: 500 }}>
            PROFILE
          </Typography>
        </IconButton>
        <Typography
          sx={{ mt: 4, fontSize: isBelowSm ? 20 : 32, fontWeight: 700 }}
        >
          Account Balance
        </Typography>
      </Box>
      <Box>
        <Typography variant="h1" component="div" sx={{ fontWeight: 400, fontSize: 18, mt:1 }} color="primary">
          Current Balance: ${ balance.toFixed(2) }
        </Typography>
        <Button variant="contained" component={Link} to={{ pathname: `/add_funds` }} sx={{ mt:1, width: isBelowSm? '100%' : '20%', backgroundColor: 'primary.blue', color: 'white', '&:hover': { backgroundColor: 'primary.blue', color: 'white',},}}>ADD FUNDS</Button>      
        <Button variant="contained" component={Link} to={{ pathname: `/add_funds` }} sx={{ ml:1,  mt:1, width: isBelowSm? '100%' : '20%', backgroundColor: 'primary.blue', color: 'white', '&:hover': { backgroundColor: 'primary.blue', color: 'white',},}}>WITHDRAW FUNDS</Button>      
        
        <Box item xs={12} justify="right" textAlign="right">
          <Typography variant="h1" component="div" sx={{ mt:1, fontWeight: 400, fontSize: 16, cursor: 'pointer' }} color="primary" onClick={(e) => handleClickRefresh(e)}>
            <ChevronRefreshIcon /> Refresh
          </Typography>
        </Box>        
        
        {pending.length > 0 &&
          <>
            <Typography variant="h1" component="div" sx={{ fontWeight: 400, fontSize: 20, mb:2 }} color="primary">
              Pending Transactions
            </Typography>
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
              <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader aria-label="sticky table">
                  <TableHead>
                    <TableRow>
                      {columns_pending.map((column, index) => (
                        <TableCell key={index}>
                          {column}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {pending.map((row, index) => {
                        return (
                          <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                            <TableCell>
                              {row['date']}
                            </TableCell>
                            <TableCell>                            
                              {row['type']}
                            </TableCell>
                            <TableCell>
                                {row['method']}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </>
        }
          
        <Typography variant="h1" component="div" sx={{ fontWeight: 400, fontSize: 20, mb:4 }} color="primary">
          Transactions
        </Typography>
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column, index) => (
                    <TableCell key={index}>
                      {column}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions.map((row, index) => {
                    return (
                      <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                        <TableCell>
                          {row['date']}
                        </TableCell>
                        {row['contest'] && (
                          <TableCell onClick={(e) => { handleClickContestEntry(e, row['contest_key']) }} sx={{color:'RoyalBlue', cursor:'pointer'}}>
                            {row['contest']}
                          </TableCell>
                        )}
                        {!row['contest'] && (
                          <TableCell>                            
                            {row['type']}
                          </TableCell>
                        )}
                        <TableCell>
                            {row['method']}
                        </TableCell>
                        {row['amount'] > 0 &&
                          <TableCell sx={{ color:'DarkGreen'}}>
                            {row['formatted_amount']}
                          </TableCell>
                        }
                        {row['amount'] < 0 &&
                          <TableCell>
                            {row['formatted_amount']}
                          </TableCell>
                        }
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
                
      </Box>
    </Box>
  </>
  );
};

export default AccountBalance;    