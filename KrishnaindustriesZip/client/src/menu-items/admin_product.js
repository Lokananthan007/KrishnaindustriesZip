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

const admin_product = {
  id: 'admin_product',
  title: 'Product',
  type: 'group',
  children: [
    {
      id: 'admin-product',
      title: 'Product Index',
      type: 'item',
      url: '/proIndex',
      icon: icons.IconWindmill,
      breadcrumbs: false
    }
  ]
};

export default admin_product;
