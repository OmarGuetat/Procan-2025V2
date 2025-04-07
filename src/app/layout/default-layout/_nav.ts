import { INavData } from '@coreui/angular';

export const adminNavItems: INavData[] = [
  {
    name: 'Home',
    url: '/main/admin-home',
    iconComponent: { name: 'cil-home' }
  },
  {
    name: 'Leave Management',
    url: '',
    iconComponent: { name: 'cil-calendar' },
    children: [
      {
        name: 'Users Dashboard',
        url: '/main/users-dashboard',
        iconComponent: { name: 'cil-people' }
      },
      {
        name: 'Leave Dashboard',
        url: '/main/leave-dashboard',
        icon: 'bi-calendar-check' 
      },
      {
        name: 'Leave Settings',
        url: '',
        iconComponent: { name: 'cil-settings' },
        children: [
          {
            name: 'Leave Balances',
            url: '/main/leave-balance',
            iconComponent: { name: 'cil-spreadsheet' }
          },
          {
            name: 'Public Holidays',
            url: '/main/manage-holidays',
            icon: 'bi-calendar-plus'
          }
          
        ]
      }
    ]
  },
  {
    name: 'Invoices Management',
    url: '',
    iconComponent: { name: 'cil-dollar' },
    children: [
      {
        name: 'Invoices Dashboard',
        url: '/main/invoices-dashboard',
        iconComponent: { name: 'cil-file' }
      },
      {
        name: 'Invoices Settings',
        url: '',
        iconComponent: { name: 'cil-settings' },
        children: [
          {
            name: 'company settings',
            url: '/main/company-settings',
            iconComponent: { name: 'cil-spreadsheet' }
          }
          
        ]
      }
    ]
  }
];


// 🔹 Employee Sidebar Navigation
export const employeeNavItems: INavData[] = [
  {
    name: 'Home',
    url: '/main/employee-home',
    iconComponent: { name: 'cil-home' }
  },
  {
    name: 'Leave Form',
    url: '/main/leave-form',
    iconComponent: { name: 'cil-file' }
  },
  {
    name: 'My Requests',
    url: '/main/requests-user-dashboard',
    iconComponent: { name: 'cil-list' }
  }
];

export const hrNavItems: INavData[] = [
  {
    name: 'Home',
    url: '/main/hr-home',
    iconComponent: { name: 'cil-home' }
  },
  {
    name: 'Work Management',
    url: '',
    iconComponent: { name: 'cil-people' },
    children: [
      {
        name: 'Users Dashboard',
        url: '/main/users-dashboard',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Leave Dashboard',
        url: '/main/leave-dashboard',
        icon: 'nav-icon-bullet'
      }
    ]
  },
  {
    name: 'My Leave',
    url: '',
    iconComponent: { name: 'cil-calendar' },
    children: [
      {
        name: 'Leave Form',
        url: '/main/leave-form',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'My Requests',
        url: '/main/requests-user-dashboard',
        icon: 'nav-icon-bullet'
      }
    ]
  }
];


// 🔹 Auto-Select Navigation Based on User Role
export const navItems: INavData[] = (() => {
  const userRole = localStorage.getItem('role');

  if (userRole === 'admin') {
    return adminNavItems;
  } else if (userRole === 'employee') {
    return employeeNavItems;
  } else if (userRole === 'hr') {
    return hrNavItems;
  } else {
    return []; // If no role, return an empty menu
  }
})();
