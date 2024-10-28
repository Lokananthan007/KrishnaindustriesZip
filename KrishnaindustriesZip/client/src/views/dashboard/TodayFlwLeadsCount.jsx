import PropTypes from 'prop-types';
import { styled, useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';
import { useEffect, useState } from 'react';
import axios from 'axios';
import config from '../../config';
import MainCard from 'ui-component/cards/MainCard';
import TotalIncomeCard from 'ui-component/cards/Skeleton/TotalIncomeCard';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

// Styles
const CardWrapper = styled(MainCard)(({ theme }) => ({
  backgroundColor: theme.palette.primary.dark,
  color: theme.palette.primary.light,
  overflow: 'hidden',
  position: 'relative',
  '&:after': {
    content: '""',
    position: 'absolute',
    width: 210,
    height: 210,
    background: `linear-gradient(210.04deg, ${theme.palette.primary[200]} -50.94%, rgba(144, 202, 249, 0) 83.49%)`,
    borderRadius: '50%',
    top: -30,
    right: -180
  },
  '&:before': {
    content: '""',
    position: 'absolute',
    width: 210,
    height: 210,
    background: `linear-gradient(140.9deg, ${theme.palette.primary[200]} -14.02%, rgba(144, 202, 249, 0) 77.58%)`,
    borderRadius: '50%',
    top: -160,
    right: -130
  }
}));

const TodayFlwLeadsCount = ({ isLoading }) => {
  const theme = useTheme();
  const [leadsCount, setLeadsCount] = useState({});
  const [open, setOpen] = useState(false);
  const [leadsDetails, setLeadsDetails] = useState([]);

  useEffect(() => {
    axios
      .get(`${config.apiUrl}/leads/leadsCountForDashboard`)
      .then((res) => {
        setLeadsCount(res.data);
        // Parse leads details string into an array of objects
        if (res.data.leads_details) {
          const detailsArray = res.data.leads_details.split('; ').map((detail) => {
            const [emp_id, leads_name, leads_mobile] = detail.split(':');
            return { emp_id, leads_name, leads_mobile };
          });
          setLeadsDetails(detailsArray);
        }
      })
      .catch((err) => {
        console.log("Leads Data can't be fetched.");
      });
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      {isLoading ? (
        <TotalIncomeCard />
      ) : (
        <CardWrapper border={false} content={false}>
          <Box sx={{ p: 2 }}>
            <List sx={{ py: 0 }}>
              <ListItem
                alignItems="center"
                disableGutters
                sx={{ py: 0, '&:hover': { backgroundColor: theme.palette.primary200 } }}
                onClick={handleClickOpen}
              >
                <ListItemAvatar>
                  <Avatar
                    variant="rounded"
                    sx={{
                      ...theme.typography.commonAvatar,
                      ...theme.typography.largeAvatar,
                      bgcolor: 'primary.800',
                      color: '#fff'
                    }}
                  >
                    <TableChartOutlinedIcon fontSize="inherit" />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  sx={{ py: 1, my: 0.45 }}
                  primary={
                    <Typography variant="h2" sx={{ color: '#fff' }}>
                      {leadsCount.created_at_count}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="subtitle2" sx={{ color: 'primary.light', mt: 0.25 }}>
                      Today Follow Leads
                    </Typography>
                  }
                />
              </ListItem>
            </List>
          </Box>
        </CardWrapper>
      )}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Today's Follow Leads</DialogTitle>
        <DialogContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Employeee</TableCell>
                  <TableCell>Leads Name</TableCell>
                  <TableCell>Mobile</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {leadsDetails.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{row.emp_id}</TableCell>
                    <TableCell>{row.leads_name}</TableCell>
                    <TableCell>{row.leads_mobile}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

TodayFlwLeadsCount.propTypes = {
  isLoading: PropTypes.bool
};

export default TodayFlwLeadsCount;
