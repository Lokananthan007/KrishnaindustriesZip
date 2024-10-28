import React from 'react';
import { IconLogout } from '@tabler/icons-react';
import { Button, Dialog, DialogContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ProfileSection = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/');
    window.location.reload();
  };
  return (
    <>
      <Button onClick={handleLogout} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <IconLogout style={{ marginBottom: '4px' }} /> {/* Adjust the margin as needed */}
        Logout
      </Button>
    </>
  );
};

export default ProfileSection;
