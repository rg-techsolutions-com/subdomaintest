import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import OutlinedInput from '@mui/material/OutlinedInput';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

import { useTheme } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import useMediaQuery from '@mui/material/useMediaQuery';

import Dialog from '@mui/material/Dialog';

import UserService  from './../../services/user-service';
import { useAuth } from "../../services/use-auth.js";
import history from "../../services/history.js";

const EditProfile = () => {
  
  const states = ['Alabama','Alaska','American Samoa','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','District of Columbia','Federated States of Micronesia','Florida','Georgia','Guam','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Marshall Islands','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Northern Mariana Islands','Ohio','Oklahoma','Oregon','Palau','Pennsylvania','Puerto Rico','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virgin Island','Virginia','Washington','West Virginia','Wisconsin','Wyoming'];

  const [profileData, setProfileData] = useState([]);
  const [updateEmail, setUpdateEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [contactFirstName, setContactFirstName] = useState("");
  const [contactLastName, setContactLastName] = useState("");
  const [contactStreetAddress, setContactStreetAddress] = useState("");
  const [contactCity, setContactCity] = useState("");
  const [contactState, setContactState] = useState(states[0]);
  const [contactCustomState, setContactCustomState] = useState("");
  const [contactCustomCountry, setContactCustomCountry] = useState("United States");
  const [contactCountry, setContactCountry] = useState("");
  const [contactPostalCode, setContactPostalCode] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [showCustomState, setShowCustomState] = useState(false);
  const [showCustomCountry, setShowCustomCountry] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(true);
  const [modalMessage, setModalMessage] = useState("");
  const [value, setValue] = useState('Eastern');
  const [displayMode, setDisplayMode] = useState('loaded');  
  
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const auth = useAuth();
  
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
    document.title = "DIYSE Edit Your Profile";
    setDisplayMode('loading');
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      UserService.getProfileData()
      .then(
        (response) => {
          if (response) {
            setProfileData(response.data);
            setValue(response.data.timezone);
            UserService.getContactData()
            .then(
              (response) => {
                if (response) {
                  setContactFirstName(response.data.first_name);
                  setContactLastName(response.data.last_name);
                  setContactStreetAddress(response.data.street_address);
                  setContactCity(response.data.city);
                  setContactPostalCode(response.data.postal_code);
                  setContactPhone(response.data.phone);
                  if (response.data.country) {
                    if (response.data.country !== "United States") {
                      setContactCountry(response.data.country);
                      setShowCustomCountry(true);
                      setShowCustomState(true);          
                      setContactCustomCountry("Other");
                      setContactCustomState(response.data.state);
                    }
                  }
                  setDisplayMode('loaded');  
                }
              }
            );
          }
        });
    };
    fetchData();
  }, []);

  const onChangeContact = (event, override_type) => {
    let type = event.target.id;
    if (override_type) {
      type = override_type;
    }
    switch (type) {
      case 'contact_first_name':
        setContactFirstName(event.target.value);
        break;
      case 'contact_last_name':
        setContactLastName(event.target.value);
        break;
      case 'contact_street_address':
        setContactStreetAddress(event.target.value);
        break;
      case 'contact_city':
        setContactCity(event.target.value);
        break;
      case 'contact_state':
        setContactState(event.target.value);
        break;
      case 'contact_custom_state':
        setContactCustomState(event.target.value);
        break;
      case 'contact_postal_code':
        setContactPostalCode(event.target.value);
        break;
      case 'contact_country':
        setContactCountry(event.target.value);
        break;
      case 'contact_custom_country':
        if (event.target.value === 'Other') {
          setShowCustomCountry(true);
          setShowCustomState(true);          
          setContactCustomCountry("Other");
        } else {
          setShowCustomCountry(false);
          setShowCustomState(false);          
          setContactCustomCountry("United States");
        }
        break;
      case 'contact_phone':
        setContactPhone(event.target.value);
        break;
      default:
        break;
    }
  };

  const handleSubmitContactChanges  = (e) => {
    e.preventDefault();
    setMessage("");
    let contact_details = {
      "first_name": contactFirstName,
      "last_name": contactLastName,
      "street_address": contactStreetAddress,
      "city": contactCity,
      "state": contactState,
      "postal_code": contactPostalCode,
      "country": "United States",
      "phone": contactPhone
    };
    if (contactCustomCountry === 'Other') {
      contact_details["country"] = contactCountry;
      contact_details["state"] = contactCustomState;
    }
    let error_found = false;
    Object.entries(contact_details).forEach(([key, value]) => {
      if (value === "") {
        setMessage({ ErrorContactMessage: 'All contact fields are required.' });      
        error_found = true;
      }
    });
    if (error_found === false) {
      setDisplayMode('loading');
      UserService.sendContactData(contact_details)
      .then((response) => {
        let redirectURL = localStorage.getItem('redirectAfterDisplayName');
        if (redirectURL) {
          localStorage.removeItem('redirectAfterDisplayName');            
          history.push(redirectURL);
        } else {
          history.push("/profile");
        }
      });
    }
  };

  const onChangeEmail = (event) => {
    const updateEmail = event.target.value;
    setUpdateEmail(updateEmail);
  };

  const onChangeDisplayName = (event) => {
    const displayName = event.target.value;
    setDisplayName(displayName);
  };

  const handleSubmitEmailChanges = (e) => {
    let validEmailCheck = /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let email = updateEmail;
    let display_name = profileData.display_name;
    let timezone = profileData.timezone;
    let password = '';
    let password_repeat = '';
    let current_password = '';
    if ( validEmailCheck.test(email) && email !== profileData.email && email !== '') {
      setDisplayMode('loading');                  
      UserService.sendProfileData(email, display_name, timezone, password, password_repeat, current_password)
      .then((response) => {
        setModalMessage({
          headerMes: 'CONFIRM YOUR EMAIL ADDRESS',
          mess: 'To continue using DIYSE, you must re-confirm your email address. We’ve sent a confirmation link to the address you’ve provided.',
        });
        handleOpen(true);
        setError(false);
        setDisplayMode('loaded');                    
      })
      .catch(err => {
        setModalMessage({
          headerMes: 'ERROR',
          mess: 'An account already exists using this email address, please try a different one.',
        });
        handleOpen(true);
        setError(true);
        setDisplayMode('loaded');                            
      })

    } else {
      setMessage({ ErrorEmailMessage: 'Could not find your account' });
      setDisplayMode('loaded');                     
    }
  };

  const handleSubmitDisplayNameChanges = (e) => {
    e.preventDefault();
    let display_name = displayName;
    let email = profileData.email;
    let timezone = profileData.timezone;
    let password = '';
    let password_repeat = '';
    let current_password = '';
    if ( display_name !== profileData.display_name && display_name !== '') {
      setDisplayMode('loading');                          
      UserService.sendProfileData(email, display_name, timezone, password, password_repeat, current_password)
      .then(() => {
          auth.updateProfile(display_name);
          let redirectURL = localStorage.getItem('redirectAfterDisplayName');
          if (redirectURL) {
            localStorage.removeItem('redirectAfterDisplayName');            
            history.push(redirectURL);
          } else {
            history.push("/profile");
          }
        })
      .catch((error) => {
        setMessage({ ErrorDisplayNameMessage: error.data.error_mesg });
        setDisplayMode('loaded');                    
      });
    } else {
      setMessage({ ErrorDisplayNameMessage: 'A display name must be entered.' });
      setDisplayMode('loaded');                          
    }
  };

  const handleSubmitTimezoneChanges = (e) => {
    e.preventDefault();
    let display_name = profileData.display_name;
    let email = profileData.email;
    let timezone = value;
    let password = '';
    let password_repeat = '';
    let current_password = '';
    setDisplayMode('loading');                        
    UserService.sendProfileData(email, display_name, timezone, password, password_repeat, current_password)
    .then(() => {
      history.push("/profile");
    });
  };
  
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const SuccessfulEntry = () => {
    return (
      <Button variant="contained"  onClick={() => auth.logout()} sx={{ mt:1, backgroundColor: 'primary.blue', color: 'white', '&:hover': { backgroundColor: 'primary.blue', color: 'white',},}}>CLOSE AND LOG IN</Button>                  
    );
  };

  const ErrorEntry = () => {
    return (
      <Button variant="contained"  onClick={handleClose} sx={{ mt:1, backgroundColor: 'primary.blue', color: 'white', '&:hover': { backgroundColor: 'primary.blue', color: 'white',},}}>CLOSE</Button>                  
    );
  };

  return (

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
          Edit Profile
        </Typography>
        
        <Box>
          <Box sx={{ mt:2, marginLeft:'auto', marginRight:'auto', width: isBelowSm? '100%' : '50%' }}>
            <Typography color="primary" sx={{ fontWeight: 700, fontSize: 15, textTransform: 'uppercase'}}>update display name</Typography>
            <Typography color="primary" sx={{ fontWeight: 500, fontSize: 12 }}>No special characters or spaces (numbers, dashes and hyphens allowed)</Typography>
            <OutlinedInput
              fullWidth
              value={displayName}
              onChange={onChangeDisplayName}
              id="confirm updated email"
              placeholder={profileData.display_name}
              aria-describedby="update display name "
            />
            {message &&(
              <Box role="alert">
                <Typography variant="h6" component="div" sx={{ flexGrow: 1, mt: 1, fontWeight: 400, lineHeight: "21.86px", fontSize: 16}} color="error.main">
                 {message.ErrorDisplayNameMessage}
                </Typography>
              </Box>
            )}
            <Button variant="contained" onClick={(e) => handleSubmitDisplayNameChanges(e) } sx={{ mt:1, backgroundColor: 'primary.blue', color: 'white', '&:hover': { backgroundColor: 'primary.blue', color: 'white',},}}>SAVE DISPLAY NAME</Button>            
          </Box>

          <Box sx={{ mt:4, marginLeft:'auto', marginRight:'auto', width: isBelowSm? '100%' : '50%' }}>
            <Typography color="primary" sx={{ fontWeight: 700, fontSize: 15, textTransform: 'uppercase'}}>update email address</Typography>
            <Box>
              <OutlinedInput
                fullWidth
                value={updateEmail}
                onChange={onChangeEmail}
                id="update email"
                placeholder={profileData.email}
                aria-describedby="update email address"
              />
              {message &&(
                <Box role="alert">
                  <Typography variant="h6" component="div" sx={{ flexGrow: 1, mt: 1, fontWeight: 400, lineHeight: "21.86px", fontSize: 16}} color="error.main">
                   {message.ErrorEmailMessage}
                  </Typography>
                </Box>
              )}
            </Box>
            <Button variant="contained"  onClick={(e) => handleSubmitEmailChanges(e) } sx={{ mt:1, backgroundColor: 'primary.blue', color: 'white', '&:hover': { backgroundColor: 'primary.blue', color: 'white',},}}>SAVE EMAIL</Button>            
          </Box>

          <Box sx={{ mt:4, marginLeft:'auto', marginRight:'auto', width: isBelowSm? '100%' : '50%' }}>
            <Typography color="primary" sx={{ fontWeight: 700, fontSize: 15, textTransform: 'uppercase'}}>Contact Details</Typography>
            <Typography color="primary" sx={{ fontWeight: 500, fontSize: 12 }}>All contact fields are required to enter paid contests</Typography>
            <Box>
              <OutlinedInput
                fullWidth
                value={contactFirstName}
                onChange={onChangeContact}
                id="contact_first_name"
                placeholder={profileData.contact_first_name ? profileData.contact_first_name : 'Your First Name'}
                aria-describedby="update first name"
              />
              <OutlinedInput
                fullWidth
                value={contactLastName}
                onChange={onChangeContact}
                id="contact_last_name"
                placeholder={profileData.contact_last_name ? profileData.contact_last_name : 'Your Last Name'}
                aria-describedby="update last name"
              />
              <Select
                fullWidth
                value={contactCustomCountry}
                onChange={(event) => {onChangeContact(event, 'contact_custom_country')}}
                id="contact_custom_country"
                aria-describedby="update state/province"
              >
                <MenuItem key="United States" value={"United States"}>{"United States"}</MenuItem>
                <MenuItem key="Other" value={"Other"}>{"Other"}</MenuItem>
              </Select>
              {showCustomCountry === true && (
                <OutlinedInput
                  fullWidth
                  value={contactCountry}
                  onChange={onChangeContact}
                  id="contact_country"
                  placeholder={profileData.contact_country ? profileData.contact_country : 'Country'}
                  aria-describedby="update country"
                />
              )}
              <OutlinedInput
                fullWidth
                value={contactStreetAddress}
                onChange={onChangeContact}
                id="contact_street_address"
                placeholder={profileData.contact_street_address ? profileData.contact_street_address : 'Street Address'}
                aria-describedby="update street address"
              />
              <OutlinedInput
                fullWidth
                value={contactCity}
                onChange={onChangeContact}
                id="contact_city"
                placeholder={profileData.contact_city ? profileData.contact_city : 'City'}
                aria-describedby="update city"
              />
              {showCustomState === false && (
                <Select
                  fullWidth
                  value={contactState}
                  onChange={(event) => {onChangeContact(event, 'contact_state')}}
                  id="contact_state"
                  placeholder={"Select State"}
                  aria-describedby="update state/province"
                >
                {states.map((item, index) =>
                  <MenuItem key={item} value={item}>{item}</MenuItem>
                )}
                </Select>
              )}
              {showCustomState === true && (
                <OutlinedInput
                  fullWidth
                  value={contactCustomState}
                  onChange={onChangeContact}
                  id="contact_custom_state"
                  placeholder={profileData.contact_state ? profileData.contact_state : 'State/Province'}
                  aria-describedby="update custom state/province"
                />
              )}
              <OutlinedInput
                fullWidth
                value={contactPostalCode}
                onChange={onChangeContact}
                id="contact_postal_code"
                placeholder={profileData.contact_postal_code ? profileData.postal_code : 'ZIP/Postal Code'}
                aria-describedby="update postal code"
              />
              <OutlinedInput
                fullWidth
                value={contactPhone}
                onChange={onChangeContact}
                id="contact_phone"
                placeholder={profileData.contact_phone ? profileData.contact_phone : 'Phone Number'}
                aria-describedby="update phone"
              />
              {message &&(
                <Box role="alert">
                  <Typography variant="h6" component="div" sx={{ flexGrow: 1, mt: 1, fontWeight: 400, lineHeight: "21.86px", fontSize: 16}} color="error.main">
                   {message.ErrorContactMessage}
                  </Typography>
                </Box>
              )}
            </Box>
            <Button variant="contained"  onClick={(e) => handleSubmitContactChanges(e) } sx={{ mt:1, backgroundColor: 'primary.blue', color: 'white', '&:hover': { backgroundColor: 'primary.blue', color: 'white',},}}>SAVE CONTACT DETAILS</Button>            
          </Box>

          <Box sx={{ mt:4, marginLeft:'auto', marginRight:'auto', width: isBelowSm? '100%' : '50%' }}>
            <Typography color="primary" sx={{ fontWeight: 700, fontSize: 15, textTransform: 'uppercase'}}>update timezone</Typography>
            <Tabs
              sx={{mx:'auto'}}
              value={value}
              onChange={handleChange}
              textColor="secondary"
              indicatorColor="secondary"
              aria-label="secondary tabs example"
            >
              <Tab value="Pacific" label="Pacific" sx={{ fontSize:12 }}/>
              <Tab value="Mountain" label="Mountain" sx={{ fontSize:12 }}/>
              <Tab value="Central" label="Central" sx={{ fontSize:12 }}/>
              <Tab value="Eastern" label="Eastern" sx={{ fontSize:12 }}/>
            </Tabs>
            <Button variant="contained"  onClick={(e) => handleSubmitTimezoneChanges(e) } sx={{ mt:1, backgroundColor: 'primary.blue', color: 'white', '&:hover': { backgroundColor: 'primary.blue', color: 'white',},}}>SAVE TIMEZONE</Button>            
          </Box>
            
        </Box>
            
      </Box>
      {modalMessage && (
        <Dialog
         aria-labelledby="transition-modal-title"
         aria-describedby="transition-modal-description"
         open={open}
         closeAfterTransition
        >
          <Box sx={{ p: 4 }}>
            <Typography variant="h1" component="div" sx={{ flexGrow: 1, fontWeight: 700, fontSize: 24 }} color="primary">
             {modalMessage.headerMes}
            </Typography>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, mt: 2, fontWeight: 400, fontSize: 16}} color="primary">
             {modalMessage.mess}
            </Typography>
            <Box>
             {error === false
               ? <SuccessfulEntry/>
            
               : <ErrorEntry/>
             }
            </Box>
          </Box>
        </Dialog>
       )}
    </Box>

   );
};

export default EditProfile;
