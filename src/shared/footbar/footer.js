import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

const Footbar = () => {

  return (
    <Box textAlign="center" sx={{ mt:10 }}>
      <Container maxWidth="sm">
        <Typography component="div" sx={{ flexGrow: 1, fontWeight: 400, fontSize: 12, pt:4}}>
          © DIYSE, 2021. All rights reserved.
        </Typography>
        <Typography align="center" sx={{fontSize:12}}>
          <a style={{ color: 'RoyalBlue' }} href="https://www.mydiyse.com" target="_new">www.mydiyse.com</a>
        </Typography>        
      </Container>
    </Box>
  );
};

export default Footbar;
