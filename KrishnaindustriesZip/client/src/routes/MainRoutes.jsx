import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import { element } from 'prop-types';
import AllLeads from 'components/Admin Panel/Leads/AllLeads';
import StockManagement from 'components/Admin Panel/Stock/Stock Index';
import NotAttendedcallList from 'components/Admin Panel/Leads/Not Call Attended';
import EmpCallNotAttendedLeads from 'components/Employee Panel/Employee Leads/Emp Not Call Attended';
import QrCodeScanner from 'components/Admin Panel/Stock/QrCodeScanner';
import QuotationPage from 'components/Employee Panel/Following Leads/QuotationPage';
import InvoicePage from 'components/Employee Panel/Following Leads/InvoicePage';
import ProformaPage from 'components/Employee Panel/Following Leads/Proforma';
import InvoiceHistory from 'components/Employee Panel/Following Leads/InvoiceHistory';

import EmployeeAttendancePage from 'components/Admin Panel/Employee/EmployeeAttendancepost';
import InvoiceHistoryAdmin from 'components/Admin Panel/Purchase/InvoiceHistory';
import QuotationHistory from 'components/Employee Panel/Following Leads/QuotationHistory';
import ProformaHistory from 'components/Employee Panel/Following Leads/ProformaHistory';
import ProformaPageUpdate from 'components/Employee Panel/Following Leads/ProformaUpdate';
import InvoiceConvertPage from 'components/Employee Panel/Following Leads/convertInvoice';
import ProformaConvertInvoice from 'components/Employee Panel/Following Leads/ProformaConvertInvoice';
import WalkingLeadsList from 'components/Admin Panel/Leads/WalkingAllLeads';
import AdminQuotationHistory from 'components/Admin Panel/Purchase/QuotationHistory';
import AdminProformaHistory from 'components/Admin Panel/Purchase/ProformaHistory';
// import UploadExcel from 'components/Admin Panel/Purchase/UploadExell';

const Login = Loadable(lazy(() => import('views/pages/authentication3/Login')));

// dashboard routing
const AdminDashboard = Loadable(lazy(() => import('views/dashboard/AdminDashboard')));

const EmployeeIndex = Loadable(lazy(() => import('components/Admin Panel/Employee/EmployeeIndex')));
const LeadsIndex = Loadable(lazy(() => import('components/Admin Panel/Leads/LeadsIndex')));
const EmpFollowLeadsIndex = Loadable(lazy(() => import('components/Admin Panel/Employee Following Leads/EmpFollowLeadsIndex')));
const PurchaseIndex = Loadable(lazy(() => import('components/Admin Panel/Purchase/PurchaseIndex')));
const ProductIndex = Loadable(lazy(() => import('components/Admin Panel/Product/ProductIndex')));
const SpecificationIndex = Loadable(lazy(() => import('components/Admin Panel/Product/Specification/SpecificationIndex')));
const SalesIndex = Loadable(lazy(() => import('components/Admin Panel/Sales/SalesIndex')));
const AdminCustomerIndex = Loadable(lazy(() => import('components/Admin Panel/Customer/AdminCustomerIndex')));
const AdminCustPurchIndex = Loadable(lazy(() => import('components/Admin Panel/Admin Customer Purchase/AdminCustPurchIndex')));
const UploadExcel = Loadable(lazy(() => import('components/Admin Panel/Purchase/UploadExell')));
const EmpAttendanceReport = Loadable(lazy(() => import('components/Admin Panel/Reports/EmployeeAttendance')));
const PurchaseReport = Loadable(lazy(() => import('components/Admin Panel/Reports/purchaseReport')));
const SalesReport = Loadable(lazy(() => import('components/Admin Panel/Sales/SalesIndex')));

// Employee
const EmpLeadsIndex = Loadable(lazy(() => import('components/Employee Panel/Employee Leads/EmpLeadsIndex')));
const FollowingLeadsIndex = Loadable(lazy(() => import('components/Employee Panel/Following Leads/FollowingLeadsIndex')));
const CustomerIndex = Loadable(lazy(() => import('components/Employee Panel/Customer/CustomerIndex')));
const CustPurchIndex = Loadable(lazy(() => import('components/Employee Panel/Customer Purchase/CustPurchIndex')));
const EmpDashboard = Loadable(lazy(() => import('views/Employee Dashboard/EmpDashboard')));

// utilities routing
const UtilsTypography = Loadable(lazy(() => import('views/utilities/Typography')));
const UtilsColor = Loadable(lazy(() => import('views/utilities/Color')));
const UtilsShadow = Loadable(lazy(() => import('views/utilities/Shadow')));

// sample page routing
const SamplePage = Loadable(lazy(() => import('views/sample-page')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = sessionStorage.getItem('adminLoggedIn')
  ? {
      path: '/',
      element: <MainLayout />,
      children: [
        {
          path: '/',
          element: <AdminDashboard />
        },
        {
          path: 'dashboard',
          children: [
            {
              path: 'admin',
              element: <AdminDashboard />
            }
          ]
        },
        {
          path: 'empIndex',
          element: <EmployeeIndex />
        },
        {
          path: 'empAttendancereports',
          element: <EmpAttendanceReport />
        },
        {
          path: 'empattendance',
          element: <EmployeeAttendancePage />
        },
        {
          path: 'leadsIndex',
          element: <LeadsIndex />
        },
        {
          path: 'AllLeads',
          element: <AllLeads />
        },
        {
          path: 'WalkingLeads',
          element: <WalkingLeadsList />
        },
        {
          path: 'NotAttendedcall',
          element: <NotAttendedcallList />
        },

        {
          path: 'flwLeadsIndex',
          element: <EmpFollowLeadsIndex />
        },
        {
          path: 'purchIndex',
          element: <PurchaseIndex />
        },
        {
          path: 'proIndex',
          element: <ProductIndex />
        },
        {
          path: 'specIndex/:pro_id',
          element: <SpecificationIndex />
        },
        {
          path: 'salesIndex',
          element: <SalesIndex />
        },
        {
          path: 'stockIndex',
          element: <StockManagement />
        },
        {
          path: 'qrcode',
          element: <QrCodeScanner />
        },
        {
          path: 'custIndex',
          element: <AdminCustomerIndex />
        },
        {
          path: 'purreports',
          element: <PurchaseReport />
        },
        {
          path: 'salesreports',
          element: <SalesReport />
        },
        {
          path: 'custPurchIndex',
          element: <AdminCustPurchIndex />
        },
        {
          path: 'quotation/:follow_id',
          element: <QuotationPage />
        },
        {
          path: 'invoice/:follow_id',
          element: <InvoicePage />
        },
        {
          path: 'proforma/:follow_id',
          element: <ProformaPage />
        },
        {
          path: 'invoiceHistory',
          element: <InvoiceHistoryAdmin />
        },
        {
          path: 'quotationHistory',
          element: <AdminQuotationHistory />
        },
        {
          path: 'proformaHistory',
          element: <AdminProformaHistory />
        },
        {
          path: 'proformaConvert/:follow_id/:quotation_Number',
          element: <ProformaPageUpdate />
        },
        {
          path: 'invoiceConvert/:follow_id/:quotation_Number',
          element: <InvoiceConvertPage />
        },
        {
          path: 'invoiceConvert2/:follow_id/:proforma_Number',
          element: <ProformaConvertInvoice />
        },

        {
          path: 'utils',
          children: [
            {
              path: 'util-typography',
              element: <UtilsTypography />
            },
            {
              path: 'util-color',
              element: <UtilsColor />
            },
            {
              path: 'util-shadow',
              element: <UtilsShadow />
            }
          ]
        },
        {
          path: 'uploadExcell',
          element: <UploadExcel />
        },
        {
          path: 'sample-page',
          element: <SamplePage />
        }
      ]
    }
  : sessionStorage.getItem('employeeLoggedIn')
    ? {
        path: '/',
        element: <MainLayout />,
        children: [
          {
            path: '/',
            element: <EmpDashboard />
          },
          {
            path: '/dashboard',
            element: <EmpDashboard />
          },
          {
            path: '/leadsIndex',
            element: <EmpLeadsIndex />
          },
          {
            path: 'NotAttendedcall',
            element: <EmpCallNotAttendedLeads />
          },
          {
            path: '/flwLeadsIndex',
            element: <FollowingLeadsIndex />
          },
          {
            path: 'custIndex',
            element: <CustomerIndex />
          },
          {
            path: 'custPurchIndex',
            element: <CustPurchIndex />
          },
          {
            path: 'quotation/:follow_id',
            element: <QuotationPage />
          },
          {
            path: 'invoice/:follow_id',
            element: <InvoicePage />
          },
          {
            path: 'proforma/:follow_id',
            element: <ProformaPage />
          },
          {
            path: 'proformaConvert/:follow_id/:quotation_Number',
            element: <ProformaPageUpdate />
          },
          {
            path: 'invoiceConvert/:follow_id/:quotation_Number',
            element: <InvoiceConvertPage />
          },
          {
            path: 'invoiceConvert2/:follow_id/:proforma_Number',
            element: <ProformaConvertInvoice />
          },

          {
            path: 'invoiceHistory',
            element: <InvoiceHistory />
          },
          {
            path: 'quotationHistory',
            element: <QuotationHistory />
          },
          {
            path: 'proformaHistory',
            element: <ProformaHistory />
          },
          {
            path: 'proIndex',
            element: <ProductIndex />
          },
        ]
      }
    : {
        path: '/',
        element: <Login />
      };

export default MainRoutes;
