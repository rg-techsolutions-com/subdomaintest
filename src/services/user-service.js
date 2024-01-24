import axios from 'axios';
import authHeader from './auth-header';
import settings from './settings';
import history from './history';

const responseSuccessHandler = response => {
  return response;
};

const responseErrorHandler = error => {
  if (error.response.status === 401) {
    localStorage.removeItem('auth_code');
    if (history.location) {
      if (! localStorage.getItem('redirectURL')) {
        localStorage.setItem('redirectURL', history.location.pathname);
      }
    }
    history.push('/login');
  }
  if (error.response) {
    //console.error(error.response.data);
    //console.error(error.response.status);
    //console.error(error.response.headers);
  } else if (error.request) {
    //console.error(error.request);
  } else {
    //console.error('Error', error.message);
  }
  //console.error(error.config);

  return Promise.reject(error);
};

axios.interceptors.response.use(
  response => responseSuccessHandler(response),
  error => responseErrorHandler(error)
);

const sendProfileData = (email, display_name, timezone, password, password_repeat, current_password) => {
  return axios
  .post(settings.base_url + 'profile', {
    email,
    display_name,
    timezone,
    password,
    password_repeat,
    current_password
  }, {headers: authHeader() })
  .catch(error => {
    throw(error.response);
  });
};

const getProfileData = () => {
  return axios
  .get(settings.base_url + 'profile', {headers: authHeader() })
  .catch(error => {
    throw(error);
  });
};

const sendContactData = (contact) => {
  return axios
  .post(settings.base_url + 'contact', {
    contact
  }, {headers: authHeader() })
  .catch(error => {
    throw(error.response);
  });
};

const getContactData = () => {
  return axios
  .get(settings.base_url + 'contact', {headers: authHeader() })
  .catch(error => {
    throw(error);
  });
};

const sendAgeAndCertifyData = (over_eighteen, certify) => {
  return axios
  .post(settings.base_url + 'profile', {
    over_eighteen,
    certify
  }, {headers: authHeader() })
  .catch(error => {
    throw(error.response);
  });
};

const getAccountData = () => {
  return axios
  .get(settings.base_url + 'transactions', {headers: authHeader() })
  .catch(error => {
    throw(error);
  });
};

const getAccountBalance = () => {
  return axios
  .get(settings.base_url + 'balance', {headers: authHeader() })
  .catch(error => {
    throw(error);
  });
};

const getAccountNamesData = () => {
  return axios
  .get(settings.base_url + 'account_names', {headers: authHeader() })
  .catch(error => {
    throw(error);
  });
};

const addAccountNameData = (type, details) => {
  return axios
  .post(settings.base_url + 'account_names', {
    type,
    details,
  }, {headers: authHeader() })
  .catch(error => {
    throw(error.response);
  });
};

const setAccountType = (type) => {
  return axios
  .get(`${settings.base_url}account_type/${type}`, { headers: authHeader() })
  .catch(error => {
    //
  });
};

const getContestsOpen = async () => {
  return await axios
  .get(settings.base_url + 'contests/upcoming', { headers: authHeader() })
  .catch(error => {
    throw(error);
  });
};

const getContestsRunning = async () => {
  return await axios
  .get(settings.base_url + 'contests/running', { headers: authHeader() })
  .catch(error => {
    throw(error);
  });
};

const getContestsEntered = async () => {
  return await axios
  .get(settings.base_url + 'contests/my_contests', { headers: authHeader() })
  .catch(error => {
    throw(error);
  });
};

const getContestsClosed = async () => {
  return await axios
  .get(settings.base_url + 'contests/past', { headers: authHeader() })
  .catch(error => {
    throw(error);
  });
};

const getAllContestsEntered = async () => {
  return await axios
  .get(settings.base_url + 'contests/history', { headers: authHeader() })
  .catch(error => {
    throw(error);
  });
};

const getEntryKey = (contest_key, template_code) => {
  //console.log(contest_key);
  return axios
  .post(settings.base_url + 'entry', {
    contest_key,
    template_code
  }, { headers: authHeader() })
  .catch(error => {
    //
  });
};

const getStocks = (contest_entry_key, search_string, limit) => {
  return axios
  .post(settings.base_url + 'stocks', {
    contest_entry_key,
    search_string
  }, { headers: authHeader() })
  .catch(error => {
    //
  });
};

const getSecuritySettings = (contestEntryKey, stock_symbol) => {
  return axios
  .get(`${settings.base_url}stock/${contestEntryKey}/${stock_symbol}`, { headers: authHeader() })
  .catch(error => {
    //
  });
};

const getValidSecurity = (contestEntryKey, stock_symbol) => {
  return axios
  .get(`${settings.base_url}valid_security/${contestEntryKey}/${stock_symbol}`, { headers: authHeader() })
  .catch(error => {
    //
  });
};

const getSecurityFeedback = (contestEntryKey, stock_symbol) => {
  return axios
  .get(`${settings.base_url}feedback/${contestEntryKey}/${stock_symbol}`, { headers: authHeader() })
  .catch(error => {
    //
  });
};

const getContestDetails = (contest_key) => {
  return axios
  .get(`${settings.base_url}contest/${contest_key}`, { headers: authHeader() })
  .catch(error => {
    //
  });
};

const getPrivateContestDetails = (contest_key) => {
  return axios
  .get(`${settings.base_url}private_contest/${contest_key}`)
  .catch(error => {
    throw(error);
  });
};

const sendEntryKeySettings = (contestEntryKey, newPortfolioEntry) => {
  //console.log(contestEntryKey, newPortfolioEntry)
  return axios
  .put(`${settings.base_url}entry/${contestEntryKey}`, newPortfolioEntry, { headers: authHeader() })
  .catch(error => {
    //
  });
};

const getPortfolioList = (contestEntryKey) => {
  //console.log(contestEntryKey)
  return axios
  .get(`${settings.base_url}entry/${contestEntryKey}`, { headers: authHeader() })
  .catch(error => {
    //
  });
};

const deletePortfolioList = (contestEntryKey) => {
  return axios
  .delete(`${settings.base_url}entry/${contestEntryKey}`, { headers: authHeader() })
  .catch(error => {
    //
  });
};

const deleteContestEntry = (contestEntryKey) => {
  return axios
  .delete(`${settings.base_url}entry_withdraw/${contestEntryKey}`, 
  { headers: authHeader() })
  .catch(error => {
    //
  });
};

const sendEntrySubmission = (contestEntryKey, is_paid) => {
  return axios
  .post(`${settings.base_url}entry/${contestEntryKey}`,{
    is_paid
  }, { headers: authHeader() })
  .catch(error => {
    throw(error.response);
  });
};

const getBalance = () => {
  return axios.get(settings.base_url + 'balance',  {headers: authHeader() })
  .catch(error => {
    //
  });
};

const getGroups = (contestEntryKey, templateCode) => {
  if (! templateCode) {
    templateCode = 'none';
  }
  return axios
  .get(`${settings.base_url}groups/${contestEntryKey}/${templateCode}`, { headers: authHeader() })
  .catch(error => {
    //
  });
};

const getSubgroups = (contestEntryKey, groupKey, groupSubkey, templateCode) => {
  if (! templateCode) {
    templateCode = 'none';
  }
  return axios
  .get(`${settings.base_url}group/${contestEntryKey}/${groupKey}/${groupSubkey}/${templateCode}`, { headers: authHeader() })
  .catch(error => {
    //
  });
};

const getPreviousPortfolios = (contest_key) => {
  return axios
  .get(`${settings.base_url}portfolios/${contest_key}`, { headers: authHeader() })
  .catch(error => {
    //
  });
};

const createPreviousPortfolioCopy = (previous_contest_entry_key, new_contest_entry_key) => {
  return axios
  .post(settings.base_url + 'portfolios', {
    previous_contest_entry_key,
    new_contest_entry_key
  }, { headers: authHeader() })
  .catch(error => {
    //
  });
};

const getContestParticipants = (contest_key, limit) => {
  return axios
  .post(settings.base_url + 'participants', {
    "contest_key":contest_key,
    "limit":limit
  }, { headers: authHeader() })
  .catch(error => {
    //
  });
};

const getPayoutStructure = (number_entrants, entry_fee, payout_structure) => {
  return axios
  .post(settings.base_url + 'payout_structure', {
    "number_entrants":number_entrants,
    "entry_fee":entry_fee,
    "payout_structure":payout_structure
  }, { headers: authHeader() })
  .catch(error => {
    //
  });
};

const createPrivateContest = (name, start_date, end_date, is_adjustable, number_entrants, entry_fee, payout_structure, universe) => {
  return axios
  .post(settings.base_url + 'contest', {
    "name":name,
    "start_date": start_date,
    "end_date": end_date,
    "is_adjustable": is_adjustable,
    "number_entrants":number_entrants,
    "entry_fee":entry_fee,
    "payout_structure":payout_structure,
    "universe":universe
  }, { headers: authHeader() })
  .catch(error => {
    throw(error);
  });
};

const cancelPrivateContest = (contest_key) => {
  return axios
  .put(settings.base_url + 'contest', {
    "contest_key":contest_key,
    "is_cancelled":true
  }, { headers: authHeader() })
  .catch(error => {
    //
  });
};

const sendFundingDetails = (diyse_order_id, type, details) => {
  return axios
  .post(settings.base_url + 'fund', {
    "diyse_order_id": diyse_order_id,
    "type":type,
    "data":details
  }, { headers: authHeader() })
  .catch(error => {
    throw(error);
  });
};

const getFundingOrderID = () => {
  return axios
  .get(`${settings.base_url}fund`, { headers: authHeader() })
  .catch(error => {
    //
  });
};

const getTemplatesForEntry = (contestEntryKey) => {
  return axios
  .get(`${settings.base_url}templates/${contestEntryKey}`, { headers: authHeader() })
  .catch(error => {
    //
  });
};

const getLeaderBoards = (contest_key, page, limit) => {
  if (! page) {
    page = 1;
  }
  if (! limit) {
    limit = 10;
  }
  return axios
  .post(`${settings.base_url}leaderboard/${contest_key}`, {
    "page":page,
    "limit":limit
  },{ headers: authHeader() })
  .catch(error => {
    //
  });
};

const getContestResults = (contest_key, page, limit) => {
  if (! page) {
    page = 1;
  }
  if (! limit) {
    limit = 10;
  }
  return axios
  .post(`${settings.base_url}results/${contest_key}`, {
    "page":page,
    "limit":limit
  },{ headers: authHeader() })
  .catch(error => {
    //
  });
};


const getPieChartData = (contest_key, contestEntryKey) => {
  return axios
  .get(`${settings.base_url}chart/${contest_key}/${contestEntryKey}`, { headers: authHeader() })
  .catch(error => {
    //
  });
};

const getContestEntryChartData = (contest_key, contest_entry_key) => {
  return axios
  .get(`${settings.base_url}chart/${contest_key}/${contest_entry_key}`, { headers: authHeader() })
  .catch(error => {
    //
  });
};

const deleteAccount = () => {
  return axios.delete(settings.base_url + 'profile',  {headers: authHeader() })
  .catch(error => {
    //
  });
};

const exports = {
  sendProfileData,
  getProfileData,
  getContestsOpen,
  getContestsRunning,
  getContestsEntered,
  getAllContestsEntered,
  getContestsClosed,
  getEntryKey,
  getStocks,
  getSecuritySettings,
  sendEntryKeySettings,
  sendEntrySubmission,
  getPortfolioList,
  deletePortfolioList,
  deleteContestEntry,
  getBalance,
  getGroups,
  getSubgroups,
  getPreviousPortfolios,
  getContestDetails,
  getContestParticipants,
  getLeaderBoards,
  getContestResults,
  getValidSecurity,
  getSecurityFeedback,
  getPieChartData,
  getContestEntryChartData,
  deleteAccount,
  getTemplatesForEntry,
  createPreviousPortfolioCopy,
  getPayoutStructure,
  getPrivateContestDetails,
  createPrivateContest,
  cancelPrivateContest,
  getAccountData,
  getAccountBalance,
  getFundingOrderID,
  sendFundingDetails,
  sendAgeAndCertifyData,
  getAccountNamesData,
  addAccountNameData,
  setAccountType,
  sendContactData,
  getContactData
};

export default exports;
