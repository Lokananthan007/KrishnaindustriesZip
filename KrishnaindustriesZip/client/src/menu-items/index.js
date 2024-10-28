import dashboard from './dashboard';
import pages from './pages';
import utilities from './utilities';
import other from './other';
import admin_emp from './admin_emp';
import admin_leads from './admin_leads';
import admin_purch from './admin_purch';
import admin_product from './admin_product';
import admin_sales from './admin_sales';
import admin_cust from './admin_cust';
import emp_leads from './emp_leads';
import emp_cust from './emp_cust';
import emp_dashboard from './emp_dashboard';
import emp_product from './emp_product';
import admin_Stock from './stockmanage';
import admin_reports from './admin_report';

// ==============================|| MENU ITEMS ||============================== //

// Initialize menuItems variable
let menuItems = { items: [] };

// Check admin or employee login status
const adminLoggedIn = sessionStorage.getItem("adminLoggedIn") === "true";
const employeeLoggedIn = sessionStorage.getItem("employeeLoggedIn") === "true";

// Assign menu items based on login status
if (adminLoggedIn) {
  menuItems = {
    items: [dashboard, admin_emp, admin_leads, admin_purch, admin_product, admin_cust, admin_reports, admin_Stock,]
  };
} else if (employeeLoggedIn) {
  menuItems = {
    items: [emp_dashboard, emp_leads, emp_cust, emp_product]
  };
}

export default menuItems;
