// assets
import { IconTypography, IconClipboardList, IconChartLine, IconUserSearch, IconFileInvoice, IconPalette, IconShadow, IconWindmill, IconUserPlus, IconPhoneOff } from '@tabler/icons-react';

// constant
const icons = {
  IconTypography,
  IconPalette,
  IconShadow,
  IconWindmill,
  IconUserPlus,
  IconPhoneOff,
  IconUserSearch,
  IconFileInvoice,
  IconChartLine,
  IconClipboardList
};

// ==============================|| UTILITIES MENU ITEMS ||============================== //

const emp_leads = {
  id: 'emp_leads',
  title: 'Leads',
  type: 'group',
  children: [
    {
      id: 'emp-leadss',
      title: 'Leads Index',
      type: 'item',
      url: '/leadsIndex',
      icon: icons.IconUserSearch,
      breadcrumbs: false
    },
    {
      id: 'emps-leads',
      title: 'Following Leads Index',
      type: 'item',
      url: '/flwLeadsIndex',
      icon: icons.IconUserPlus,
      breadcrumbs: false
    },
    {
      id: 'emp-leads',
      title: 'Not call Attended Leads',
      type: 'item',
      url: '/NotAttendedcall',
      icon: icons.IconPhoneOff,
      breadcrumbs: false
    },

    {
      id: 'emp-leadsquotationHistory',
      title: 'Leads Qutation History',
      type: 'item',
      url: '/quotationHistory',
      icon: icons.IconFileInvoice,
      breadcrumbs: false
    },
    {
      id: 'emp-leadsProformaHistory',
      title: 'Leads Proforma History',
      type: 'item',
      url: '/proformaHistory',
      icon: icons.IconFileInvoice,
      breadcrumbs: false
    },
    {
      id: 'emp-leadsHistory',
      title: 'Leads Invoice History',
      type: 'item',
      url: '/invoiceHistory',
      icon: icons.IconFileInvoice,
      breadcrumbs: false
    }
  ]
};

export default emp_leads;
