import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import history from './../../services/history';
import UserService  from './../../services/user-service';

const PreviousPortfolios = (props) => {
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
  
  const { contestEntryKey, contest_key } = useParams();
  const [portfolioData, setPortfolioData] = useState([]);

  useEffect(() => {
    document.title = "DIYSE Previous Portfolio";
  }, []);
  
  useEffect(() => {
    const fetchData = async () => {
      UserService.getPreviousPortfolios(contest_key)
      .then(
        (response) => {
          if (response) {
            setPortfolioData(response.data.portfolios);
          }
        });
    };
    fetchData();
  }, [contest_key]);

  const handlePortfolioCopy = (e, original_contest_entry_key) => {
    e.preventDefault();
    UserService.createPreviousPortfolioCopy(original_contest_entry_key, contestEntryKey)
    .then((response) => {
      if (response) {
        history.push("/portfolio/"+contest_key+"/"+contestEntryKey);        
      }
    });
  };

  return (
    <>
    <Box sx={{ my, px, color: 'text.primary' }}>
      <IconButton LinkComponent={Link} to={{ pathname: '/contest/'+contest_key }}>
        <ArrowBackIosIcon />
        <Typography sx={{ fontSize: isBelowSm ? 12 : 18, fontWeight: 500 }}>
          BACK
        </Typography>
      </IconButton>

       {portfolioData.map((link, index) => {
        return (
          <Accordion sx={{ width:'100%', backgroundColor: "transparent", boxShadow: "none"}} color="primary">
            <AccordionSummary
              sx={{ width:'100%', flexDirection: 'row-reverse'}}
              expandIcon={
                <ExpandMoreIcon
                  sx={{
                    size: "large",
                    pointerEvents: "auto"
                  }}
                />
              }
              aria-controls="panel2a-content"
              id="panel2a-header"
            >
              <Box
                item
                key={link.contest_entry_key}
                container
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ width:'100%'}}
                >
                  <Box>
                    <Typography variant="h1" component="div" sx={{ fontWeight: 400, fontSize: 20, mb:1 }} color="primary">
                      {link.contest}
                    </Typography>
                    <Typography variant="h1" component="div" sx={{ fontWeight: 400, fontSize: 14 }} color="primary">
                      created at {link.created}
                    </Typography>
                  </Box>
                  <Box justify="right" textAlign="right">
                    <Box>
                      <Button variant="contained"  onClick={(e) => handlePortfolioCopy(e, link.contest_entry_key) } sx={{ backgroundColor: 'primary.blue', color: 'white', '&:hover': { backgroundColor: 'primary.blue', color: 'white',},}}>USE PORTFOLIO</Button>
                    </Box>
                  </Box>
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{mb:2}}>
              {link.securities.map((security, index2) => {
                  return (
                      <Box>
                        {security.is_short ?
                          <Grid
                            key={index2+security.symbol}
                            container
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                            sx={{width:'30%'}}
                          >
                            <Typography variant="h2" component="div" sx={{ fontWeight: 400, fontSize: 16, color:'#A95151', display:'inline' }}>{security.symbol}</Typography>
                            <Typography variant="h2" component="div" sx={{ fontWeight: 400, fontSize: 16, color:'#A95151', display:'inline' }}>{security.percent}%</Typography>
                          </Grid>
                          :
                          <Grid
                            key={index2+security.symbol}
                            container
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                            sx={{width:'30%'}}
                          >
                            <Typography variant="h2" component="div" sx={{ fontWeight: 400, fontSize: 16, color:'#00DE81' }}>{security.symbol}</Typography>
                            <Typography variant="h2" component="div" sx={{ fontWeight: 400, fontSize: 16, color:'#00DE81' }}>{security.percent}%</Typography>
                          </Grid>
                        }
                      </Box>
                  );
                })
              }
            </AccordionDetails>
          </Accordion>

          );
        })
      }
    </Box>
    
    </>
  );

};

export default PreviousPortfolios;
