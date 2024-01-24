import { useState, useEffect, Fragment } from "react";
import { useParams, Link } from "react-router-dom";
import { useTheme } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';

import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableCell  from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';

import IconButton from '@mui/material/IconButton';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import AddIcon from '@mui/icons-material/Add';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Input from '@mui/material/Input';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';

import history from './../../services/history';
import UserService  from './../../services/user-service';
import settings from './../../services/settings';

const CreatePortfolio = (props) => {
  const { contest_key, contestEntryKey} = useParams();  
  const [displayMode, setDisplayMode] = useState('loaded');
  const [displayGetStartedDialog, setDisplayGetStartedDialog] = useState(false);
  const [portfolioListData, setPortfolioListData] = useState([]);
  const [portfolioEntries, setPortfolioEntries] = useState([]);
  const [searchChoiceDialog, setSearchChoiceDialog] = useState(false);
  const [groupData, setGroupData] = useState([]);
  const [subgroupData, setSubgroupData] = useState([]);
  const [stockData, setStockData] = useState([]);
  const [searchString, setSearchString] = useState("");
  const [subgroupType, setSubgroupType] = useState(false);  
  const [selectedPortfolioRow, setSelectedPortfolioRow] = useState({});
  const [warningMessage, setWarningMessage] = useState("");
  const [openWarningMessage, setOpenWarningMessage] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [limitedSelection, setLimitedSelection] = useState(false);
  const [rearrangeEntries, setRearrangeEntries] = useState(false);
  const [selectedCheckedStocks, setSelectedCheckedStocks] = useState([]);
  const [groupFilter, setGroupFilter] = useState("");
  const [filterParam] = useState(["symbol", "security_name"]);
  const [allowMultipleEntries, setAllowMultipleEntries] = useState(true);

  const theme = useTheme();
  const isBelowSm = useMediaQuery(theme.breakpoints.down(600));
  const isBelowLg = useMediaQuery(theme.breakpoints.down(1200));
  const isBelowMd = useMediaQuery(theme.breakpoints.down(930));
  const isDark = theme.palette.mode === 'dark';  
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
    document.title = "DIYSE - Portfolio";
  }, []);
  
  useEffect(() => {
    const fetchData = () => {
      UserService.getPortfolioList(contestEntryKey)
      .then((response) => {
        if (response) {
          setPortfolioListData(response.data);
          setPortfolioEntries(response.data.entries);
          checkValidationMessage(response.data);
          setDisplayMode('loaded');
          if (response.data.entries.length === 0) {
            let tmp_portfolio = [];
            tmp_portfolio.push({"security_name":"Pick Stock #1", "symbol":"TEMP_1", "percent":1, "is_short":false});
            tmp_portfolio.push({"security_name":"Pick Stock #2", "symbol":"TEMP_2", "percent":1, "is_short":false});
            tmp_portfolio.push({"security_name":"Pick Stock #3", "symbol":"TEMP_3", "percent":1, "is_short":false});
            setPortfolioEntries(tmp_portfolio);
            setDisplayGetStartedDialog(true);
          }
          if (response.data.allow_multiple_entries === false) {
            setAllowMultipleEntries(false);
          }
          if (response.data.selected_entries === 0) {
            setDisplayGetStartedDialog(true);
          }
          if (response.data.selected_entries === 3 && response.data.entries.length === 3) {
            UserService.getTemplatesForEntry(contestEntryKey)
            .then(
              (response) => {
                if (response) {
                  setTemplates(response.data.templates);
                  if (response.data.limited_selection === true) {
                    setLimitedSelection(true);
                  } else {
                    setLimitedSelection(false);
                  }
                }
              });
          }
        }
      });
    };
    fetchData();
    // Complaining about checkValidationMessages, which is a function
    // eslint-disable-next-line
  }, [contest_key, contestEntryKey]);
  
  
  useEffect(() => {
    const fetchData = () => {
      if ( searchString.length > 0 ) {
        const limit = 15; //Endpoint requirement
        UserService.getStocks(contestEntryKey, searchString, limit, "")
        .then(
          (response) => {
            if (response) {
              setStockData(response.data.stocks);
            }
          });
      } else {
        setStockData([]);
      }
    };
    fetchData();
  }, [contestEntryKey, searchString]);
  
  const handleSearchStock = (event) => {
    const searchString = event.target.value;
    setSearchString(searchString);
  };
  
  const handleCloseGetStartedDialog = () => setDisplayGetStartedDialog(false);

  const handleRearrangeEntries = (e) => {
    e.preventDefault();
    if (rearrangeEntries === true) {
      setRearrangeEntries(false);
    } else {
      setRearrangeEntries(true);
    }
  };

  const handleRearrangeItem = (e, index, direction) => {
    e.preventDefault();
    setDisplayMode('loading');

    let index2 = false;
    if (direction === 'up') {
      index2 = index - 1;
    } else {
      index2 = index + 1;
    }

    let tmp_portfolio = portfolioEntries;
    let index_item_name = portfolioEntries[index]['security_name'];
    let index_item_symbol = portfolioEntries[index]['symbol'];
    let index_item_is_short = portfolioEntries[index]['is_short'];
    let index2_item = portfolioEntries[index2];
    tmp_portfolio[index]['symbol'] = index2_item['symbol'];
    tmp_portfolio[index]['security_name'] = index2_item['security_name'];
    tmp_portfolio[index]['is_short'] = index2_item['is_short'];
    tmp_portfolio[index2]['symbol'] = index_item_symbol;
    tmp_portfolio[index2]['security_name'] = index_item_name;
    tmp_portfolio[index2]['is_short'] = index_item_is_short;

    UserService.sendEntryKeySettings(contestEntryKey, tmp_portfolio)
    .then((response) => {
      if (response) {
        UserService.getPortfolioList(contestEntryKey)
        .then((response) => {
          if (response) {
            setPortfolioListData(response.data);
            setPortfolioEntries(response.data.entries);
            setDisplayMode('loaded');
          }
        });
      }
    });
  };

  const selectTemplateItem = (e, symbol) => {
    e.preventDefault();
    setDisplayMode('loading');
    for (const item of portfolioEntries) {
      if (item.symbol === symbol) {
        setSelectedPortfolioRow(item);
      }
    }
    const req = async () => {
      await getGroups();
      setDisplayMode('loaded');
      setSearchChoiceDialog(true);
    };
    req();
  };

  const handleDeletePortfolioItem = (e, symbol) => {
    e.preventDefault();
    setDisplayMode('loading');
    let tmp_portfolio = [];
    let counter = 1;
    for (const item of portfolioEntries) {
      if (item.symbol !== symbol) {
        tmp_portfolio.push(item);
      } else {        
        tmp_portfolio.push({"security_name":"Pick Stock #"+counter, "symbol":"TEMP_"+counter, "percent":item.percent, "is_short":false});
      }
      counter = counter + 1;
    }
    UserService.sendEntryKeySettings(contestEntryKey, tmp_portfolio)
    .then((response) => {
      if (response) {
        UserService.getPortfolioList(contestEntryKey)
        .then((response) => {
          if (response) {
            setPortfolioListData(response.data);
            setPortfolioEntries(response.data.entries);
            setDisplayMode('loaded');
          }
        });
      }
    });
  };

  const editPortfolioItem = (e, symbol) => {
    e.preventDefault();
    setWarningMessage({
      headerMes: 'CHANGE STOCK SELECTION?',
      mess: 'To change your stock selection, click the trash can item to remove it and choose a different one.',
      delButton: false,
      delEntryButton: false,
      entryAddedButton: false,
      helpUrl: false,
      closeButton: true
    });
    setOpenWarningMessage(true);
  };

  const handleDelete = (e) => {
    e.preventDefault();
    setOpenWarningMessage(false);
    UserService.deletePortfolioList(contestEntryKey)
    .then((response) => {
        if (response) {
          history.push("/contest/"+contest_key);
        }
    });
  };
  
  const handleDeleteEntry = (e) => {
    e.preventDefault();
    setOpenWarningMessage(false);
    UserService.deleteContestEntry(contestEntryKey)
    .then((response) => {
        if (response) {
          history.push("/contest/"+contest_key);
        }
    });
  };

  const handleDeleteEntries = (e) => {
    e.preventDefault();
    if (portfolioListData.editing === true && portfolioListData.validated_entry === true) {
      setWarningMessage({
        headerMes: 'DELETE CHANGES?',
        mess: 'Are you sure you want to delete the changes to your contest entry?',
        delButton: true,
        delEntryButton: false,
        entryAddedButton: false,
        helpUrl: false,
        closeButton: true
      });
    } else {
      setWarningMessage({
        headerMes: 'DELETE PORTFOLIO?',
        mess: 'Are you sure you want to delete this portfolio?',
        delButton: true,
        delEntryButton: false,
        entryAddedButton: false,
        helpUrl: false,
        closeButton: true
      });
    }
    setOpenWarningMessage(true);
  };
  
  const handleDeleteContestEntry = (e) => {
    e.preventDefault();
    if (portfolioListData.validated_entry === true) {
      let mesg = 'Are you sure you want to delete your free submitted contest entry?';
      if (portfolioListData.entry_fee > 0 && portfolioListData.paid_entry === true) {
        mesg = 'Are you sure you want to delete your submitted contest entry? Your account will be refunded your entry fee of $'+portfolioListData.entry_fee.toFixed(2);
      }
      setWarningMessage({
        headerMes: 'DELETE CONTEST ENTRY?',
        mess: mesg,
        delButton: false,
        delEntryButton: true,
        entryAddedButton: false,
        helpUrl: false,
        closeButton: true
      });
    }
    setOpenWarningMessage(true);
  };    
  
  const handleGroupDisplay = (e) => {
    e.preventDefault();
    setSubgroupType(false);
    setDisplayMode('loading');
    const req = async () => {
      await getGroups();
      setDisplayMode('loaded');
      setSearchChoiceDialog(true);
    };
    req();
  };
  
  const handleSubgroupDisplay = (e, groupKey, groupSubkey) => {
    e.preventDefault();
    setSubgroupType(false);
    setSearchChoiceDialog(false);
    setDisplayMode('loading');
    UserService.getSubgroups(contestEntryKey, groupKey, groupSubkey, "")
    .then((response) => {
      if (response) {
        setSubgroupData(response.data);
        setSubgroupType(response.data.security_list);
        setGroupData([]);
        setSearchChoiceDialog(true);
        setDisplayMode('loaded');
      }
    });
  };

  const handleGroupBackLink = (e, backKey) => {
    e.preventDefault();
    setSubgroupType(false);
    setGroupFilter("");
    if (backKey==="home") {
      handleGroupDisplay(e);
    } else {
      handleSubgroupDisplay(e, backKey, "all");
    }
  };
  
  const handleChoiceDialogClose = (e, reason) => {
    e.preventDefault();
    if (reason && reason === "backdropClick")  {
      return;
    }
    setSelectedCheckedStocks([]);
    setGroupFilter("");
    setSearchChoiceDialog(false);
  };

 const handleStockSelected = (e, symbol, editing, subgroup_title) => {
    e.preventDefault();
    let already_have = false;
    let selected_item = [];
    const prev_selected_item = selectedPortfolioRow;
    for (const item of portfolioEntries) {
      if (item.symbol === symbol) {
        setSelectedPortfolioRow(item);
        selected_item = item;
        already_have = true;
      }
    }
    if (selected_item.length === 0) {
      selected_item = selectedPortfolioRow;
    }

    if (already_have && !editing) {
      setSearchString("");
      setGroupFilter("");
      setStockData([]);
      setSelectedPortfolioRow(prev_selected_item);
      setWarningMessage({
        headerMes: 'SECURITY ALREADY SELECTED',
        mess: 'The security is already in your portfolio. Choose a different security.',
        delButton: false,
        delEntryButton: false,
        entryAddedButton: false,
        helpUrl: false,
        closeButton: true
      });
      setOpenWarningMessage(true);
    } else {
      setDisplayMode('loading');
      setSearchChoiceDialog(false);
      UserService.getValidSecurity(contestEntryKey, symbol)
      .then((response) => {
        if (response) {
          if (response.data.is_valid === false) {
            setSearchString("");
            setGroupFilter("");
            setGroupData([]);
            setSubgroupData([]);
            setWarningMessage({
              headerMes: 'INVALID SECURITY',
              mess: 'The selected security is either not valid for this contest or for the template chosen for this portfolio. You can either choose another security, or delete this portfolio and choose a different template.',
              delButton: false,
              delEntryButton: false,
              entryAddedButton: false,
              helpUrl: false,
              closeButton: true
            });
            setDisplayMode('loaded');
            setOpenWarningMessage(true);
          } else {
            // Add it to the appropriate row in the portfolio
            setSearchString("");
            setGroupFilter("");
            setStockData([]);
            setGroupData([]);
            setSubgroupData([]);
            let tmp_portfolio = [];
            UserService.getSecuritySettings(contestEntryKey, symbol)
            .then((response) => {
              if (response) {
                let securityData = response.data;
                for (const item of portfolioEntries) {
                  if (item.symbol === selectedPortfolioRow.symbol) {
                    if (subgroup_title) {
                      if (subgroup_title.includes("Correlation") && subgroup_title.includes("SHORT")) {
                        if (! subgroup_title.includes("Inverse")) {
                          item.is_short = true;
                        }
                      } else if (subgroup_title.includes("Inverse")) {
                        item.is_short = true;
                      }
                    }
                    if (item.security_name.includes("_")) {
                      tmp_portfolio.push({"security_name":securityData.security_name, "symbol":securityData.symbol, "percent":item.percent, "is_short":item.is_short});
                    } else {
                      tmp_portfolio.push({"security_name":securityData.security_name, "symbol":securityData.symbol, "percent":item.percent, "is_short":item.is_short});
                    }
                  } else {
                    tmp_portfolio.push(item);
                  }
                }
                UserService.sendEntryKeySettings(contestEntryKey, tmp_portfolio)
                .then((response) => {
                  if (response) {
                    UserService.getPortfolioList(contestEntryKey)
                    .then((response) => {
                      if (response) {
                        setPortfolioListData(response.data);
                        setPortfolioEntries(response.data.entries);
                        checkValidationMessage(response.data);
                        if (response.data.selected_entries === 3 && response.data.entries.length === 3) {
                          UserService.getTemplatesForEntry(contestEntryKey)
                          .then(
                            (response) => {
                              if (response) {
                                setTemplates(response.data.templates);
                                if (response.data.limited_selection === true) {
                                  setLimitedSelection(true);
                                } else {
                                  setLimitedSelection(false);
                                }
                              }
                            });
                        }
                        setDisplayMode('loaded');
                      }
                    });
                  }
                });
              }
            });
          }
        }
      });
    }
  };
  
  const handleWarningMessageClose = () => {
    setWarningMessage(false);
  };
  
  const handlePositionChange = (e, symbol) => {
    e.preventDefault();
    setDisplayMode('loading');
    let tmp_portfolio = [];
    for (const item of portfolioEntries) {
      if (item.symbol === symbol) {
        if (item.is_short === true) {
          item.is_short = false;
        } else {
          item.is_short = true;
        }
      }
      tmp_portfolio.push(item);
    }
    UserService.sendEntryKeySettings(contestEntryKey, tmp_portfolio)
    .then((response) => {
      if (response) {
        UserService.getPortfolioList(contestEntryKey)
        .then((response) => {
          if (response) {
            setPortfolioListData(response.data);
            setPortfolioEntries(response.data.entries);
            setDisplayMode('loaded');
          }
        });
      }
    });    
  };
  
  const handleSelectTemplate = (e, template_name) => {
    e.preventDefault();
    setDisplayMode('loading');    
    for (const item of templates) {
      if (item.code === template_name) {
        let tmp_portfolio = [];
        let percent_key = 0;
        for (const percentage of item.percentages) {
          if (percent_key <= 2) {
            let tmp_entry = portfolioEntries[percent_key];
            tmp_entry.percent = percentage;
            tmp_portfolio.push(tmp_entry);
          } else {
            let counter = percent_key + 1;
            tmp_portfolio.push({"security_name":"Pick Stock #"+counter, "symbol":"TEMP_"+counter, "percent":percentage, "is_short":false});
          }
          percent_key = percent_key + 1;
        }
        UserService.getEntryKey(contest_key, template_name)
        .then((response) => {
          UserService.sendEntryKeySettings(contestEntryKey, tmp_portfolio)
          .then((response) => {
            if (response) {
              UserService.getPortfolioList(contestEntryKey)
              .then((response) => {
                if (response) {
                  setPortfolioListData(response.data);
                  setPortfolioEntries(response.data.entries);
                  setDisplayMode('loaded');       
                }
              });
            }
          });
        });
      }
    }
  };
  
  const handleCheckboxSelected = (e, symbol, security_name) => {
    let empty_spots = 0;
    for (const i in portfolioEntries) {
      if (portfolioEntries[i].symbol.includes('_')) {
        empty_spots = empty_spots + 1;
      }
    }

    let tmp_checked = selectedCheckedStocks;
    if (selectedCheckedStocks.length >= empty_spots) {
        setWarningMessage({
          headerMes: 'TOO MANY SELECTIONS',
          mess: 'Only '+empty_spots+' selection(s) can be added to the portfolio.',
          delButton: false,
          delEntryButton: false,
          entryAddedButton: false,
          helpUrl: false,
          closeButton: true
      });
      e.target.checked = false;
      setOpenWarningMessage(true);    
    } else {
      let updated_checked = [];
      if (e.target.checked === true) {
        for (const i in tmp_checked) {
          updated_checked.push(tmp_checked[i]);
        }
        updated_checked.push(symbol);
        setSelectedCheckedStocks(updated_checked);
      } 
    }
    let updated_checked = [];
    if (e.target.checked === false) {
      for (const i in tmp_checked) {
        if (tmp_checked[i] !== symbol) {
          updated_checked.push(tmp_checked[i]);
        }
      }
      setSelectedCheckedStocks(updated_checked);
    }
  };

  const handleAddCheckedStocksToPortfolio = (e, subgroup_title) => {
    e.preventDefault();
    setDisplayMode('loading');
    setSearchChoiceDialog(false);
    let stocks_to_add = [];
    const req = async () => {
      for (const i in selectedCheckedStocks.reverse()) {
        let response = await UserService.getSecuritySettings(contestEntryKey, selectedCheckedStocks[i]);
        if (response) {       
          stocks_to_add.push(response.data);
        }        
      }
      let tmp_portfolio = [];
      for (const item of portfolioEntries) {
        if (item.symbol.includes('_')) {
          let new_item = stocks_to_add.pop();
          if (new_item) {
            item.security_name = new_item['security_name'];
            item.symbol = new_item['symbol'];
            if (subgroup_title) {
              if (subgroup_title.includes("Correlation") && subgroup_title.includes("SHORT")) {
                if (! subgroup_title.includes("Inverse")) {
                  item.is_short = true;
                }
              } else if (subgroup_title.includes("Inverse")) {
                item.is_short = true;
              }
            }            
          }
        }
        tmp_portfolio.push(item);
      }      
      UserService.sendEntryKeySettings(contestEntryKey, tmp_portfolio)
      .then((response) => {
        if (response) {
          UserService.getPortfolioList(contestEntryKey)
          .then((response) => {
            if (response) {
              setPortfolioListData(response.data);
              setPortfolioEntries(response.data.entries);
              checkValidationMessage(response.data);
              setDisplayMode('loaded');       
              setSelectedCheckedStocks([]);
            }
          });
        }
      });      
    };
    req();
  };
  
  const getGroups = () => {
    setSearchChoiceDialog(false);
    setGroupData([]);
    setStockData([]);
    setSubgroupData([]);
    UserService.getGroups(contestEntryKey, "")
    .then((response) => {
      if (response) {
        setGroupData(response.data);
        setStockData([]);
        setSubgroupData([]);
      }
    });
  };

  const checkValidationMessage = (portfolio_data) => {
    let mesg_arr = portfolio_data.validation_message;
    let number_of_portfolio_entries = portfolioEntries.length;
    if (number_of_portfolio_entries === 0) {
      let portfolio_entries = portfolio_data.entries;
      number_of_portfolio_entries = portfolio_entries.length;
    }
    if (portfolio_data.selected_entries === number_of_portfolio_entries) {
      for (let i in mesg_arr) {
        let message = mesg_arr[i];
        if (message.includes("ADTV")) {
          setWarningMessage({
            headerMes: 'LOW AVERAGE DAILY TRADING VOLUME',
            mess: 'The lowest weighted securities in your portfolio require at least one higher trading volume stock.  Replace your lowest weighted stock with a stock of your choosing from the DIYSE 600 or Highest Avg Daily Trade Volume group and your portfolio will be ready to be entered in the contest.',
            helpUrl: settings.faq_what_are_rules,
            delButton: false,
            delEntryButton: false,
            entryAddedButton: false,
            closeButton: true
          });
          setOpenWarningMessage(true);                          
        }
      }
    }
  };

  const handleSubmitEntries = (e, is_paid) => {
    e.preventDefault();
    setDisplayMode('loading');
    UserService.sendEntrySubmission(contestEntryKey, is_paid)
    .then(
      (response) => {
        if (response) {
          if (response.data.entry_accepted === true) {
            if (allowMultipleEntries === true) {
              let mesg = 'You have successfully submitted your contest entry. You can make changes to the portfolio before the contest starts by viewing your entries in the contest details. Would you like to submit another portfolio to this contest, or go back to the contest details?';
              if (is_paid === true) {
                mesg = 'You have successfully submitted your paid contest entry, and funds have been transferred from your account balance. You can make changes to the portfolio before the contest starts by viewing your entries in the contest details. Would you like to submit another portfolio to this contest, or go back to the contest details?';
              }
              setWarningMessage({
                headerMes: 'SUCCESSFUL',
                mess: mesg,
                delButton: false,
                delEntryButton: false,
                entryAddedButton: true,
                helpUrl: false,
                closeButton: false
              });
              setDisplayMode('loaded');
            } else {
              let mesg = 'You have successfully submitted your contest entry. You can make changes to the portfolio before the contest starts by viewing your entries in the contest details.';
              if (is_paid === true) {
                mesg = 'You have successfully submitted your paid contest entry, and funds have been transferred from your account balance. You can make changes to the portfolio before the contest starts by viewing your entries in the contest details.';
              }
              setWarningMessage({
                headerMes: 'SUCCESSFUL',
                mess: mesg,
                delButton: false,
                delEntryButton: false,
                entryAddedButton: true,
                helpUrl: false,
                closeButton: false
              });
              setDisplayMode('loaded');              
            }
          } else {
            setWarningMessage({
              headerMes: 'ERROR',
              mess: 'There is a problem with the portfolio. Check that it is valid and try submitting again',
              delButton: false,
              delEntryButton: false,
              entryAddedButton: false,
              helpUrl: false,
              closeButton: true
            });
            setDisplayMode('loaded');            
          }
          setOpenWarningMessage(true);
        }
      },
      (error) => {
        setWarningMessage({
          headerMes: 'ERROR',
          mess: error.data.error_mesg,
          delButton: false,
          delEntryButton: false,
          entryAddedButton: false,
          helpUrl: false,
          closeButton: true
        });
        setOpenWarningMessage(true);
        setDisplayMode('loaded');        
      }
    );
  };

  const group_filter = (items) => {
    return items.filter((item) => {
      return filterParam.some((newItem) => {
        return (
          item[newItem]
          .toString()
          .toLowerCase()
          .indexOf(groupFilter.toLowerCase()) > -1
        );
      });
    });
  };

  const handleCreateNewContestEntry = (e) => {
    e.preventDefault();    
    setOpenWarningMessage(false);    
    UserService.getEntryKey(contest_key)
    .then((response) => {
      if (response) {
        history.push("/portfolio/"+contest_key+"/"+response.data.contest_entry_key);
      }
    });      
  };
    
  return (
    <Box className={displayMode} sx={{ my, px, color: 'text.primary' }}>

      <Typography
        sx={{ mt: 4, fontSize: isBelowSm ? 20 : 32, fontWeight: 700 }}
      >
        Your Portfolio
      </Typography>

      <Divider sx={{ width: '100%', backgroundColor: 'text.primary' }} />
      
      {portfolioEntries.length <= 3 && rearrangeEntries === false && (  
        <TableContainer component={Paper} sx={{ background: 'transparent', boxShadow: 'none' }}>
          <Table
            sx={{
              '& td': {
                fontWeight: 700,
                fontSize: isBelowMd ? 15 : 18,
                borderColor: 'rgba(97, 103, 113, 0.2)',
                paddingLeft: isBelowSm ? 0.1 : 'auto',
                paddingRight: isBelowSm ? 0.1 : 'auto',
              },
              '& th': {
                fontWeight: 700,
                fontSize: isBelowMd ? 15 : 18,
                borderColor: 'rgba(97, 103, 113, 0.2)',
              },
            }}
          >
            <TableBody>
              {portfolioEntries.map((portfolio, index) => {
                return (
                  <TableRow
                    sx={{
                      cursor: 'pointer',
                      '&: hover': {
                        background: isDark
                          ? 'rgba(255,255,255,.02)'
                          : 'rgba(0,0,0,.02)',
                      },
                    }}
                  >
                    <TableCell align="left">
                      {portfolio.symbol.includes("_") && (
                        <Box>
                          <IconButton onClick={(event) => selectTemplateItem(event, portfolio.symbol)} sx={{ padding: 0, ml: 1, mr: 2,  borderWidth: '1px', borderStyle: 'solid', borderRadius: '4px', borderColor: 'primary.blue'}}><AddIcon fontSize="large" /></IconButton>
                          <Typography
                            variant="h1"
                            onClick={(e) => selectTemplateItem(e, portfolio.symbol)}
                            sx={{ fontWeight: 600, fontSize: 18, pb:1, display: 'inline' }}
                            color="primary"
                            >
                            {portfolio.security_name}
                          </Typography>
                        </Box>
                      )}
                      {!portfolio.symbol.includes("_") && (
                        <Box>
                          <IconButton aria-label="delete" sx={{mr:2}} onClick={(event) => handleDeletePortfolioItem(event, portfolio.symbol)}><DeleteForeverIcon fontSize={isBelowMd ? 'medium' : 'large'} /></IconButton>
                          <Typography
                            variant="h1"
                            onClick={(e) => editPortfolioItem(e, portfolio.symbol)}
                            sx={{ fontWeight: 600, fontSize: 20, display: 'inline' }}
                            color="primary"
                            >
                            {portfolio.symbol}
                          </Typography>
                          <Typography
                            variant="h1"
                            onClick={(e) => editPortfolioItem(e, portfolio.symbol)}
                            sx={{ fontWeight: 400, fontSize: 14, pb:1, marginLeft: "65px" }}
                            color="primary"
                            >
                            {portfolio.security_name}
                          </Typography>
                        </Box>
                      )}
                    </TableCell>
                    <TableCell align="right">
                      {portfolio.is_short && portfolio.symbol.includes("_") && (
                        <Typography variant="h1"></Typography>
                      )}
                      {!portfolio.is_short && portfolio.symbol.includes("_") && (
                        <Typography variant="h1"></Typography>
                      )}
                      {!portfolio.symbol.includes("_") && (
                        <Box
                          sx={{
                            display: isBelowMd ? 'flex' : 'static',
                            '& button': {
                              px: isBelowMd ? '4px' : '32px',
                              fontWeight: 700,
                              textTransform: 'initial',
                              fontSize: isBelowMd ? 12 : 'inhert',
                            },
                          }}
                        >
                          <Button
                            variant="contained"
                            onClick={(e) => { handlePositionChange(e, portfolio.symbol) }}
                            sx={{
                              borderTopRightRadius: 0,
                              borderBottomRightRadius: 0,
                              backgroundColor: portfolio.is_short === false ? 'primary.green' : 'white',
                              color: portfolio.is_short === false ? 'white' : '#333',
                              '&: hover': {
                                backgroundColor: portfolio.is_short === false ? 'primary.green' : 'white',
                                color: portfolio.is_short === false ? 'white' : '#333',
                              },
                            }}
                          >
                            Long
                          </Button>
                          <Button
                            variant="contained"
                            onClick={(e) => { handlePositionChange(e, portfolio.symbol) }}
                            sx={{
                              borderTopLeftRadius: 0,
                              borderBottomLeftRadius: 0,
                              backgroundColor: portfolio.is_short === false ? 'white' : 'primary.red',
                              color: portfolio.is_short === false ? '#333' : 'white',
                              '&: hover': {
                                backgroundColor: portfolio.is_short === false ? 'white' : 'primary.red',
                                color: portfolio.is_short === false ? '#333' : 'white',
                              },
                            }}
                          >
                            Short
                          </Button>
                        </Box>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {portfolioListData.selected_entries === 3 && portfolioEntries.length === 3 && (
        <Box>
          <Card sx={{ marginLeft:"auto", marginRight:"auto" }}>
            <CardContent sx={{backgroundColor: "primary.main2"}} justify="center" alignItems="center" align="center">
              <Typography variant="h5" color="text.secondary">
                Choose Your Percentage Allocation                      
              </Typography>
              {limitedSelection && (
                <Typography variant="h6" color="text.secondary">
                  Your top 3 stocks are all in the <a href={ `${settings.faq_diyse_600}` } style={{color:"RoyalBlue"}} target="_new">DIYSE 600</a>, so you can complete a high concentration portfolio of DIYSE 600 stocks by choosing among the following <a target="_new" href={ `${settings.faq_how_templates_help}` } style={{color:"RoyalBlue"}}>allocation templates</a>:
                </Typography>
              )}
              {!limitedSelection && (
                <Typography variant="h6" color="text.secondary">
                  One or more of your top 3 picks is not in the <a href={ `${settings.faq_diyse_600}` } style={{color:"RoyalBlue"}} target="_new">DIYSE 600</a>.  You can complete your portfolio with stocks in the full <a href={ `${settings.faq_diyse_5000}` } style={{color:"RoyalBlue"}} target="_new">DIYSE 5000</a> by choosing among the following <a target="_new" href={ `${settings.faq_how_templates_help}` }style={{color:"RoyalBlue"}}>allocation templates</a>:
                </Typography>
              )}
              {templates && (
                templates.map((item, index) => 
                  <Box
                    key={item.code}
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ width:'100%', mb:3, mt:2 }}
                    >
                      <Typography variant="h1" component="div" sx={{ fontWeight: 400, fontSize: 16, mb:1 }} color="primary">
                        {item.name}
                      </Typography>
                      <Box sx={{ width:'50%' }}>
                        <Typography variant="h1" component="div" sx={{ fontWeight: 400, fontSize: 12 }} color="primary">
                          {item.percent_csv_with_signs}
                        </Typography>
                      </Box>
                      <Button variant="contained" onClick={(e) => handleSelectTemplate(e, item.code)} value={index} sx={{mt: 1, backgroundColor: 'primary.blue', color: 'white', px: '68px', width: isBelowSm ? '100%' : 'auto', fontWeight: 700, alignSelf: 'flex-end', '&:hover': { backgroundColor: 'primary.blue', color: 'white', }, }}>PICK {item.remaining_securities} MORE STOCKS</Button>
                      <Box sx={{ width:'50%', mt:2,  borderBottom: 1, borderColor: 'secondary.main' }}>
                      </Box>
                  </Box>
                )
              )}
              <Typography variant="h1" component="div" sx={{ fontWeight: 400, fontSize: 12, mb:1, mt:4 }} color="primary">
                In order to legally offer stock picking contests to our users, DIYSE is required to limit the type of portfolios that can be included in our contests to ensure they are valid.
                See our FAQ for <a href={ `${settings.faq_what_are_rules}` } style={{color:'RoyalBlue'}} target="_new">more details</a>.
              </Typography>
            </CardContent>
          </Card>
        </Box>
      )}
          
      {portfolioEntries.length <= 3 && rearrangeEntries === false && (  
        <Box
          container
          sx={{ mt: 2}}
          xs={12}
          justify="right"
          textAlign="right"
          >
          <Button variant="outlined" onClick={(e) => handleDeleteEntries(e)} sx={{ borderColor: 'primary.orange', '&:hover': { backgroundColor: 'transparent', borderColor: 'primary.orange', }, }}>DELETE PORTFOLIO</Button>
        </Box>                  
      )}

      {portfolioEntries.length > 3 && portfolioListData.valid === true && rearrangeEntries === false && (
        <Box
          item
          xs={12}
          justify="right"
          textAlign="right"
          sx={{ mt:1 }}
          >
          {portfolioListData.editing === true && portfolioListData.validated_entry === true && (
            <Button variant="contained"  onClick={(e) => handleSubmitEntries(e, false) } sx={{ backgroundColor: 'primary.blue', color: 'white', '&:hover': { backgroundColor: 'primary.blue', color: 'white',},}}>UPDATE ENTRY</Button>
          )}
          {portfolioListData.editing === true && portfolioListData.validated_entry === false && portfolioListData.entry_fee === 0 && (
            <Button variant="contained"  onClick={(e) => handleSubmitEntries(e, false) } sx={{ backgroundColor: 'primary.blue', color: 'white', '&:hover': { backgroundColor: 'primary.blue', color: 'white',},}}>ENTER CONTEST</Button>
          )}
          {portfolioListData.editing === true && portfolioListData.validated_entry === false && portfolioListData.entry_fee > 0 && portfolioListData.user_balance > portfolioListData.entry_fee && portfolioListData.certified && (
            <Button variant="contained"  onClick={(e) => handleSubmitEntries(e, true) } sx={{ backgroundColor: 'primary.blue', color: 'white', '&:hover': { backgroundColor: 'primary.blue', color: 'white',},}}>ENTER CONTEST FOR ${portfolioListData.entry_fee}</Button>
          )}
          {portfolioListData.editing === true && portfolioListData.validated_entry === false && portfolioListData.entry_fee > 0 && portfolioListData.allow_free_entries === true && (
            <Button variant="contained"  onClick={(e) => handleSubmitEntries(e, false) } sx={{ ml:1, backgroundColor: 'primary.blue', color: 'white', '&:hover': { backgroundColor: 'primary.blue', color: 'white',},}}>ENTER CONTEST FOR FREE</Button>
          )}
        </Box>
      )}
      {portfolioEntries.length > 3 && rearrangeEntries === false && (
        <Box
          item
          xs={12}
          justify="right"
          textAlign="right"
          sx={{ mt:1 }}
        >
          <Button variant="contained" size="small" sx={{mb:2, backgroundColor: 'primary.blue', color: 'white', alignSelf: 'flex-end', '&:hover': { backgroundColor: 'primary.blue', color: 'white', }, }} onClick={(e) => handleRearrangeEntries(e)}>REARRANGE HOLDINGS</Button>
        </Box>
      )}

      {portfolioEntries.length > 3 && rearrangeEntries === false && (
        <>
          <TableContainer component={Paper} sx={{ mb:2, background: 'transparent', boxShadow: 'none' }}>
            <Table
              sx={{
                '& td': {
                  fontWeight: 700,
                  fontSize: isBelowMd ? 15 : 18,
                  borderColor: 'rgba(97, 103, 113, 0.2)',
                  paddingLeft: isBelowSm ? 0.1 : 'auto',
                  paddingRight: isBelowSm ? 0.1 : 'auto',
                },
                '& th': {
                  fontWeight: 700,
                  fontSize: isBelowMd ? 15 : 18,
                  borderColor: 'rgba(97, 103, 113, 0.2)',
                },
              }}
            >
              <TableBody>
                {portfolioEntries.map((portfolio, index) => {
                  return (
                    <TableRow
                      sx={{
                        cursor: 'pointer',
                        '&: hover': {
                          background: isDark
                            ? 'rgba(255,255,255,.02)'
                            : 'rgba(0,0,0,.02)',
                        },
                      }}
                    >
                      <TableCell align="left">
                        {portfolio.symbol.includes("_") && (
                          <Box>
                            <IconButton onClick={(event) => selectTemplateItem(event, portfolio.symbol)} sx={{ padding: 0, ml: 1, mr: 2,  borderWidth: '1px', borderStyle: 'solid', borderRadius: '4px', borderColor: 'primary.blue'}}><AddIcon fontSize="large" /></IconButton>
                            <Typography
                              variant="h1"
                              onClick={(e) => selectTemplateItem(e, portfolio.symbol)}
                              sx={{ fontWeight: 600, fontSize: isBelowSm? 14 : 18, pb:1, display: 'inline' }}
                              color="primary"
                              >
                              {portfolio.security_name} ({portfolio.percent}%)
                            </Typography>
                          </Box>
                        )}
                        {!portfolio.symbol.includes("_") && (
                          <Box>
                            <IconButton aria-label="delete" sx={{mr:2}} onClick={(event) => handleDeletePortfolioItem(event, portfolio.symbol)}><DeleteForeverIcon fontSize={isBelowMd ? 'medium' : 'large'} /></IconButton>
                            <Typography
                              variant="h1"
                              onClick={(e) => editPortfolioItem(e, portfolio.symbol)}
                              sx={{ fontWeight: 600, fontSize: isBelowSm? 16 : 20, display: 'inline' }}
                              color="primary"
                              >
                              {portfolio.symbol} ({portfolio.percent}%)
                            </Typography>
                            <Typography
                              variant="h1"
                              onClick={(e) => editPortfolioItem(e, portfolio.symbol)}
                              sx={{ fontWeight: 400, fontSize: isBelowSm? 11 : 14, pb:1, marginLeft: isBelowSm ? "40px" : "65px" }}
                              color="primary"
                              >
                              {portfolio.security_name}
                            </Typography>
                          </Box>
                        )}
                      </TableCell>
                      <TableCell align="right">
                        {portfolio.is_short && portfolio.symbol.includes("_") && (
                          <Typography variant="h1"></Typography>
                        )}
                        {!portfolio.is_short && portfolio.symbol.includes("_") && (
                          <Typography variant="h1"></Typography>
                        )}
                        {!portfolio.symbol.includes("_") && (
                          <Box
                            sx={{
                              display: isBelowMd ? 'flex' : 'static',
                              '& button': {
                                px: isBelowMd ? '4px' : '32px',
                                fontWeight: 700,
                                textTransform: 'initial',
                                fontSize: isBelowMd ? 12 : 'inhert',
                              },
                            }}
                          >
                            <Button
                              variant="contained"
                              onClick={(e) => { handlePositionChange(e, portfolio.symbol) }}
                              sx={{
                                borderTopRightRadius: 0,
                                borderBottomRightRadius: 0,
                                backgroundColor: portfolio.is_short === false ? 'primary.green' : 'white',
                                color: portfolio.is_short === false ? 'white' : '#333',
                                '&: hover': {
                                  backgroundColor: portfolio.is_short === false ? 'primary.green' : 'white',
                                  color: portfolio.is_short === false ? 'white' : '#333',
                                },
                              }}
                            >
                              Long
                            </Button>
                            <Button
                              variant="contained"
                              onClick={(e) => { handlePositionChange(e, portfolio.symbol) }}
                              sx={{
                                borderTopLeftRadius: 0,
                                borderBottomLeftRadius: 0,
                                backgroundColor: portfolio.is_short === false ? 'white' : 'primary.red',
                                color: portfolio.is_short === false ? '#333' : 'white',
                                '&: hover': {
                                  backgroundColor: portfolio.is_short === false ? 'white' : 'primary.red',
                                  color: portfolio.is_short === false ? '#333' : 'white',
                                },
                              }}
                            >
                              Short
                            </Button>
                          </Box>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
  
          <Box>
            {portfolioListData.valid === true && (
              <Box
                item
                xs={12}
                justify="right"
                textAlign="right"
                >
                {portfolioListData.editing === true && portfolioListData.validated_entry === true && (
                  <Button variant="contained"  onClick={(e) => handleSubmitEntries(e, false) } sx={{ backgroundColor: 'primary.blue', color: 'white', '&:hover': { backgroundColor: 'primary.blue', color: 'white',},}}>UPDATE ENTRY</Button>
                )}
                {portfolioListData.editing === true && portfolioListData.validated_entry === false && portfolioListData.entry_fee === 0 && (
                  <Button variant="contained"  onClick={(e) => handleSubmitEntries(e, false) } sx={{ backgroundColor: 'primary.blue', color: 'white', '&:hover': { backgroundColor: 'primary.blue', color: 'white',},}}>ENTER CONTEST</Button>
                )}
                {portfolioListData.editing === true && portfolioListData.validated_entry === false && portfolioListData.entry_fee > 0 && portfolioListData.user_balance > portfolioListData.entry_fee && portfolioListData.certified && (
                  <Button variant="contained"  onClick={(e) => handleSubmitEntries(e, true) } sx={{ backgroundColor: 'primary.blue', color: 'white', '&:hover': { backgroundColor: 'primary.blue', color: 'white',},}}>ENTER CONTEST FOR ${portfolioListData.entry_fee}</Button>
                )}
                {portfolioListData.editing === true && portfolioListData.validated_entry === false && portfolioListData.entry_fee > 0 && portfolioListData.allow_free_entries === true && (
                  <Button variant="contained"  onClick={(e) => handleSubmitEntries(e, false) } sx={{ ml:1, backgroundColor: 'primary.blue', color: 'white', '&:hover': { backgroundColor: 'primary.blue', color: 'white',},}}>ENTER CONTEST FOR FREE</Button>
                )}
              </Box>                  
            )}
            <Box
              item
              xs={12}
              justify="right"
              textAlign="right"
              sx={{ mt: 1}}
              >
                <Box>
                  <Button variant="contained" size="small" sx={{mb:2, backgroundColor: 'primary.blue', color: 'white', alignSelf: 'flex-end', '&:hover': { backgroundColor: 'primary.blue', color: 'white', }, }} onClick={(e) => handleRearrangeEntries(e)}>REARRANGE HOLDINGS</Button>
                </Box>
                {portfolioListData.editing === true && portfolioListData.validated_entry === true && (
                  <Button variant="outlined" onClick={(e) => handleDeleteEntries(e)} sx={{ borderColor: 'primary.orange', '&:hover': { backgroundColor: 'transparent', borderColor: 'primary.orange', }, }}>CANCEL CHANGES</Button>
                )}
                {portfolioListData.editing === true && portfolioListData.validated_entry === false && (
                  <Button variant="outlined" onClick={(e) => handleDeleteEntries(e)} sx={{ borderColor: 'primary.orange', '&:hover': { backgroundColor: 'transparent', borderColor: 'primary.orange', }, }}>DELETE PORTFOLIO</Button>
                )}
            </Box>                  
            <Box
              item
              xs={12}
              justify="right"
              textAlign="right"
              >
                {portfolioListData.validated_entry === true && (
                  <Button variant="outlined" onClick={(e) => handleDeleteContestEntry(e)} sx={{ mt:2, borderColor: 'primary.orange', '&:hover': { backgroundColor: 'transparent', borderColor: 'primary.orange', }, }}>CANCEL CONTEST ENTRY</Button>
                )}
            </Box>                  
          </Box>
        </>
      )}        

      {rearrangeEntries === true && (
        <Box>
          <Box>
            <Box
              item
              xs={12}
              justify="right"
              textAlign="right"
              >
                <Button variant="contained" size="small" sx={{my: 1, backgroundColor: 'primary.blue', color: 'white', alignSelf: 'flex-end', '&:hover': { backgroundColor: 'primary.blue', color: 'white', }, }} onClick={(e) => handleRearrangeEntries(e)}>DONE REARRANGING</Button>
            </Box>                  
          </Box>
          <Box sx={{ overflow: 'auto', maxHeight: 700, width:'100%', mb:5}}>
            {portfolioEntries.map((portfolio, index) => {
              return (
                <Box
                  item
                  container
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  xs={12}
                  sx={{mb:1, borderBottom: 3, pb: 1, borderColor: 'secondary.main'}} portfolio={portfolio} key={index }>
                    <Box>
                      <Typography
                        variant="h1"
                        sx={{ fontWeight: 400, fontSize: isBelowSm? 12 : 16, pb:1, display: 'inline' }}
                        color="primary"
                        >
                        {portfolio.security_name} ({portfolio.percent}%)
                      </Typography>
                    </Box>
                    <Box>
                      <Box
                        item
                        xs={12}
                        justify="right"
                        textAlign="right"
                        >
                          {index > 0 && (
                            <IconButton aria-label="up" sx={{mr: isBelowSm? 1 : 3, background: theme.palette.primary.blue, '&:hover': { background: theme.palette.primary.blue} }} onClick={(event) => handleRearrangeItem(event, index, 'up')}><ArrowUpwardIcon fontSize="small" /></IconButton>
                          )}
                          {index < portfolioEntries.length-1 && (
                            <IconButton aria-label="down"  sx={{ background: theme.palette.primary.orange, '&:hover': { background: theme.palette.primary.orange, },}}  onClick={(event) => handleRearrangeItem(event, index, 'down')}><ArrowDownwardIcon fontSize="small" /></IconButton>
                          )}
                      </Box>
                    </Box>
                </Box>
              );
            })}
          </Box>
          <Box>
            <Box
              item
              xs={12}
              justify="right"
              textAlign="right"
              >
                <Button variant="contained" size="small" sx={{backgroundColor: 'primary.blue', color: 'white', alignSelf: 'flex-end', '&:hover': { backgroundColor: 'primary.blue', color: 'white', }, }} onClick={(e) => handleRearrangeEntries(e)}>DONE REARRANGING</Button>
            </Box>                  
          </Box>
        </Box>
      )}

     <Dialog
        open={displayGetStartedDialog}
        sx={{ textAlign: 'center' }}
        PaperProps={{
          style: {
            background: theme.palette.primary.mainGradient.split(';')[0],
          },
        }}
      >
        <DialogTitle sx={{ mt: 5, fontWeight: 700, fontSize: 18, color: 'primary.orange' }}>
          Pick Your First Three Stocks
        </DialogTitle>
        <DialogContent sx={{ width: isBelowSm ? 'auto' : 380, fontSize: 14, textAlign: 'center'}}>
          {portfolioListData.universe === 'diyse600' && (
            <DialogContentText id="alert-dialog-description" sx={{ fontWeight: 600 }}>
              For this contest, you are choosing from the <a href={ `${settings.faq_diyse_600}` } style={{color:'RoyalBlue'}} target="_new">DIYSE 600</a>.              
            </DialogContentText>
          )}
          {portfolioListData.universe !== 'diyse600' && (
            <>
              <DialogContentText id="alert-dialog-description" sx={{ fontWeight: 600 }}>
                Tips on creating a portfolio
              </DialogContentText>
              <DialogContentText id="alert-dialog-description">
                1. Your initial 3 picks will inform the minimum number of stocks that your portfolio must contain, and how concentrated your allocation across those stocks can be.
              </DialogContentText>
              <DialogContentText id="alert-dialog-description">
                2. In general, the larger the market cap of the stocks you pick, the fewer stocks you will need in your portfolio.
              </DialogContentText>
            </>
          )}
          <DialogContentText id="alert-dialog-description" sx={{ mt:2 }}>
            For an overview of how your stock picks, the market cap of those stocks, and your allocation across them are interrelated, please review this <a href={ `${settings.video_diyse_overview}` } style={{color:"RoyalBlue"}} target="_new">this short 3-minute video</a>.
          </DialogContentText>
          <DialogContentText id="alert-dialog-description" sx={{ mt:2 }}>
            For an overview of the DIYSE tools available to you to build your portfolio, please review <a href={ `${settings.video_diyse_portfolios}` } style={{color:"RoyalBlue"}} target="_new">this short 5-minute video</a>.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{mb: 5, display: 'flex', flexDirection: 'column', gap: 2, px: isBelowSm ? '32px' : '48px' }}>
          <Button fullWidth variant="contained" onClick={handleCloseGetStartedDialog} sx={{ fontWeight: 700, fontSize: 14, backgroundColor: 'primary.blue', color: 'white', '&: hover': { backgroundColor: 'primary.blue', color: 'white',} }} autoFocus>Get Started</Button>
        </DialogActions>
      </Dialog>            

      <Dialog
        open={searchChoiceDialog}
        onClose={handleChoiceDialogClose}
        disableEscapeKeyDown={true}
        scroll={"paper"}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogContent sx={{ width: isBelowSm ? 'auto' : 500, fontSize: 16, fontWeight: 500 }}>
          <List>
            {groupData.items && groupData.items.length>0 && (
              <>
                <ListItem>
                  <Input
                    sx={{
                      '& input::placeholder': {
                        fontSize: 14,
                      },
                    }}
                    value={searchString}
                    onChange={handleSearchStock}
                    variant="standard"
                    fullWidth
                    placeholder="Search by Company or Stock Symbol/Ticker"
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton>
                          <SearchIcon />
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                </ListItem>
                <>
                  {searchString.length === 0 && groupData.items.map((link, index) => (
                    <>
                      <ListItem>
                        <ListItemButton
                          onClick={(e) => handleSubgroupDisplay(e, link.key, link.subkey)}
                          sx={{ display: 'flex', justifyContent: 'space-between' }}
                          key={index}
                        >
                          <Typography sx={{ fontWeight: 500, fontSize: 16 }}>{link.title}</Typography>
                        {link.description &&                      
                          <Typography sx={{ fontWeight: 400, fontSize: 12 }}>{link.description}</Typography>
                        }                        
                          <ArrowForwardIosIcon fontSize="small" />
                        </ListItemButton>                  
                      </ListItem>
                      <Divider sx={{ mx: 2 }} />
                    </>
                  ))}
                  {searchString.length > 0 && stockData.map((stocks, index) => (
                    <>
                      <ListItem>
                        <ListItemButton
                          onClick={(e) =>  handleStockSelected(e, stocks.symbol)}
                          sx={{ display: 'flex', justifyContent: 'space-between' }}
                          key={index}
                        >
                          <Typography sx={{ fontWeight: 500, fontSize: 16 }}>{stocks.security_name}</Typography>
                          <Typography sx={{ fontWeight: 400, fontSize: 12 }}>({stocks.exchange}: {stocks.symbol})</Typography>
                          <ArrowForwardIosIcon fontSize="small" />
                        </ListItemButton>                  
                      </ListItem>
                      <Divider sx={{ mx: 2 }} />
                    </>
                  ))}
                </>
              </>
            )}

          {subgroupData.items && subgroupData.items.length>0 && subgroupType === true && (
            <>
              <ListItem>
                <ChevronLeftIcon  sx={{ fontSize: 24 }} color="primary" />
                <Typography onClick={(e) =>  handleGroupBackLink(e, subgroupData.back_key)} component="div" sx={{ cursor: 'pointer', fontWeight: 500, fontSize: 15, display: "block" }} color="primary">Back</Typography>
              </ListItem>
              <ListItem>
                <Typography>{subgroupData.title}</Typography>
              </ListItem>
              <ListItem>
                <Input
                  sx={{
                    '& input::placeholder': {
                      fontSize: 14,
                    },
                  }}
                  value={groupFilter}
                  onChange={(e) => setGroupFilter(e.target.value)}
                  variant="standard"
                  fullWidth
                  placeholder="Filter these results by symbol or company name..."
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton>
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </ListItem>

              {portfolioEntries.length > 3 && (
                <ListItem>
                  <Typography sx={{ fontWeight: 600, fontSize: 14 }}>Tip: Use the checkboxes to add multiple stocks to your portfolio.</Typography>
                </ListItem>
              )}

              {group_filter(subgroupData.items).map((link, index) =>
                <>
                  <ListItem>
                    {portfolioEntries.length > 3 && (
                      <Checkbox color="primary" value={ link.symbol }  onClick={(e) =>  handleCheckboxSelected(e, link.symbol, link.security_name)} />
                    )}
                    <ListItemButton
                      onClick={(e) => handleStockSelected(e, link.symbol, false, subgroupData.title)}
                      sx={{ display: 'flex', justifyContent: 'space-between' }}
                      key={index}
                    >
                      <Typography sx={{ fontWeight: 500, fontSize: 16 }}> {link.symbol} ({link.exchange})  {link.security_name} {link.text}</Typography>
                      <ArrowForwardIosIcon fontSize="small" />
                    </ListItemButton>                  
                  </ListItem>
                  <Divider sx={{ mx: 2 }} />
                </>
                )
              }
            </>
          )}

          {subgroupData.items && subgroupData.items.length>0 && subgroupType === false && (
            <>
              <ListItem>
                <ChevronLeftIcon  sx={{ fontSize: 24 }} color="primary" />
                <Typography onClick={(e) =>  handleGroupBackLink(e, subgroupData.back_key)} component="div" sx={{ cursor: 'pointer', fontWeight: 500, fontSize: 15, display: "block" }} color="primary">Back</Typography>
              </ListItem>
              <ListItem>
                <Typography>{subgroupData.title}</Typography>
              </ListItem>
              {subgroupData.items.map((link, index) =>
                <>
                  <ListItem>
                    <ListItemButton
                      onClick={(e) => handleSubgroupDisplay(e, link.key, link.subkey)}
                      sx={{ display: 'flex', justifyContent: 'space-between' }}
                      key={index}
                    >
                      <Typography sx={{ fontWeight: 500, fontSize: 16 }}> {link.title}</Typography>
                      <ArrowForwardIosIcon fontSize="small" />
                    </ListItemButton>                  
                  </ListItem>
                  <Divider sx={{ mx: 2 }} />
                </>
                )
              }
            </>
          )}
          
          </List>
        </DialogContent>
        <DialogActions>
          {selectedCheckedStocks.length > 0 && (
            <Button variant="contained" onClick={(e) => handleAddCheckedStocksToPortfolio(e, subgroupData.title)} sx={{ mr:2, fontWeight: 700, fontSize: 14, backgroundColor: 'primary.blue', color: 'white', '&: hover': { backgroundColor: 'primary.blue', color: 'white',} }}>Add {selectedCheckedStocks.length} Stocks to Portfolio</Button>
          )}
          <Button variant="contained" onClick={handleChoiceDialogClose} sx={{ fontWeight: 700, fontSize: 14, backgroundColor: 'primary.blue', color: 'white', '&: hover': { backgroundColor: 'primary.blue', color: 'white',} }}>CANCEL</Button>          
        </DialogActions>
      </Dialog>
      
      
     <Dialog
        open={false}
        sx={{ textAlign: 'center' }}
        PaperProps={{
          style: {
            background: theme.palette.primary.mainGradient.split(';')[0],
          },
        }}
      >
        <DialogTitle sx={{ mt: 5, fontWeight: 700, fontSize: 18, color: 'primary.orange' }}>
          DELETE PORTFOILO?
        </DialogTitle>
        <DialogContent sx={{ width: isBelowSm ? 'auto' : 380, fontSize: 14, textAlign: 'center'}}>
          <DialogContentText sx={{ color: 'primary.main' }}>
            Are you sure you want to delete this portfolio?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{mb: 5, display: 'flex', flexDirection: 'column', gap: 2, px: isBelowSm ? '32px' : '48px' }}>
          <Button fullWidth variant="contained" onClick={handleDelete} sx={{ fontWeight: 700, fontSize: 14, backgroundColor: 'primary.blue', color: 'white', '&: hover': { backgroundColor: 'primary.blue', color: 'white',} }} autoFocus>DELETE</Button>
          <Button fullWidth variant="outlined" onClick={handleDelete} sx={{ fontWeight: 700, fontSize: 14, borderColor: 'primary.orange', '&: hover': { backgroundColor: 'transparent', borderColor: 'primary.orange', } }}>CANCEL</Button>
        </DialogActions>
      </Dialog>      
        
      
      {warningMessage && (
        <Dialog
          open={openWarningMessage}
          sx={{ textAlign: 'center' }}
          PaperProps={{
            style: {
              background: theme.palette.primary.mainGradient.split(';')[0],
            },
          }}
        >
          <DialogTitle sx={{ mt: 5, fontWeight: 700, fontSize: 18, color: 'primary.orange' }}>
            {warningMessage.headerMes}
          </DialogTitle>
          <DialogContent sx={{ width: isBelowSm ? 'auto' : 380, fontSize: 14, textAlign: 'center'}}>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, mt: 2, fontWeight: 400, lineHeight: "21.86px", fontSize: 16}} color="primary">
              {warningMessage.mess}
            </Typography>
            {warningMessage.helpUrl && (
              <Typography variant="h6" component="div" sx={{ flexGrow: 1, mt: 2, fontWeight: 400, lineHeight: "21.86px", fontSize: 16}} color="primary">
                For more details, see the <a href={ `${warningMessage.helpUrl}` } style={{color:'RoyalBlue'}} target="_new">FAQ</a>.
              </Typography>
            )}
          </DialogContent>
          <DialogActions sx={{mb: 5, display: 'flex', flexDirection: 'column', gap: 2, px: isBelowSm ? '32px' : '48px' }}>          
                {warningMessage.delButton && (
                  <Button fullWidth variant="outlined" onClick={handleDelete} sx={{ fontWeight: 700, fontSize: 14, borderColor: 'primary.orange', '&: hover': { backgroundColor: 'transparent', borderColor: 'primary.orange', } }}>DELETE</Button>
                )}
                {warningMessage.delEntryButton && (
                  <Button fullWidth variant="outlined" onClick={handleDeleteEntry} sx={{ fontWeight: 700, fontSize: 14, borderColor: 'primary.orange', '&: hover': { backgroundColor: 'transparent', borderColor: 'primary.orange', } }}>DELETE ENTRY</Button>
                )}
                {warningMessage.entryAddedButton && allowMultipleEntries && (
                  <>
                    <Button fullWidth variant="contained" onClick={(e) => handleCreateNewContestEntry(e)} sx={{ fontWeight: 700, fontSize: 14, backgroundColor: 'primary.blue', color: 'white', '&: hover': { backgroundColor: 'primary.blue', color: 'white',} }}>ADD ANOTHER CONTEST ENTRY</Button>
                    <Button fullWidth variant="contained" component={Link} to={{ pathname: `/contest/${contest_key}` }}  sx={{ fontWeight: 700, fontSize: 14, backgroundColor: 'primary.blue', color: 'white', '&: hover': { backgroundColor: 'primary.blue', color: 'white',} }}>BACK TO CONTEST DETAILS</Button>
                  </>
                )}
                {warningMessage.entryAddedButton && !allowMultipleEntries && (
                  <Button fullWidth variant="contained" component={Link} to={{ pathname: `/contest/${contest_key}` }}  sx={{ fontWeight: 700, fontSize: 14, backgroundColor: 'primary.blue', color: 'white', '&: hover': { backgroundColor: 'primary.blue', color: 'white',} }}>BACK TO CONTEST DETAILS</Button>
                )}
                {warningMessage.closeButton && (
                  <Button fullWidth variant="contained" onClick={handleWarningMessageClose} sx={{ fontWeight: 700, fontSize: 14, backgroundColor: 'primary.blue', color: 'white', '&: hover': { backgroundColor: 'primary.blue', color: 'white',} }}>CLOSE</Button>
                )}
        </DialogActions>
        </Dialog>
      )}      
      
    </Box>
  );
  
};

export default CreatePortfolio;
