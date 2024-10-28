
import PropTypes from 'prop-types';

// material-ui
import { styled, useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import { IoMdLogOut } from "react-icons/io";

// project imports
import MainCard from 'ui-component/cards/MainCard';
import TotalIncomeCard from 'ui-component/cards/Skeleton/TotalIncomeCard';

// assets
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';
import { useState } from 'react';
import axios from 'axios';
import config from '../../../../config';
import { Button, Dialog, DialogActions, DialogContent } from '@mui/material';

// styles
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

// ==============================|| DASHBOARD - TOTAL INCOME DARK CARD ||============================== //

const EmpExit = ({ isLoading }) => {
  const theme = useTheme();
  const emp_id = sessionStorage.getItem('emp_id');
    const [openMessage, setOpenMessage] = useState(false);
    const [message, setMessage] = useState('');

    const handleExit = () => {
        axios.post(`${config.apiUrl}/emp_attend/empExit/${emp_id}`)
            .then((res) => {
                setMessage(res.data.message);
                setOpenMessage(true);
            })
            .catch((err) => {
                if(err.response){
                setMessage(err.response.data.message); 
                setOpenMessage(true);
                }
                console.log("Attendance Error :", err);
            });
    }

  return (
    <>
      {isLoading ? (
        <TotalIncomeCard />
      ) : (
        <MainCard>
          <CardWrapper border={false} content={false} >
          <Box sx={{ p: 2 }}>
            <List sx={{ py: 0 }}>
              <ListItem alignItems="center" disableGutters sx={{ py: 0 }}>
                <ListItemAvatar>
                  <Avatar
                    variant="rounded"
                    onClick={handleExit}
                    sx={{
                      ...theme.typography.commonAvatar,
                      ...theme.typography.largeAvatar,
                      bgcolor: 'primary.800',
                      color: '#fff'
                    }}
                  >
                    <IoMdLogOut  fontSize="inherit" />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  sx={{ py: 0, my: 0.45 }}
                  primary={
                    <Typography onClick={handleExit} className='ms-5' variant="h2" sx={{ color: '#fff' }}>
                      Exit
                    </Typography>
                  }
                />
              </ListItem>
            </List>
          </Box>
          <Dialog open={openMessage} onClose={() => setOpenMessage(false)}>
<DialogContent>
    <Typography>{message}</Typography>
</DialogContent>
<DialogActions>
    <Button onClick={() => setOpenMessage(false)}>Close</Button>
</DialogActions>
</Dialog>
        </CardWrapper>
        </MainCard>

      )}


    </>
  );
};

EmpExit.propTypes = {
  isLoading: PropTypes.bool
};

export default EmpExit;

