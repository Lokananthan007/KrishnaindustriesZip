// assets
import { IconTypography, IconPalette, IconShadow, IconWindmill } from '@tabler/icons-react';

// constant
const icons = {
  IconTypography,
  IconPalette,
  IconShadow,
  IconWindmill
};

// ==============================|| UTILITIES MENU ITEMS ||============================== //

const admin_sales = {
  id: 'admin_sales',
  title: 'Sales',
  type: 'group',
  children: [
    {
      id: 'admin-sales',
      title: 'Sales Index',
      type: 'item',
      url: '/salesIndex',
      icon: icons.IconTypography,
      breadcrumbs: false
    }
  ]
};

export default admin_sales;
