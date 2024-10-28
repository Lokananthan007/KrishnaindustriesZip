import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTheme, styled } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
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
import MainCard from 'ui-component/cards/MainCard';
import config from "../../config";

const CardWrapper = styled(MainCard)(({ theme }) => ({
  overflow: 'hidden',
  position: 'relative',
  '&:after': {
    content: '""',
    position: 'absolute',
    width: 210,
    height: 310,
    background: `linear-gradient(210.04deg, ${theme.palette.warning.dark} -50.94%, rgba(144, 202, 249, 0) 83.49%)`,
    borderRadius: '50%',
    top: -30,
    right: -150
  },
  '&:before': {
    content: '""',
    position: 'absolute',
    width: 210,
    height: 210,
    background: `linear-gradient(140.9deg, ${theme.palette.warning.dark} -14.02%, rgba(144, 202, 249, 0) 70.50%)`,
    borderRadius: '50%',
    top: -160,
    right: -100
  }
}));

const AllDeliveries = () => {
  const theme = useTheme();
  const [orders, setOrders] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    axios.get(`${config.apiUrl}/cust_purch/getAllDeliveries`)
      .then((res) => {
        setOrders(res.data);
      })
      .catch((err) => {
        console.log("Orders Data can't be fetched.", err);
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
      <CardWrapper>
        <Box sx={{ p: 0.5 }}>
          <List sx={{ py: 0 }}>
            <ListItem
              alignItems="center"
              disableGutters
              sx={{ py: 0, cursor: 'pointer' }}
              onClick={handleClickOpen}
            >
              <ListItemAvatar>
                <Avatar
                  variant="rounded"
                  sx={{
                    ...theme.typography.commonAvatar,
                    ...theme.typography.largeAvatar,
                    bgcolor: 'warning.light',
                    color: 'warning.dark'
                  }}
                >
                  O
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                sx={{ py: 0, mt: 0.45, mb: 0.45 }}
                primary={<Typography variant="h2">{orders.length}</Typography>}
                secondary={
                  <Typography variant="subtitle2" sx={{ color: 'grey.500', mt: 0.5 }}>
                    Total Orders
                  </Typography>
                }
              />
            </ListItem>
          </List>
        </Box>
      </CardWrapper>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Details of Orders</DialogTitle>
        <DialogContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Invoice Number</TableCell>
                  <TableCell>Courier Name</TableCell>
                  <TableCell>Delivery Code</TableCell>
                  <TableCell>Delivery Status</TableCell>
                  <TableCell>Delivery Date Time</TableCell>
                  <TableCell>Delivered Date Time</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{order.invoice_number}</TableCell>
                    <TableCell>{order.courier_name}</TableCell>
                    <TableCell>{order.delivery_code}</TableCell>
                    <TableCell>{order.delivery_status}</TableCell>
                    <TableCell>{new Date(order.delivery_date_time).toLocaleString()}</TableCell>
                    <TableCell>
                      {order.delivered_date_time ? new Date(order.delivered_date_time).toLocaleString() : 'N/A'}
                    </TableCell>
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

export default AllDeliveries;
