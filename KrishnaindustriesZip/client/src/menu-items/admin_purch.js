// assets
import { IconTypography, IconShoppingCart, IconPalette, IconShadow, IconWindmill } from '@tabler/icons-react';

// constant
const icons = {
  IconTypography,
  IconPalette,
  IconShadow,
  IconWindmill,
  IconShoppingCart
};

// ==============================|| UTILITIES MENU ITEMS ||============================== //

const admin_purch = {
  id: 'admin_purch',
  title: 'Purchase',
  type: 'group',
  children: [
    {
      id: 'admin-purch',
      title: 'Purchase Index',
      type: 'item',
      url: '/purchIndex',
      icon: icons.IconShoppingCart,
      breadcrumbs: false
    }
  ]
};

export default admin_purch;
