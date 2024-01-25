import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';

import UserService  from './../../services/user-service';


import ContestDetailsMoreDetails from './more_details';
import ContestDetailsHeader from './header';
import ContestDetailNewContest from './new_contest';
import ContestDetailsTable from './table';



const ContestDetails = () => {
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
  
  const { contest_key } = useParams();
  const [contestDetails, setContestDetails] = useState([]);
  const [accountBalance, setAccountBalance] = useState(0);
  const [allowContestEntry, setAllowContestEntry] = useState(false);
  const [pendingEntry, setPendingEntry] = useState(false);
  const [prevPortfolioListCount, setPrevPortfolioListCount] = useState(0);
  const [participants, setParticipants] = useState('No entries');
  const [resultType, setResultType] = useState(false);
  const [resultsData, setResultsData] = useState([]);
  const [resultsUser, setResultsUser] = useState([]);
  const [resultsCount, setResultsCount] = useState(1);
  const [resultsPage, setResultsPage] = useState(1);

  useEffect(() => {
    let status = false;
    UserService.getContestDetails(contest_key)
    .then((response) => {
      if (response) {
        status = response.data.status;
        setContestDetails(response.data);
        setAccountBalance(response.data.user_balance);
        if (response.data.status === "pending") {
          setAllowContestEntry(true);
          if (response.data.allow_multiple_entries === false) {
            let has_valid_entry = false;
            if (response.data.previous_entries.length > 0) {
              for (const entry in response.data.previous_entries) {
                if (response.data.previous_entries[entry].cancelled_entry === false) {
                  has_valid_entry = true;
                }
              }
              if (has_valid_entry === true) {
                setAllowContestEntry(false);
              }
            }
          }
          if (response.data.number_of_entrants >= response.data.max_entrants) {
              setAllowContestEntry(false);
          }
          if (response.data.entry_fee > 0 && response.data.is_public === false) {
            if (response.data.user_balance < response.data.entry_fee) {
              setAllowContestEntry(false);
            }
          }
          if (response.data.entry_fee > 0 && response.data.is_public === true) {
            if (response.data.allow_free_entries === false) {
              if (response.data.user_balance < response.data.entry_fee) {
                setAllowContestEntry(false);
              }
            }
          }
          if (response.data.entry_fee > 0 && response.data.allow_free_entries === false && response.data.certified === false) {
            setAllowContestEntry(false);            
          }
          setPendingEntry(response.data.pending_entry);
          UserService.getPreviousPortfolios(contest_key)
          .then((response) => {
            if (response) {
              if (response.data.portfolio_count) {
                setPrevPortfolioListCount(response.data.portfolio_count);
              }
            }
          });
        } else {
          setAllowContestEntry(false);
        }
        UserService.getContestParticipants(contest_key, 20)
        .then((response) => {
          if (response) {
            let participant_list = response.data.participants.join(', ');
            setParticipants(participant_list);
            if (status === "started") {
              UserService.getLeaderBoards(contest_key)
              .then((response) => {
                if (response) {
                    setResultType('Leaderboard');
                    setResultsPage(response.data.current_page_number);
                    setResultsCount(response.data.total_pages);
                    setResultsData(response.data.all_entries);
                    setResultsUser(response.data.user_entries);
                }
              });
            }
            if (status === "closed") {
              UserService.getContestResults(contest_key)
              .then((response) => {
                if (response) {
                  setResultType('Results');
                  setResultsPage(response.data.current_page_number);
                  setResultsCount(response.data.total_pages);
                  setResultsData(response.data.all_entries);
                  setResultsUser(response.data.user_entries);
                }
              });
            }
          }
        });
      }
    });
  }, [contest_key]);
  
  return (
    <Box sx={{ my, px, color: 'text.primary' }}>
      <ContestDetailsHeader contestDetails={contestDetails} accountBalance={accountBalance} />
      <ContestDetailsMoreDetails contestDetails={contestDetails} participants={participants} />
      <ContestDetailNewContest contestDetails={contestDetails} pendingEntry={pendingEntry} prevPortfolioListCount={prevPortfolioListCount} allowContestEntry={allowContestEntry} />
      {contestDetails.status==="started" &&
        <ContestDetailsTable contestName={contestDetails.name} isCancelled={contestDetails.is_cancelled} resultType={resultType} resultsPage={resultsPage} resultsCount={resultsCount} resultsData={resultsData} resultsUser={resultsUser} />
      }
      {contestDetails.status==="closed" &&
        <ContestDetailsTable contestName={contestDetails.name} isCancelled={contestDetails.is_cancelled} resultType={resultType} resultsPage={resultsPage} resultsCount={resultsCount} resultsData={resultsData} resultsUser={resultsUser} />
      }
    </Box>
  );
};

export default ContestDetails;
