import { Box, IconButton, Typography } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material';
import { Link } from 'react-router-dom';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';

const ContestDetailsHeader = (props) => {
  const theme = useTheme();
  const isBelowSm = useMediaQuery(theme.breakpoints.down(600));
  const contestDetails = props.contestDetails;
  
  const handleCopyLink = (e) => {
    let tmp_contest_details = contestDetails;
    const url = tmp_contest_details.private_url;
    window.navigator.clipboard.writeText(url);
  };
  
  return (
    <Box>
      <IconButton LinkComponent={Link} to={{ pathname: '/contests' }}>
        <ArrowBackIosIcon />
        <Typography sx={{ fontSize: isBelowSm ? 12 : 18, fontWeight: 500 }}>
          BACK
        </Typography>
      </IconButton>
      <Typography
        sx={{ mt: 4, fontSize: isBelowSm ? 20 : 32, fontWeight: 700 }}
      >
        {contestDetails.name}
      </Typography>
      {contestDetails.is_public === false && (
        <Chip label={"Private Contest by "+contestDetails.private_username} sx={{mb:1, color:"RoyalBlue", fontWeight: 600, fontSize: 12}} />
      )}
      {contestDetails.sponsor_name !== false && (
        <>
          <Typography
            variant="h1"

            component="div"
            sx={{ fontWeight: 500, fontSize: 18, mt: 1 }}
            color="primary"
          >
          <Chip
            label="Sponsored"
            sx={{
              mr: 1,
              color: "#fff",
              fontWeight: 600,
              fontSize: 10,
              borderRadius: 1,
              height: 17,
              backgroundColor: "#46496F",
              textTransform: "none",
            }}
          />
            {contestDetails.sponsor_name}
          </Typography>
        </>
      )}
      {contestDetails.is_cancelled===false &&      
        <Typography
          sx={{ mt: 1, fontSize: isBelowSm ? 15 : 20, fontWeight: 700 }}
        >
          Starts:{' '}
          <Typography
            component="span"
            sx={{ color: '#E76F51', fontSize: 'inherit', fontWeight: 'inherit' }}
          >
            {contestDetails.start_date_formatted} {contestDetails.start_time_formatted}
            {contestDetails.status === "pending" &&
              <>
                {' '}({contestDetails.time_until_start})
              </>
            }
          </Typography>
        </Typography>
      }
      {contestDetails.is_cancelled===true &&      
        <Typography
          sx={{ mt: 1, fontSize: isBelowSm ? 15 : 20, fontWeight: 700 }}
        >
          This contest has been cancelled.
        </Typography>
      }
      {contestDetails.entry_fee > 0 && (
        <Typography
          sx={{ mt: 1, fontSize: isBelowSm ? 15 : 20, fontWeight: 700 }}
        >
          Number of contest entries:{' '}
          <Typography
            component="span"
            sx={{ color: '#E76F51', fontSize: 'inherit', fontWeight: 'inherit' }}
          >
            {contestDetails.number_of_entrants}/{contestDetails.max_entrants}
          </Typography>
        </Typography>
      )}
      {contestDetails.number_of_free_entries > 0 && (
        <Typography
          sx={{ mt: 1, fontSize: isBelowSm ? 15 : 20, fontWeight: 700 }}
        >
          Number of free entries:{' '}
          <Typography
            component="span"
            sx={{ color: '#E76F51', fontSize: 'inherit', fontWeight: 'inherit' }}
          >
            {contestDetails.number_of_free_entries}
          </Typography>
        </Typography>
      )}
      {contestDetails.is_public===false && contestDetails.is_cancelled===false && contestDetails.is_private_owner===true && contestDetails.status === "pending" && (
        <Card sx={{ mt:3}}>
          <CardContent>
            <Box textAlign="center">
              <Typography variant="h5" component="div">
                Send Invitations to your Contest
              </Typography>
              <Typography color="text.secondary">
                To invite other people to your contest, send them the following link:
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {contestDetails.private_url}
              </Typography>
              <Button
                onClick={(event) => { handleCopyLink(event)}}
                variant="contained"
                sx={{
                  mt: 2,
                  width: isBelowSm ? '100%' : 300,
                  height: isBelowSm ? 15 : 28,
                  fontWeight: 700,
                  fontSize: isBelowSm ? 12 : 15,
                  backgroundColor: '#3669EF',
                  color: 'white',
                  '&: hover': { backgroundColor: '#3669EF', color: 'white' },
                }}
               >Copy Link to Clipboard</Button>
              <Typography color="text.secondary" sx={{mt:1}}>
                Note that anyone with the link can join the contest, so only share with people that you want to join, and inform them not to share if you want to limit the participants.
              </Typography>
            </Box>
          </CardContent>
        </Card>
      )}
            
    </Box>
  );
};

export default ContestDetailsHeader;
