// assets
import { IconTypography, IconPalette, IconShadow, IconStack3, IconWindmill, IconQrcode } from '@tabler/icons-react';

// constant
const icons = {
  IconTypography,
  IconStack3,
  IconPalette,
  IconShadow,
  IconWindmill,
  IconQrcode

};

// ==============================|| UTILITIES MENU ITEMS ||============================== //

const admin_Stock = {
  id: 'admin_Stock',
  title: 'Stock',
  type: 'group',
  children: [
    {
      id: 'admin-stockproduct',
      title: 'Stock Index',
      type: 'item',
      url: '/stockIndex',
      icon: icons.IconStack3,
      breadcrumbs: false
    },
    {
      id: 'admin-qrcode-scanner',
      title: 'QRCode-Scanner',
      type: 'item',
      url: '/qrcode',
      icon: icons.IconQrcode,
      breadcrumbs: false
    }
  ]
};

export default admin_Stock;
