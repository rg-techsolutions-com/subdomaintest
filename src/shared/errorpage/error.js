import React from "react";
import { useEffect } from "react";
import { Link } from 'react-router-dom';
import { makeStyles } from '@mui/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

const useStyles = makeStyles(theme => ({
  btn: {
    background: 'linear-gradient(90.45deg, #613BFB 0%, #316BFF 100%)',
  }
}));

const ErrorPage = () => {
  const classes = useStyles();
  useEffect(() => {
    document.title = "DIYSE Error";
  }, []);
  return (
    <Container maxWidth="sm">
      <Box sx={{ height: '100vh', mx: "auto", mt:30, textAlign: 'center', p:4 }}>
        <Typography variant="h1" component="div" sx={{ flexGrow: 1, fontWeight: 700, fontSize: 70 }} color="primary">
          ERROR
        </Typography>
        <Typography variant="h1" component="div" sx={{ flexGrow: 1, fontWeight: 700, fontSize: 70 }} color="primary">
          404
        </Typography>
        <Button component={Link} to="/login" color="primary" className={classes.btn} sx={{ fontWeight: 700, fontSize: 15, mt: 6, py:1.5, px:8, borderRadius: 8, }}>BACK HOME</Button>
      </Box>
    </Container>
  );
};

export default ErrorPage;
