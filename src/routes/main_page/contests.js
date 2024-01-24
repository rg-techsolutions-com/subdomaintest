import { useState, useEffect } from "react";

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Image from '../../shared/images/vector.png';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Link } from 'react-router-dom';

import Contest from "./contest";

import UserService  from './../../services/user-service';
import { useAuth } from "./../../services/use-auth.js";
import history from './../../services/history';
import settings from './../../services/settings';

import { makeStyles } from '@mui/styles';
import { useMediaQuery } from '@mui/material';

const Contests = () => {
  const matches = useMediaQuery('(min-width:950px)');

  const useStyles = makeStyles((theme) => ({
    btn: {
      background: "#3669EF",
      border: "transparent",
      color: "#fff",
    },    
    contestBackgroundImage: {
      backgroundImage: `url(${Image})`,
      backgroundSize: 'cover',
    },
    iconColor: {
      color: 'linear-gradient(90.45deg, #613BFB 0%, #316BFF 100%)',
    },
    moreThan: matches
      ? {
          fontWeight: 700,
          fontSize: 32,
          textDecoration: 'none',
          textAlign: 'center',
          paddingTop: 3,
          paddingBottom: 2,
        }
      : {
          fontWeight: 700,
          fontSize: 24,
          textDecoration: 'none',
          textAlign: 'center',
          paddingTop: 50,
          paddingBottom: 2,
        },
    moreThanSpan: matches
      ? {
          fontWeight: 600,
          fontSize: 18,
          textDecoration: 'none',
          textAlign: 'center',
          paddingBottom: 2,
        }
      : {
          fontWeight: 600,
          fontSize: 16,
          margin: '13px 50px',
          textDecoration: 'none',
          textAlign: 'center',
          paddingBottom: 2,
        },
  }));

  const classes = useStyles();

  const [contestDataToDisplay, setContestDataToDisplay] = useState([]);
  const [displayMode, setDisplayMode] = useState('loaded');
  const [selectedMenu, setSelectedMenu] = useState(false);
  
  const auth = useAuth();

  useEffect(() => {
    document.title = "DIYSE Contests";
    setDisplayMode('loading');
  }, []);

  useEffect(() => {
    const fetchData = () => {
      setSelectedMenu(0);
    };
    fetchData();
  }, [auth]);
  
  useEffect(() => {
    setDisplayMode('loading');
    
    if (selectedMenu === 0) {
      UserService.getContestsOpen()
      .then((response) => {
        setContestDataToDisplay(response.data.contests);
        setDisplayMode('loaded');
      })
      .catch((e) => {
        if (e.response) {
          if (e.response.status === 401) {
            auth.logout();
            history.push('/login');
          }
        }
      });
    }
    
    if (selectedMenu === 1) {
      UserService.getContestsRunning()
      .then((response) => {
        setContestDataToDisplay(response.data.contests);
        setDisplayMode('loaded');
      })
      .catch((e) => {
        if (e.response) {
          if (e.response.status === 401) {
            auth.logout();
            history.push('/login');
          }
        }
      });
    }
    
    if (selectedMenu === 2) {
      UserService.getContestsEntered()
      .then((response) => {
        setContestDataToDisplay(response.data.contests);
        setDisplayMode('loaded');
      })
      .catch((e) => {
        if (e.response) {
          if (e.response.status === 401) {
            auth.logout();
            history.push('/login');
          }
        }
      });
    }
    
    if (selectedMenu === 3) {
      UserService.getContestsClosed()
      .then((response) => {
        setContestDataToDisplay(response.data.contests);
        setDisplayMode('loaded');
      })
      .catch((e) => {
        if (e.response) {
          if (e.response.status === 401) {
            auth.logout();
            history.push('/login');
          }
        }
      });
    }
    
  }, [auth, selectedMenu]);

  const changeMenu = (index) => {
    setSelectedMenu(index);
  };

  const handleCreatePrivateContest = (e) => {
    e.preventDefault();
    history.push("/create_contest");
  };

  return (
    <Box className={displayMode} sx={{ mx:1, flexGrow: 1, minHeight:'100vh' }}>

      <Grid>
          <Box sx={{ mt: 1 }}>
            <Typography
              variant="h1"
              component="div"
              className={classes.moreThan}
              color="primary"
            >
              Welcome to DIYSE
            </Typography>
            <Typography
              variant="h1"
              component="div"
              className={classes.moreThanSpan}
              color="primary"
              sx={{mb:1}}
            >
             Choose how you want to join a DIYSE contest:
            </Typography>
            
            <Grid container spacing={4} justify="flex-start" direction="row" alignItems="flex-end" justifyContent="center">
              <Grid item xs={12} sm={4} lg={3}>
                <Card>
                  <CardContent sx={{ minHeight:"110px", backgroundColor: "primary.main2"}}>
                    <Typography variant="h6" component="div" align="center">
                      Join a Public Contest
                    </Typography>
                    <Typography variant="body2" color="text.secondary" align="center">
                      Choose from our upcoming daily or weekly contests in the Contest Lobby below. You can play against other participants and test your investing
                      skills in public contests. {' '}
                      <a href={ `${settings.help}` } style={{color:"RoyalBlue"}} target="_new">Learn more...</a>
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>  
      
              <Grid item xs={12} sm={4} lg={3}>
                <Card>
                  <CardContent sx={{ minHeight:"110px", backgroundColor: "primary.main2"}} align="center">
                    <Typography variant="h6" component="div" align="center">
                      Start a Private Contest
                    </Typography>
                    <Typography variant="body2" color="text.secondary" align="center">
                      Create your own contest, specify the payout structure and contest length, and invite your friends.
                    </Typography>
                    <Button variant="contained" onClick={(e) => handleCreatePrivateContest(e) } sx={{ mt:1, backgroundColor: 'primary.blue', color: 'white', '&:hover': { backgroundColor: 'primary.blue', color: 'white',},}}>Create a Private Contest</Button>                    
                  </CardContent>
                </Card>
              </Grid>  
            </Grid>
          </Box>
    
          <Grid
            container
            direction="row"
            justifyContent="flex-start"
            alignItems="flex-end"
            maxWidth="lg"
            sx={
              matches
                ? { pt: 4, mx: 'auto' }
                : { pt: 4, mx: '22px', width: 'max-content' }
            }
          >
            <Typography
              variant="h1"
              component="div"
              sx={
                matches
                  ? { fontWeight: 700, fontSize: 24, textDecoration: 'none' }
                  : {
                      fontWeight: 700,
                      fontSize: 18,
                      textDecoration: 'none',
                    }
              }
              color="primary"
            >
              Contest Lobby
            </Typography>
          </Grid>
    
          <Grid sx={matches ? {} : { mx: '22px' }}>
            <Box>
              <Grid
                container
                direction="row"
                justifyContent="flex-start"
                alignItems="flex-end"
                maxWidth="lg"
                sx={matches ? { pt: 4, mx: 'auto' } : { pt: 4, pb: 3, mx: 'auto' }}
              >
                {['Upcoming', 'Running', 'My Contests', 'Past'].map((elem, index) => (
                  <Grid item key={index}>
                    <Typography variant="h1" component="span" color="primary">
                      <Box
                        onClick={() => changeMenu(index)}
                        width={'max-content'}
                        sx={
                          matches
                            ? {
                                fontWeight: 700,
                                fontSize: 20,
                                textDecoration: 'none',
                                mr: 2,
    
                                pb: 1,
                                cursor: 'pointer',
                                opacity: `${selectedMenu === index ? '1' : '0.7'}`,
                                borderBottom: `${
                                  selectedMenu === index
                                    ? '4px solid #3669EF'
                                    : '4px solid rgba(255, 255, 255, 0)'
                                }`,
                              }
                            : {
                                fontWeight: 700,
                                fontSize: 14,
                                textDecoration: 'none',
                                mr: 2,
                                pb: 1,
                                cursor: 'pointer',
                                opacity: `${selectedMenu === index ? '1' : '0.7'}`,
                                borderBottom: `${
                                  selectedMenu === index
                                    ? '4px solid #3669EF'
                                    : '4px solid rgba(255, 255, 255, 0)'
                                }`,
                              }
                        }
                      >
                        {elem}
                      </Box>
                    </Typography>
                  </Grid>
                ))}
              </Grid>
              {!contestDataToDisplay.length ? (
                <Grid
                  container
                  direction="row"
                  justifyContent="center"
                  alignItems="center"
                  maxWidth="lg"
                  sx={{ pt: 4, pb: 10, mx: 'auto' }}
                >
                  <Typography
                    variant="h1"
                    component="div"
                    sx={{ fontWeight: 700, fontSize: 16, textDecoration: 'none' }}
                    color="primary"
                  >
                    {selectedMenu === 1 && (
                      <>
                        NO CURRENTLY RUNNING CONTESTS
                      </>
                    )}
                    {selectedMenu === 2 && (
                      <>
                        YOU HAVE NO RECENT CONTESTS
                      </>
                    )}
                    {selectedMenu === 3 && (
                      <>
                        THERE ARE NO PAST CONTESTS
                      </>
                    )}
                    
                  </Typography>
                </Grid>
              ) : (
                <Grid
                  container
                  maxWidth="lg"
                  sx={{
                    mx: 'auto',
                  }}
                >
                  {matches && (
                    <Grid container spacing={1} sx={{ my: 1, py: 2, px: 2.5 }}>
                      <Grid item xs={12} md={4}>
                        <Typography
                          variant="h1"
                          component="div"
                          sx={{ fontWeight: 400, fontSize: 18 }}
                          color="primary"
                        >
                          Contest Name
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={1}>
                        <Typography
                          variant="h1"
                          component="div"
                          sx={{ fontWeight: 400, fontSize: 16 }}
                          color="primary"
                        >
                          Entry fee
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={2}>
                        <Typography
                          variant="h1"
                          component="div"
                          sx={{ fontWeight: 400, fontSize: 16, ml: 5 }}
                          color="primary"
                        >
                          Payout Structure
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={2}>
                        <Typography
                          variant="h1"
                          component="div"
                          sx={{ fontWeight: 400, fontSize: 16 }}
                          color="primary"
                        >
                          Starts In
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Typography
                          variant="h1"
                          component="div"
                          sx={{ fontWeight: 400, fontSize: 16 }}
                          color="primary"
                        >
                          Entries
                        </Typography>
                      </Grid>
                    </Grid>
                  )}
    
                  {contestDataToDisplay.map((contests, index) => {
                    return (
                      <Contest contests={contests} key={index} showPrize={'true'} />
                    );
                  })}
                </Grid>
              )}
              {selectedMenu === 0 && (
                <Grid
                  container
                  direction="row"
                  justifyContent="center"
                  alignItems="center"
                  maxWidth="lg"
                  sx={{ pt: 1, pb: 4, mx: 'auto' }}                
                >
                  <Typography
                    variant="h1"
                    component="div"
                    sx={{ fontWeight: 700, fontSize: 18, textDecoration: 'none' }}
                    color="primary"
                  >
                    More upcoming contests will be added soon
                  </Typography>
                </Grid>
              )}
              <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
                maxWidth="lg"
                sx={{ pt: 1, pb: 4, mx: 'auto' }}                
              >
                <Typography
                  variant="h1"
                  sx={{ fontWeight: 700, fontSize: 20, textDecoration: 'none' }}
                  color="primary"
                >
                  Public contests with cash payouts are coming soon! Private contests with cash payouts are
                </Typography>
                <Typography
                  variant="h1"
                  sx={{ ml:1, fontWeight: 700, fontSize: 20, textDecoration: 'none', color:'RoyalBlue' }}
                  color="primary"
                  component={Link} 
                  to={{ pathname: `/create_contest` }}
                >
                   available now.
                </Typography>
              </Grid>
              <Grid>
                {selectedMenu < 2 && (
                  <a style={{ color: 'RoyalBlue' }} href={ `${settings.faq_where_is_private_contest}` } target="_new">Invited to a private contest but don't see it listed?</a>
                )}
                {contestDataToDisplay.length > 0 && selectedMenu === 2 && (
                  <Typography component={Link} to={{ pathname: `/user_contests` }} sx={{color:'RoyalBlue', cursor:'pointer'}}>
                    Looking for your older past contests?
                  </Typography>
                )}
              </Grid>
            </Box>
          </Grid>

      </Grid>
    </Box>
  );
};

export default Contests;
