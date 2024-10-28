// assets
import { IconTypography, IconCalendarMonth, IconPalette, IconShadow, IconWindmill, IconBriefcase } from '@tabler/icons-react';

// constant
const icons = {
  IconTypography,
  IconPalette,
  IconShadow,
  IconWindmill,
  IconBriefcase,
  IconCalendarMonth,

};

// ==============================|| UTILITIES MENU ITEMS ||============================== //

const admin_emp = {
  id: 'admin_emp',
  title: 'Employee',
  type: 'group',
  children: [
    {
      id: 'admin-emp',
      title: 'Employee Index',
      type: 'item',
      url: '/empIndex',
      icon: icons.IconBriefcase,
      breadcrumbs: false
    },

    {
      id: 'admin-empattdeance',
      title: 'Employee Attendance',
      type: 'item',
      url: '/empattendance',
      icon: icons.IconCalendarMonth,
      breadcrumbs: false
    },


  ]


};
export default admin_emp;
