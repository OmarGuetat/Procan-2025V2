import { INavData } from '@coreui/angular';

export const adminNavItems: INavData[] = [
  {
    name: 'Home',
    url: '/admin/home',
    icon: 'bi-house'
  },
  {
    title: true,
    name: 'Users Management'
  },
  {
    name: 'Users Dashboard',
    url: '/admin/users-dashboard',
    icon: 'bi-people'
  },
  {
    title: true,
    name: 'Leave Management'
  },
  {
    name: 'Leave Management',
    icon: 'bi-calendar',
    children: [
      {
        name: 'Leave Dashboard',
        url: '/admin/leave-dashboard',
        icon: 'bi-calendar-check'
      },
      {
        name: 'Leave Settings',
        icon: 'bi-gear',
        children: [
          {
            name: 'Leave Balances',
            url: '/admin/leave-balance',
            icon: 'bi-table'
          },
          {
            name: 'Public Holidays',
            url: '/admin/manage-holidays',
            icon: 'bi-calendar-plus'
          }
        ]
      }
    ]
  },
  {
    title: true,
    name: 'Invoices Management'
  },
  {
    name: 'Invoices Management',
    icon: 'bi-cash-stack',
    children: [
      {
        name: 'Invoices Dashboard',
        url: '/admin/invoices-dashboard',
        icon: 'bi-file-earmark-text'
      },
      {
        name: 'Create Invoice',
        url: '/admin/invoice-form',
        icon: 'bi-journal-plus'
      },
      {
        name: 'Invoices Settings',
        icon: 'bi-gear',
        children: [
          {
            name: 'Company Settings',
            url: '/admin/company-settings',
            icon: 'bi-building'
          }
        ]
      }
    ]
  }
];

export const employeeNavItems: INavData[] = [
  {
    name: 'Home',
    url: '/employee/home',
    icon: 'bi-house'
  },
  {
    name: 'Leave Form',
    url: '/employee/leave-form',
    icon: 'bi-file-earmark'
  },
  {
    name: 'My Requests',
    url: '/employee/requests-user-dashboard',
    icon: 'bi-list-check'
  }
];


export const accountantNavItems: INavData[] = [
  {
    name: 'Home',
    url: '/accountant/home',
    icon: 'bi-house'
  },
  {
    name: 'Client Management',
    url: '/accountant/client-management',
    icon: 'bi-people'
  },
  {
    name: 'Invoices Dashboard', 
    url: '/accountant/invoices-dashboard',
    icon: 'bi-file-earmark-text'
  }
];


export const hrNavItems: INavData[] = [
  {
    name: 'Home',
    url: '/hr/home',
    icon: 'bi-house'
  },
  {
    title: true,
    name: 'Work Management'
  },
  {
    name: 'Work Management',
    icon: 'bi-people',
    children: [
      {
        name: 'Users Dashboard',
        url: '/hr/users-dashboard',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Leave Dashboard',
        url: '/hr/leave-dashboard',
        icon: 'nav-icon-bullet'
      }
    ]
  },
  {
    title: true,
    name: 'My Leave'
  },
  {
    name: 'My Leave',
    icon: 'bi-calendar',
    children: [
      {
        name: 'Leave Form',
        url: '/hr/leave-form',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'My Requests',
        url: '/hr/requests-user-dashboard',
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
  } else if (userRole === 'accountant') {
    return accountantNavItems;
  } else {
    return []; // No role = no menu
  }
})();
