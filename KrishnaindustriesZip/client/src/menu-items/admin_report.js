import { IconTypography, IconReportMedical, IconReportMoney, IconPalette, IconShadow, IconWindmill, IconCheckupList } from '@tabler/icons-react';

// constant
const icons = {
  IconTypography,
  IconPalette,
  IconShadow,
  IconWindmill,
  IconReportMoney,
  IconReportMedical,
  IconCheckupList
};

// ==============================|| UTILITIES MENU ITEMS ||============================== //

const admin_reports = {
  id: 'admin_report',
  title: 'Reports',
  type: 'group',
  children: [

    {
      id: 'admin-purreport',
      title: 'purchase Report',
      type: 'item',
      url: '/purreports',
      icon: icons.IconReportMedical,
      breadcrumbs: false
    },
    {
      id: 'admin-salreport',
      title: 'Sales Report',
      type: 'item',
      url: '/salesreports',
      icon: icons.IconReportMoney,
      breadcrumbs: false
    },

    {
      id: 'admin-empreport',
      title: 'Employees attendance',
      type: 'item',
      url: 'empAttendancereports',
      icon: icons.IconCheckupList,
      breadcrumbs: false
    },

  ]
};

export default admin_reports;