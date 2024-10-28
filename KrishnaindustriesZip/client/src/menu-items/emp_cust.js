// assets
import { IconTypography, IconUserDollar, IconUsers, IconPalette, IconShadow, IconWindmill } from '@tabler/icons-react';

// constant
const icons = {
  IconTypography,
  IconPalette,
  IconShadow,
  IconWindmill,
  IconUsers,
  IconUserDollar
};

// ==============================|| UTILITIES MENU ITEMS ||============================== //

const emp_cust = {
  id: 'emp_cust',
  title: 'Customers',
  type: 'group',
  children: [
    {
      id: 'emp-customer',
      title: 'Customer Index',
      type: 'item',
      url: '/custIndex',
      icon: icons.IconUsers,
      breadcrumbs: false
    },
    {
      id: 'emp-customerPur',
      title: 'Customer Purchase',
      type: 'item',
      url: '/custPurchIndex',
      icon: icons.IconUserDollar,
      breadcrumbs: false
    }
  ]
};

export default emp_cust;
