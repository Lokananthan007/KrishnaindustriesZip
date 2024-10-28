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

const emp_product = {
  id: 'emp_product',
  title: 'Product',
  type: 'group',
  children: [
    {
      id: 'emp-product',
      title: 'Product Index',
      type: 'item',
      url: '/proIndex',
      icon: icons.IconWindmill,
      breadcrumbs: false
    }
  ]
};

export default emp_product;