import React, { useEffect, useState, useContext } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Box, Typography } from "@mui/material";

import { makeStyles } from "@mui/styles";
import { ContextMode } from "../../App";

const theme = createTheme({
  palette: {
    primary: {
      main: "#2A9D8F",
    },
    secondary: {
      main: "#E76F51",
    },
    warning: {
      main: "#F9537F",
    },
  },
});

const useStyles = makeStyles((theme) => ({
  circle: {
    strokeLinecap: "round",
    zIndex: 10,
  },
  mainCircle: {
    zIndex: 1,
  },
  backgroundCircleDarkTheme: {
    zIndex: 0,
    color: "rgba(255,255,255,0.83)",
    position: "absolute",
  },

  backgroundCircleWhiteTheme: {
    zIndex: 0,
    color: "rgba(199,199,199,0.83)",
    position: "absolute",
  },
}));

const CustomCircularProgress = ({ progress }) => {
  const classes = useStyles();
  const [circularColor, setCircularColor] = useState("primary");
  const contextTheme = useContext(ContextMode);
  useEffect(() => {
    if (progress >= 50 && progress < 90) {
      setCircularColor("secondary");
    } else if (progress >= 90) {
      setCircularColor("warning");
    } else {
      setCircularColor("primary");
    }
  }, [progress]);
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ position: "relative", display: "inline-flex" }}>
        <CircularProgress
          variant="determinate"
          value={progress}
          color={circularColor}
          classes={{
            root: classes.mainCircle,
            circle: classes.circle,
          }}
          thickness={5}
        />

        <CircularProgress
          size={39.7}
          classes={{
            root:
              contextTheme === "dark"
                ? classes.backgroundCircleDarkTheme
                : classes.backgroundCircleWhiteTheme,
          }}
          variant="determinate"
          value={100}
          thickness={4.6}
        />
        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: "absolute",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography
            variant="caption"
            component="div"
            color={contextTheme === "dark" ? "white" : "dark"}
            sx={{ fontWeight: 700, fontSize: 10 }}
          >{`${Math.round(progress)}%`}</Typography>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default CustomCircularProgress;
