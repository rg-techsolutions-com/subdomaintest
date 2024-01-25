import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import OutlinedInput from '@mui/material/OutlinedInput';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import Moment from 'moment';

import { useTheme } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import useMediaQuery from '@mui/material/useMediaQuery';

import UserService  from './../../services/user-service';
import history from './../../services/history';
import settings from './../../services/settings';

const CreateContest = () => {
  

  const display_date = Moment(); //.add(1, 'day').endOf('day');
  const future_date = Moment().add(14, 'day').endOf('day');
  const future_date2 = Moment().add(1, 'month').endOf('day');
  
  const payout_type_display_key = {'free':'Free', '50_/_50':'50/50 - Top 50% splits pool','winner_takes_all':'Winner Takes All','top_2_winners':'Top 2 Winners','top_3_winners':'Top 3 Winners','top_5_winners':'Top 5 Winners','top_10_winners':'Top 10 Winners','top_15_winners':'Top 15 Winners','top_20_winners':'Top 20 Winners'};
  
  const [displayMode, setDisplayMode] = useState('loaded');
  const [selectedNumberEntrants, setSelectedNumberEntrants] = useState(2);
  const [selectedEntryFee, setSelectedEntryFee] = useState(0);
  const [selectedPayoutStructure, setSelectedPayoutStructure] = useState("");
  const [arrNumberEntrants, setArrNumberEntrants] = useState([2]);
  const [arrEntryFees, setArrEntryFees] = useState([0]);
  const [arrPayoutTypes, setArrPayoutTypes] = useState([""]);
  const [arrPayoutGroups, setArrPayoutGroups] = useState([]);
  const [selectedStartDate, setSelectedStartDate] = useState(display_date);
  const [selectedEndDate, setSelectedEndDate] = useState(display_date);
  const [selectedFutureDate, setSelectedFutureDate] = useState(future_date);
  const [selectedFutureDate2, setSelectedFutureDate2] = useState(future_date2);
  const [contestName, setContestName] = useState("");
  const [selectedUniverse, setSelectedUniverse] = useState("diyse5000");
  const [contestIsAdjustable, setContestIsAdjustable] = useState("adjust");
  const [createErrorMessage, setCreateErrorMessage] = useState("");
  
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
    document.title = "DIYSE Create Contest";
  }, []);
  
  useEffect(() => {
    UserService.getPayoutStructure(2, 0, "")
    .then((response) => {
      if (response) {
        setArrNumberEntrants(response.data.number_entrants);
        setArrEntryFees(response.data.entry_fees);
        setArrPayoutTypes(response.data.payout_structure_options);
        setSelectedPayoutStructure(response.data.payout_structure_options[0]);
      }
    });
  }, []);

  const handleContestStartDate = (start_date) => {
    setSelectedStartDate(start_date);
    let tmp_date = start_date.clone();
    setSelectedFutureDate(future_date);
    setSelectedFutureDate2(tmp_date.add(1, 'month').endOf('day'));
    setCreateErrorMessage("");
  };
  
  const handleContestEndDate = (end_date) => {
    setSelectedEndDate(end_date);
    setCreateErrorMessage("");
  };
  
  const handleContestName = (e) => {
    e.preventDefault();
    setContestName(e.target.value);
    setCreateErrorMessage("");
  };
  
  const handleSelectUniverse = (e) => {
    e.preventDefault();
    setSelectedUniverse(e.target.value);
    setCreateErrorMessage("");
  };
  
  const handleSelectAdjustable = (e) => {
    e.preventDefault();
    setContestIsAdjustable(e.target.value);
    setCreateErrorMessage("");
  };

  const handleCreateContest = (e) => {
    e.preventDefault();
    setCreateErrorMessage("");
    let is_adjustable = true;
    if (contestIsAdjustable === 'cancel') {
      is_adjustable = false;
    }
    setDisplayMode('loading');    
    UserService.createPrivateContest(contestName, selectedStartDate.format("YYYY-MM-DD"), selectedEndDate.format("YYYY-MM-DD"), is_adjustable, selectedNumberEntrants, selectedEntryFee, selectedPayoutStructure, selectedUniverse)
    .then((response) => {
      if (response) {
        history.push("/contest/"+response.data.contest_key);
      }
    },
    (error) => {
      setCreateErrorMessage(error.response.data.error_mesg);
      setDisplayMode('loaded');    
    })
    ;
  };

  const handleSelectPayoutItem = (e, item) => {
    e.preventDefault();
    setDisplayMode('loading');
    setCreateErrorMessage("");
    let entrants = selectedNumberEntrants;
    let fee = selectedEntryFee;
    let type = selectedPayoutStructure;
    let update_payout_info = true;
    if (item === 'entrants') {
      setSelectedNumberEntrants(e.target.value);
      entrants = e.target.value;
      setSelectedPayoutStructure('');
      setArrPayoutGroups([]);
      update_payout_info = false;
    }
    if (item === 'fee') {
      setSelectedEntryFee(e.target.value);
      fee = e.target.value;
      setSelectedPayoutStructure('');
      setArrPayoutGroups([]);
      update_payout_info = false;
    }
    if (item === 'type') {
      setSelectedPayoutStructure(e.target.value);
      type = e.target.value;
    }
    UserService.getPayoutStructure(entrants, fee, type)
    .then((response) => {
      if (response) {
        setArrNumberEntrants(response.data.number_entrants);
        setArrEntryFees(response.data.entry_fees);
        setArrPayoutTypes(response.data.payout_structure_options);
        if (update_payout_info === true) {
          setArrPayoutGroups(response.data.selected_payout_structure_groups);
        }
        setDisplayMode('loaded');
      }
    });
  };
  
  return (

    <Box className={displayMode} sx={{ my, px, color: 'text.primary' }}>
      <Box>
        <IconButton LinkComponent={Link} to={{ pathname: '/contests' }}>
          <ArrowBackIosIcon />
          <Typography sx={{ fontSize: isBelowSm ? 12 : 18, fontWeight: 500 }}>
            CONTEST LOBBY
          </Typography>
        </IconButton>
        <Typography
          sx={{ mt: 4, fontSize: isBelowSm ? 20 : 32, fontWeight: 700 }}
        >
          Create a Private Contest
        </Typography>

        <Box textAlign="center">
          <Box sx={{ mb:10, marginLeft:'auto', marginRight:'auto', width: isBelowSm ? '100%' : '50%'}}>
            <Box fullWidth sx={{mb:3}}>
              <Typography color="primary">
                Create your own stock portfolio contest and invite your friends, family, co-workers or group to compete for 
                fun or real money prizes. Complete the details below to get started.
              </Typography>
            </Box>
            
            <FormControl fullWidth sx={{mb:3}}>
              <InputLabel htmlFor="create-contest-entrants-id">Number of Entrants</InputLabel>
              <Select
                fullWidth
                id="create-contest-entrants-id"
                label="Number of Entrants"
                value={selectedNumberEntrants}
                onChange={(event) => {handleSelectPayoutItem(event, 'entrants')}}
              >
                {arrNumberEntrants.map((item, index) =>
                  <MenuItem key={item} value={item}>{item}</MenuItem>
                )}
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{mb:3}}>
              <InputLabel htmlFor="create-contest-fees-id">Entry Fee</InputLabel>
              <Select
                fullWidth
                id="create-contest-fees-id"
                label="Entry Fee"
                value={selectedEntryFee}
                onChange={(event) => {handleSelectPayoutItem(event, 'fee')}}
              >
                {arrEntryFees.map((item, index) => 
                  <MenuItem key={item} value={item}>{ item > 0 ? '$'+item+'.00' : 'Free' }</MenuItem>
                )}
              </Select>
            </FormControl>

            {selectedEntryFee > 0 && (
              <FormControl fullWidth>
                <Select
                  fullWidth
                  id="create-contest-types-id"
                  value={selectedPayoutStructure}
                  displayEmpty
                  onChange={(event) => {handleSelectPayoutItem(event, 'type')}}
                >
                  <MenuItem disabled value="">
                    <em>Choose a Payout Type</em>
                  </MenuItem>
                  {arrPayoutTypes.map((item, index) =>
                    <MenuItem key={item} value={item}>{payout_type_display_key[item]}</MenuItem>
                  )}
                </Select>
                {arrPayoutGroups.length > 0 && (
                  <Box sx={{mt:3, ml:4}}>
                    {arrPayoutGroups.map((item, index) =>
                      <Typography key={index} sx={{ fontWeight: 400, fontSize: 16, pb:1}} color="primary">Place {item['r']}: ${item['a'].toFixed(2)}</Typography>
                    )}
                  </Box>
                )}
              </FormControl>
            )}
    
            <FormControl fullWidth sx={{mt:3}}>
              <OutlinedInput 
                fullWidth
                required
                id="create-contest-name-id" 
                value={contestName}
                type='text'
                placeholder="Enter a name for your contest (e.g. Friday Showdown, Pat's Challenge)" 
                onChange={(event) => {handleContestName(event)}}            
                />
            </FormControl>
            
            <FormControl fullWidth sx={{mt:3}}>
              <InputLabel id="create-contest-universe-id">Stock Universe</InputLabel>
              <Select
                fullWidth
                id="create-contest-universe-id"
                label="Stock Universe"
                value={selectedUniverse}
                onChange={(event) => {handleSelectUniverse(event)}}
              >
                <MenuItem key="1" value="diyse5000">DIYSE 5000 - Choose from all NYSE/NASDAQ Stocks</MenuItem>
                <MenuItem key="2" value="diyse600">DIYSE 600 - Choose from High Market Cap/Volume Stocks</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl fullWidth sx={{mt:3}}>
              <Typography>Start Date</Typography>
              <LocalizationProvider dateAdapter={AdapterMoment}>
                <MobileDatePicker
                  closeOnSelect={true}
                  minDate={display_date}
                  maxDate={selectedFutureDate}
                  showToolbar={false}
                  value={selectedStartDate}
                  onChange={(event) => {handleContestStartDate(event)}}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </FormControl>
            
            <FormControl fullWidth>
              <Typography>End Date</Typography>
              <LocalizationProvider dateAdapter={AdapterMoment}>
                <MobileDatePicker
                  closeOnSelect={true}
                  minDate={display_date}
                  maxDate={selectedFutureDate2}
                  showToolbar={false}
                  value={selectedEndDate}
                  onChange={(event) => {handleContestEndDate(event)}}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </FormControl>
    
            {selectedEntryFee > 0 && selectedNumberEntrants > 2 && (
              <>
                <FormControl fullWidth sx={{mt:3}}>
                  <Typography variant="h1" component="div" sx={{ fontWeight: 400, fontSize: 14, mb:1 }} color="primary">
                    If there are fewer than {selectedNumberEntrants} entrants in your contest, do you want to:
                  </Typography>          
                  <RadioGroup
                    aria-labelledby="create-contest-adjust-option"
                    value={contestIsAdjustable}
                    name="adjust-group"
                    onChange={(event) => {handleSelectAdjustable(event)}}
                  >
                    <FormControlLabel value="adjust" control={<Radio />} label={<Typography variant="h1" component="div" sx={{ fontWeight: 400, fontSize: 14, mb:1 }} color="primary">Automatically adjust the prize pool</Typography>} />
                    <FormControlLabel value="cancel" control={<Radio />} label={<Typography variant="h1" component="div" sx={{ fontWeight: 400, fontSize: 14, mb:1 }} color="primary">Cancel the contest and refund any fees</Typography>} />
                  </RadioGroup>
                </FormControl>
                <a href={ `${settings.faq_adjust_contest}` } style={{color:"RoyalBlue", fontSize: 14}} target="_new">Learn more about adjusting the prize pool</a>
              </>
            )}
            {createErrorMessage && (
              <FormControl fullWidth>
                <Typography variant="h1" component="div" sx={{ fontWeight: 600, fontSize: 16, mb:1, mt:1 }} color="red">
                  Error: {createErrorMessage}
                </Typography>
              </FormControl>
            )}

            <Box>
              <Typography variant="h1" component="div" sx={{ fontWeight: 400, fontSize: 14, mb:1, mt:1 }} color="primary">
                <Button variant="contained" onClick={(e) => handleCreateContest(e) } sx={{ mt:4, width: isBelowSm? '100%' : '50%', backgroundColor: 'primary.blue', color: 'white', '&:hover': { backgroundColor: 'primary.blue', color: 'white',},}}>CREATE CONTEST</Button>                
              </Typography>
            </Box>

          </Box>
        </Box>
      </Box>
    </Box>    
    
  );
};

export default CreateContest;
