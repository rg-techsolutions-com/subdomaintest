import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  useTheme,
} from '@mui/material';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ContestDetailSecurityDialogChart from './security_dialog_chart';
import useMediaQuery from '@mui/material/useMediaQuery';

const BootstrapDialogTitle = (props) => {
  const { children, onClose, smallScreen, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: smallScreen ? 4 : 2 }} {...other}>
      {children}

      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{
          position: 'absolute',
          right: smallScreen ? 2 : 8,
          top: smallScreen ? 2 : 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
    </DialogTitle>
  );
};

export default function ContestDetailSecurityDialog({
  isOpen,
  onClose,
  displayName,
  contestName,
  pieChartData,
}) {
  const theme = useTheme();
  const isBelowSm = useMediaQuery(theme.breakpoints.down(600));

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      PaperProps={{
        style: {
          background: theme.palette.primary.mainGradient.split(';')[0],
        },
      }}
    >
      <BootstrapDialogTitle onClose={onClose} smallScreen={isBelowSm}>
        <Typography sx={{ fontWeight: 700, fontSize: 20, color: 'inherit' }}>
          {contestName}
        </Typography>
        <Typography
          sx={{ mt: 1, fontWeight: 700, fontSize: 20, color: '#E76F51' }}
        >
          {displayName}
        </Typography>
      </BootstrapDialogTitle>
      <DialogContent sx={{ width: isBelowSm ? 'auto' : 380 }}>
        <ContestDetailSecurityDialogChart pieChartData={pieChartData} />
      </DialogContent>
    </Dialog>
  );
}
