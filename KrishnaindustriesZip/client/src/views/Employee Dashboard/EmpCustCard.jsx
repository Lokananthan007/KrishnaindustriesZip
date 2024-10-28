import axios from 'axios';
import React, { useEffect, useState } from 'react';
import config from '../../config';
import { styled, useTheme } from '@mui/material/styles';
import MainCard from 'ui-component/cards/MainCard';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';

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

const EmpCustCard = () => {
  const theme = useTheme();
  const [custCount, setCustCount] = useState([]);
  const emp_id = sessionStorage.getItem('emp_id');
  useEffect(() => {
    axios
      .get(`${config.apiUrl}/customer/getCustomerByEmpId/${emp_id}`)
      .then((res) => {
        setCustCount(res.data);
      })
      .catch((err) => {
        console.log('Customer count is not fetched.');
      });
  });
  return (
    <>
      <MainCard>
        <CardWrapper border={false} content={false}>
          <Box sx={{ p: 2 }}>
            <List sx={{ py: 0 }}>
              <ListItem alignItems="center" disableGutters sx={{ py: 0 }}>
                <ListItemAvatar>
                  <Avatar
                    variant="rounded"
                    sx={{
                      ...theme.typography.commonAvatar,
                      ...theme.typography.largeAvatar,
                      bgcolor: 'primary.800',
                      color: '#fff'
                    }}
                  ></Avatar>
                </ListItemAvatar>
                <ListItemText
                  sx={{ py: 0, my: 0.45 }}
                  primary={
                    <Typography className="text-center" variant="h2" sx={{ color: '#fff' }}>
                      Customer
                    </Typography>
                  }
                />
                <ListItemText
                  sx={{ py: 0, my: 0.45 }}
                  primary={
                    <Typography className="text-center" variant="h2" sx={{ color: '#fff' }}>
                      {custCount.length}
                    </Typography>
                  }
                />
              </ListItem>
            </List>
          </Box>
        </CardWrapper>
      </MainCard>
    </>
  );
};

export default EmpCustCard;
