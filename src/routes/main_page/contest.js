import * as React from "react";
import Box from "@mui/material/Box";
import { Link } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Chip from "@mui/material/Chip";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { makeStyles } from "@mui/styles";
import CustomCircularProgress from "./../../shared/customCircularProgress/customCircularProgress";
import { useMediaQuery } from "@mui/material";
import Modal from "@mui/material/Modal";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from '@mui/material/IconButton';
import { useTheme } from "@mui/material/styles";

import UserService  from './../../services/user-service';

const useStyles = makeStyles((theme) => ({
  root: {
    textTransform: "uppercase",
  },
  textB: {
    ...theme.typography.b,
  },
  btn: {
    background: "#3669EF",
    border: "transparent",
    color: "#fff",
  },
  mobile: {
    fontWeight: 700,
    fontSize: 16,
    border: 1,
    borderRadius: 1,
    borderColor: "rgba(166,166,166,0.41)",
    textAlign: "center",
    lineHeight: "29px",
  },
}));
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  maxWidth: 400,
  minWidth: 300,
  bgcolor: "primary.main3",
  border: "1px solid primary.main3",
  boxShadow: 24,
  px: 2,
  py: 1,
};
const TimeBlock = ({ value, span }) => {
  return (
    <Grid
      item
      position={"relative"}
      sx={{ fontWeight: 700, fontSize: 16 }}
      color="primary"
    >
      <Typography
        component="div"
        width={"29px"}
        height={"29px"}
        sx={{
          fontWeight: 700,
          fontSize: 16,
          border: 1,
          borderRadius: 1,
          borderColor: "rgba(164,164,164,0.61)",
          textAlign: "center",
          lineHeight: "29px",
        }}
        color="primary"
      >
        {value}
      </Typography>
      <Typography
        component="div"
        sx={{
          fontWeight: 400,
          fontSize: 12,
          mt: 1,
          textAlign: "center",
        }}
        color="primary"
      >
        {span}
      </Typography>
    </Grid>
  );
};
const Contest = ({ contests, index, showPrize }) => {
  const [entriesModal, setEntriesModal] = React.useState(false);
  const [payoutStructure, setPayoutStructure] = React.useState([]);
  const [participants, setParticipants] = React.useState([]);
  const [prizeModal, setPrizeModal] = React.useState(false);
  const [prizeDetails, setPrizeDetails] = React.useState([]);

  const handlePrizeClose = () => setPrizeModal(false);
  const handleClose = () => setEntriesModal(false);
  const colorTheme = useTheme();

  const handlePrizeOpen = (e, contest_key) => {
    e.preventDefault();
    UserService.getContestDetails(contest_key)
    .then((response) => {
      if (response) {
        setPrizeDetails(response.data);
        setPayoutStructure(response.data.payout_structure);
        setPrizeModal(true);
      }
    });
  };

  const handleOpen = (e, contest_key) => {
    e.preventDefault();
    UserService.getContestParticipants(contest_key, 100)
    .then((response) => {
      if (response) {
        setParticipants(response.data.participants);    
        setEntriesModal(true);
      }
    });
  };

  const classes = useStyles();
  const matches = useMediaQuery("(min-width:950px)");

  if (matches) {
    return (
      <Grid
        item
        xs={12}
        md={12}
        key={index}
        sx={{
          backgroundColor: "primary.main2",
          py: 2,
          px: 2.5,
          mb: 1,
          borderRadius: 3,
        }}
      >
        <Grid container sx={{ alignItems: "center" }} spacing={1}>
          <Grid item xs={12} md={4}>
            <Typography
              variant="h1"
              className={classes.root}
              component="div"
              sx={{ fontWeight: 700, fontSize: 16 }}
              color="primary"
            >
              {contests.name}
              {contests.is_public === false && (
                <Chip
                  label="Private"
                  sx={{
                    ml: 0.5,
                    color: "#fff",
                    fontWeight: 600,
                    fontSize: 10,
                    borderRadius: 1,
                    height: 17,
                    backgroundColor: "#2A9D8F",
                    textTransform: "none",
                  }}
                />
              )}
            </Typography>
            {contests.sponsor_name !== false && (
              <>
                <Typography
                  variant="h1"

                  component="div"
                  sx={{ fontWeight: 500, fontSize: 14, mt: 1 }}
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
                  {contests.sponsor_name}
                </Typography>
              </>
            )}
            <Typography
              variant="h1"
              className={classes.root}
              component="div"
              sx={{ fontWeight: 400, fontSize: 12, mt: 1 }}
              color="primary"
            >
              {contests.start_date === contests.end_date && contests.is_cancelled === false && (
                <>
                  {contests.start_date_formatted}
                </>
              )}
              {contests.start_date !== contests.end_date && contests.is_cancelled === false && (
                <>
                  {contests.start_date_formatted} to {contests.end_date_formatted}
                </>
              )}
              {contests.is_cancelled === true && (
                <>
                  CONTEST CANCELLED
                </>
              )}
            </Typography>
          </Grid>
          <Grid item xs={12} md={1}>
            <Typography
              variant="h1"
              component="div"
              sx={{ fontWeight: 700, fontSize: 16 }}
              color="primary"
            >
              <Typography component="span">
                {contests.entry_fee > 0 && (
                  <>
                    ${contests.entry_fee.toFixed(2)}
                  </>
                )}
                {contests.entry_fee === 0 && (
                  <>
                    Free
                  </>
                )}
              </Typography>
              {contests.entry_fee > 0 && contests.is_public === true && contests.allow_free_entries === true && (
                <>
                  <Tooltip title="Not eligibile for real money prizes" placement="top" arrow>
                    <Typography
                      variant="h1"
                      component="div"
                      sx={{ cursor:'pointer', fontWeight: 600, fontSize: 12 }}
                      color="primary"
                    >
                      Free entries allowed
                    </Typography>
                  </Tooltip>
                </>
              )}
            </Typography>
          </Grid>

          <Grid item xs={12} md={2}>
            <Typography
              variant="h1"
              component="div"
              sx={{ fontWeight: 700, fontSize: 16, ml: 5 }}
              color="primary"
            >
              <Typography
                component="span"
                sx={{ cursor: "pointer", textDecoration: "underline" }}
                onClick={(e) => handlePrizeOpen(e, contests.contest_key)}
              >
                {contests.entry_fee > 0 && (
                  <>
                    ${contests.total_prize_amount.toFixed(2)}
                  </>
                )}
                {contests.sponsor_prize !== false && (
                  <>
                    {contests.sponsor_prize}
                  </>
                )}
              </Typography>
            </Typography>
          </Grid>
          <Grid item xs={12} md={2} sx={{ mt: "3px" }}>
            <Grid container spacing={2}>
              {contests.time_until_start !== false  && contests.is_cancelled === false && (
                <>
                  <TimeBlock value={contests.time_until_start_day} span={"Days"} />
                  <TimeBlock value={contests.time_until_start_hour} span={"Hrs"} />
                  <TimeBlock value={contests.time_until_start_minute} span={"Mins"} />
                </>
              )}
            </Grid>
          </Grid>
          <Grid item xs={12} md={3} sx={{ justifyContent: "flex-end" }}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography
                  component="span"
                  sx={{ cursor: "pointer", textDecoration: "underline" }}
                  onClick={(e) => handleOpen(e, contests.contest_key)}
                >
                  <Grid container sx={{ mt: "2px" }}>
                    <Grid item>
                      <CustomCircularProgress
                        progress={
                          (contests.number_of_entrants /
                            contests.max_entrants) *
                          100
                        }
                      />
                    </Grid>
                    <Grid
                      item
                      sx={{
                        ml: "7px",
                        pb: "3px",
                        my: "auto",
                        textAlign: "center",
                      }}
                    >
                      <Typography
                        variant="h1"
                        component="div"
                        sx={{
                          display: { xs: "block", sm: "inline" },
                          flexGrow: 1,
                          fontWeight: 700,
                          fontSize: 16,
                        }}
                        color="primary"
                      >
                        {contests.number_of_entrants}
                      </Typography>
                      <Typography
                        variant="h1"
                        component="div"
                        sx={{
                          display: { xs: "block", sm: "inline" },
                          flexGrow: 1,
                          fontWeight: 400,
                          fontSize: 16,
                        }}
                        color="primary"
                      >
                        /{contests.max_entrants}
                      </Typography>
                    </Grid>
                  </Grid>
                </Typography>
              </Grid>
              <Grid item xs={6} className="table-btn">
                <Button 
                  variant="contained" 
                  component={Link} 
                  key={contests.contest_key}
                  to={{ pathname: `/contest/${contests.contest_key}` }}
                  sx={{ mt:2, backgroundColor: 'primary.blue', color: 'white', '&:hover': { backgroundColor: 'primary.blue', color: 'white',},}}
                  >
                  {contests.status === "pending" && contests.user_joined === false && (
                    <>
                      Enter
                    </>
                  )}
                  {contests.status === "pending" && contests.user_joined === true && (
                    <>
                      Review Entry
                    </>
                  )}
                  {contests.status !== "pending" && (
                    <>
                      View
                    </>
                  )}
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Modal
          open={entriesModal}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Box textAlign="right" className="close-btn">
              <IconButton aria-label="close" onClick={handleClose}>
                {colorTheme.palette.mode === "dark" ? (
                  <CloseIcon style={{ fill: "white" }} />
                ) : (
                  <CloseIcon />
                )}
              </IconButton>
            </Box>
            <Box sx={{ textAlign: "center", paddingBottom: 2 }}>
              <Typography
                variant="h1"
                component="span"
                sx={{ fontWeight: 700, fontSize: 32 }}
                color="primary"
              >
                Participants
              </Typography>
            </Box>
            <Box
              sx={{ height: 270, overflowY: "auto" }}
              className={
                colorTheme.palette.mode === "dark"
                  ? "modal-scroll"
                  : "modal-scroll-lit"
              }
            >
              {participants && participants.map((item, index) =>
                <Box
                  sx={{
                    backgroundColor: "primary.main2",
                    py: 1,
                    px: 2,
                    mb: 1,
                    borderRadius: 1,
                  }}
                >
                  <Box display="flex" alignItems="center">
                    <Box flexGrow={1} color="primary">
                      <Typography
                        variant="h1"
                        component="span"
                        sx={{ fontWeight: 400, fontSize: 16 }}
                        color="primary"
                      >
                        {item}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
        </Modal>
        <Modal
          open={prizeModal}
          onClose={handlePrizeClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Box textAlign="right" className="close-btn">
              <IconButton aria-label="close" onClick={handlePrizeClose}>
                {colorTheme.palette.mode === "dark" ? (
                  <CloseIcon style={{ fill: "white" }} />
                ) : (
                  <CloseIcon />
                )}
              </IconButton>
            </Box>
            <Box sx={{ textAlign: "center", paddingBottom: 2 }}>
              <Typography
                variant="h1"
                component="span"
                sx={{ fontWeight: 700, fontSize: 32 }}
                color="primary"
              >
                {contests.sponsor_prize === false && (
                  <>
                    Payouts - ${contests.total_prize_amount.toFixed(2)}
                  </>
                )}
                {contests.sponsor_prize !== false && (
                  <>
                    Sponsored Prize: {contests.sponsor_prize}
                  </>
                )}
              </Typography>
              {prizeDetails.is_resized === true && (
                <Box>
                  <Typography
                    variant="h1"
                    component="span"
                    sx={{ fontWeight: 700, fontSize: 14 }}
                    color="primary"
                  >
                    (Adjusted for actual number of entries)
                  </Typography>
                </Box>
              )}
            </Box>
            <Box
              sx={{ height: 300, overflowY: "auto" }}
              className={
                colorTheme.palette.mode === "dark"
                  ? "modal-scroll"
                  : "modal-scroll-lit"
              }
            >
              {payoutStructure && payoutStructure.map((item, index) =>
                <Box
                  key={index}
                  sx={{
                    backgroundColor: "primary.main2",
                    py: 1.5,
                    px: 2,
                    mb: 1,
                    borderRadius: 1,
                  }}
                >
                  <Box display="flex" alignItems="center">
                    <Box flexGrow={1} color="primary">
                      <Typography
                        variant="h1"
                        component="span"
                        sx={{ fontWeight: 700, fontSize: 16 }}
                        color="primary"
                      >
                        {item.start_place_formatted}{item.end_place_formatted ? '-'+item.end_place_formatted : ''} place
                      </Typography>
                    </Box>
                    <Box flexGrow={1} color="primary">
                      <Typography
                        variant="h1"
                        component="div"
                        sx={{ fontWeight: 700, fontSize: 16, textAlign: "right" }}
                        color="primary"
                      >
                        {item.payout_formatted}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              )}
              {contests.sponsor_details !== false && (
                <>
                  <Box textAlign="center">
                    <Typography
                      variant="h1"
                      component="span"
                      sx={{ fontWeight: 700, fontSize: 20 }}
                      color="primary"
                    >
                      {contests.sponsor_details}
                    </Typography>
                  </Box>
                  <Box textAlign="center" sx={{mt:5}}>
                    <Typography
                      variant="h2"
                      component="span"
                      sx={{ fontWeight: 500, fontSize: 18}}
                      color="primary"
                    >
                      <a href={ `${contests.sponsor_url}` } style={{color:"RoyalBlue"}} target="_new">{contests.sponsor_url}</a>
                    </Typography>
                  </Box>
                </>
              )}
            </Box>
          </Box>
        </Modal>
      </Grid>
    );
  } else {
    return (
      <Grid
        item
        xs={12}
        md={12}
        key={index}
        sx={{
          backgroundColor: "primary.main2",
          pt: 2,
          pb: 3,
          // px: 2.5,
          px: 3,
          mb: 1,
          borderRadius: 3,
        }}
        position={"relative"}
      >
        <Grid container sx={{ alignItems: "center" }} spacing={1}>
          <Grid container spacing={2} sx={{ mt: 0.5, mb: 2 }}>
            <Grid item xs={11}>
              <Typography
                variant="h1"
                className={classes.root}
                component="div"
                sx={{ fontWeight: 700, fontSize: 16 }}
                color="primary"
              >
                {contests.name}
                {contests.is_public === false && (
                  <Chip
                    label="Private"
                    sx={{
                      ml: 0.5,
                      color: "#fff",
                      fontWeight: 600,
                      fontSize: 10,
                      borderRadius: 1,
                      height: 17,
                      backgroundColor: "#2A9D8F",
                      textTransform: "none",
                    }}
                  />
                )}
              </Typography>
              {contests.sponsor_name !== false && (
                <>
                  <Typography
                    variant="h1"
  
                    component="div"
                    sx={{ fontWeight: 500, fontSize: 14, mt: 1 }}
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
                    {contests.sponsor_name}
                  </Typography>
                </>
              )}
              <Typography
                variant="h1"
                className={classes.root}
                component="div"
                sx={{ fontWeight: 400, fontSize: 12, mt: 1 }}
                color="primary"
              >
                {contests.start_date === contests.end_date  && contests.is_cancelled === false && (
                  <>
                    {contests.start_date_formatted}
                  </>
                )}
                {contests.start_date !== contests.end_date && contests.is_cancelled === false && (
                  <>
                    {contests.start_date_formatted} to {contests.end_date_formatted}
                  </>
                )}
                {contests.is_cancelled === true && (
                  <>
                    CONTEST CANCELLED
                  </>
                )}
              </Typography>
            </Grid>
          </Grid>
          <Grid container sx={{ mt: "3px" }}>
            <Grid item xs={7}>
              <Grid item>
                <Typography
                  variant="h1"
                  component="div"
                  sx={{ fontWeight: 700, fontSize: 12, mt: 0, mb: 1, ml: 0 }}
                  color="primary"
                >
                  {contests.is_cancelled === false && (
                    <>
                      Starts in
                    </>
                  )}
                </Typography>
              </Grid>
              <Grid container spacing={2}>
                {contests.time_until_start !== false && contests.is_cancelled === false && (
                  <>
                    <TimeBlock value={contests.time_until_start_day} span={"Days"} />
                    <TimeBlock value={contests.time_until_start_hour} span={"Hrs"} />
                    <TimeBlock value={contests.time_until_start_minute} span={"Mins"} />
                  </>
                )}
              </Grid>
            </Grid>
            <Grid item xs={4}>
              <Grid container>
                <Grid item>
                  <Typography
                    variant="h1"
                    component="div"
                    sx={{
                      fontWeight: 700,
                      fontSize: 12,
                      mb: 1,
                    }}
                    color="primary"
                  >
                    Entries
                  </Typography>
                </Grid>
                <Grid container>
                  <Grid item>
                    <Typography
                      component="div"
                      sx={{ cursor: "pointer", textDecoration: "underline" }}
                      onClick={(e) => handleOpen(e, contests.contest_key)}
                    >
                      <Grid container>
                        <Grid item sx={{ my: "auto" }}>
                          <CustomCircularProgress
                            progress={
                              (contests.number_of_entrants /
                                contests.max_entrants) *
                              100
                            }
                          />
                        </Grid>
                        <Grid
                          item
                          sx={{
                            ml: "7px",
                            pb: "3px",
                            my: "auto",
                            textAlign: "center",
                          }}
                        >
                          <Grid container>
                            <Typography
                              variant="h1"
                              component="div"
                              sx={{
                                display: { xs: "block", sm: "inline" },
                                flexGrow: 1,
                                fontWeight: 700,
                                fontSize: 16,
                              }}
                              color="primary"
                            >
                              {contests.number_of_entrants}
                            </Typography>
                            <Typography
                              variant="h1"
                              component="div"
                              sx={{
                                display: { xs: "block", sm: "inline" },
                                flexGrow: 1,
                                fontWeight: 400,
                                fontSize: 16,
                              }}
                              color="primary"
                            >
                              /{contests.max_entrants}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid container sx={{ mt: 3 }}>
            <Grid item xs={3}>
              <Typography
                variant="h1"
                component="div"
                sx={{ fontWeight: 400, fontSize: 13, mb: 1 }}
                color="primary"
              >
                Entry Fee
              </Typography>

              <Typography
                variant="h1"
                component="div"
                sx={{
                  fontWeight: 700,
                  fontSize: 15,
                  // color: `${
                  //   contextTheme === "dark"
                  //     ? "rgba(229,229,229,0.79)"
                  //     : "rgba(59,59,59,0.79)"
                  // }`,
                }}
                color="primary"
              >
                <Typography component="span">
                  {contests.entry_fee > 0 && (
                    <>
                      ${contests.entry_fee.toFixed(2)}
                    </>
                  )}
                  {contests.entry_fee === 0 && (
                    <>
                      Free
                    </>
                  )}           
                  {contests.entry_fee > 0 && contests.is_public === true && contests.allow_free_entries === true && (
                    <>
                      <Tooltip title="Not eligibile for real money prizes" placement="top" arrow>
                        <Typography
                          variant="h1"
                          component="div"
                          sx={{ cursor:'pointer', fontWeight: 600, fontSize: 12 }}
                          color="primary"
                        >
                          Free entries allowed
                        </Typography>
                      </Tooltip>
                    </>
                  )}
                </Typography>
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography
                variant="h1"
                component="div"
                sx={{ fontWeight: 400, fontSize: 13, mb: 1 }}
                color="primary"
              >
                Prize Pool
              </Typography>

              <Typography
                variant="h1"
                component="div"
                sx={{ fontWeight: 700, fontSize: 15 }}
                color="primary"
              >
                <Typography
                  component="span"
                  sx={{ cursor: "pointer", textDecoration: "underline" }}
                  onClick={(e) => handlePrizeOpen(e, contests.contest_key)}
                >
                  {contests.entry_fee > 0 && (
                    <>
                    ${contests.total_prize_amount.toFixed(2)}
                    </>
                  )}
                  {contests.sponsor_prize !== false && (
                    <>
                      {contests.sponsor_prize}
                    </>
                  )}
                </Typography>
              </Typography>
            </Grid>
            <Grid item xs={3} sx={{ my: "auto" }} className="table-btn">
              <Button
                component={Link}
                key={contests.contest_key}
                to={{ pathname: `/contest/${contests.contest_key}` }}
                color="primary"
                className={classes.btn}
                sx={{
                  fontWeight: 600,
                  fontSize: 14,
                  py: 0.7,
                  px: 4.3,
                  border: 2,
                  borderRadius: 1,
                }}
              >
                {contests.status === "pending" && contests.user_joined === false && (
                  <>
                    Enter
                  </>
                )}
                {contests.status === "pending" && contests.user_joined === true && (
                  <>
                    Review Entry
                  </>
                )}
                {contests.status !== "pending" && (
                  <>
                    View
                  </>
                )}
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Modal
          open={entriesModal}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Box textAlign="right" className="close-btn">
              <IconButton aria-label="close" onClick={handleClose}>
                {colorTheme.palette.mode === "dark" ? (
                  <CloseIcon style={{ fill: "white" }} />
                ) : (
                  <CloseIcon />
                )}
              </IconButton>
            </Box>
            <Box
              sx={{ height: 270, overflowY: "auto" }}
              className={
                colorTheme.palette.mode === "dark"
                  ? "modal-scroll"
                  : "modal-scroll-lit"
              }
            >
            <Typography
              variant="h1"
              component="span"
              sx={{ fontWeight: 700, fontSize: 18, mb:1 }}
              color="primary"
            >
              Participants
            </Typography>
            
            {participants && participants.map((item, index) =>
              <Box
                sx={{
                  backgroundColor: "primary.main2",
                  py: 1,
                  px: 2,
                  mb: 1,
                  borderRadius: 1,
                }}
              >
                <Box display="flex" alignItems="center">
                  <Box flexGrow={1} color="primary">
                    <Typography
                      variant="h1"
                      component="span"
                      sx={{ fontWeight: 400, fontSize: 16 }}
                      color="primary"
                    >
                      {item}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            )}
            </Box>
          </Box>
        </Modal>
        <Modal
          open={prizeModal}
          onClose={handlePrizeClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Box textAlign="right" className="close-btn">
              <IconButton aria-label="close" onClick={handlePrizeClose}>
                {colorTheme.palette.mode === "dark" ? (
                  <CloseIcon style={{ fill: "white" }} />
                ) : (
                  <CloseIcon />
                )}
              </IconButton>
            </Box>
            <Box sx={{ textAlign: "center", paddingBottom: 2 }}>
              <Typography
                variant="h1"
                component="span"
                sx={{ fontWeight: 700, fontSize: 32 }}
                color="primary"
              >
                {contests.sponsor_prize === false && (
                  <>
                    Payouts - ${contests.total_prize_amount.toFixed(2)}
                  </>
                )}
                {contests.sponsor_prize !== false && (
                  <>
                    Sponsored Prize: {contests.sponsor_prize}
                  </>
                )}
              </Typography>
            </Box>
            <Box
              sx={{ height: 300, overflowY: "auto" }}
              className={
                colorTheme.palette.mode === "dark"
                  ? "modal-scroll"
                  : "modal-scroll-lit"
              }
            >
              <Box
                sx={{
                  backgroundColor: "primary.main2",
                  py: 1.5,
                  px: 2,
                  mb: 1,
                  borderRadius: 1,
                }}
              >
                {payoutStructure && payoutStructure.map((item, index) =>
                  <Box
                    sx={{
                      backgroundColor: "primary.main2",
                      py: 1.5,
                      px: 2,
                      mb: 1,
                      borderRadius: 1,
                    }}
                  >
                    <Box display="flex" alignItems="center">
                      <Box flexGrow={1} color="primary">
                        <Typography
                          variant="h1"
                          component="span"
                          sx={{ fontWeight: 700, fontSize: 16 }}
                          color="primary"
                        >
                          {item.start_place_formatted}{item.end_place_formatted ? '-'+item.end_place_formatted : ''} place
                        </Typography>
                      </Box>
                      <Box flexGrow={1} color="primary">
                        <Typography
                          variant="h1"
                          component="div"
                          sx={{ fontWeight: 700, fontSize: 16, textAlign: "right" }}
                          color="primary"
                        >
                          {item.payout_formatted}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                )}
                {contests.sponsor_details !== false && (
                  <>
                    <Box display="flex" alignItems="center">
                      <Typography
                        variant="h1"
                        component="span"
                        sx={{ fontWeight: 700, fontSize: 16 }}
                        color="primary"
                      >
                        {contests.sponsor_details}
                      </Typography>
                    </Box>
                    <Box textAlign="center" sx={{mt:5}}>
                      <Typography
                        variant="h2"
                        component="span"
                        sx={{ fontWeight: 500, fontSize: 14}}
                        color="primary"
                      >
                        <a href={ `${contests.sponsor_url}` } style={{color:"RoyalBlue"}} target="_new">{contests.sponsor_url}</a>
                      </Typography>
                    </Box>
                  </>
                )}                
              </Box>
            </Box>
          </Box>
        </Modal>
      </Grid>
    );
  }
};

export default Contest;
