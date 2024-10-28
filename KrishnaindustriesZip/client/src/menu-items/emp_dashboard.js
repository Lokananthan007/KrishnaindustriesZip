// assets
import { IconDashboard } from '@tabler/icons-react';

// constant
const icons = { IconDashboard };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const emp_dashboard = {
  id: 'emp_dashboard',
  title: 'Dashboard',
  type: 'group',
  children: [
    {
      id: 'emp_dashboard',
      title: 'Dashboard',
      type: 'item',
      url: '/dashboard',
      icon: icons.IconDashboard,
      breadcrumbs: false
    }
  ]
};

export default emp_dashboard;
