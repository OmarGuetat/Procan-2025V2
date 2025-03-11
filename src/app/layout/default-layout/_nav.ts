import { INavData } from '@coreui/angular';

// 🔹 Admin Sidebar Navigation
export const adminNavItems: INavData[] = [
  {
    name: 'Admin Home',
    url: '/main/admin-home',
    iconComponent: { name: 'cil-home' }
  },
  {
    name: 'Users Dashboard',
    url: '/main/users-dashboard',
    iconComponent: { name: 'cil-people' }
  },
  {
    name: 'Leave Dashboard',
    url: '/main/leave-dashboard',
    iconComponent: { name: 'cil-spreadsheet' }
  }
];

// 🔹 Employee Sidebar Navigation
export const employeeNavItems: INavData[] = [
  {
    name: 'Employee Home',
    url: '/employee-home',
    iconComponent: { name: 'cil-user' }
  },
  {
    name: 'Leave Form',
    url: '/main/leave-form',
    iconComponent: { name: 'cil-file' }
  },
  {
    name: 'Requests Dashboard',
    url: '/main/requests-user-dashboard',
    iconComponent: { name: 'cil-list' }
  },
  {
    name: 'Profile',
    url: '/main/profile',
    iconComponent: { name: 'cil-user' }
  }
];

// 🔹 HR Sidebar Navigation
export const hrNavItems: INavData[] = [
  {
    name: 'HR Home',
    url: '/hr-home',
    iconComponent: { name: 'cil-briefcase' }
  },
  {
    name: 'Users Dashboard',
    url: '/main/users-dashboard',
    iconComponent: { name: 'cil-people' }
  },
  {
    name: 'Leave Dashboard',
    url: '/main/leave-dashboard',
    iconComponent: { name: 'cil-spreadsheet' }
  },
  {
    name: 'Leave Form',
    url: '/main/leave-form',
    iconComponent: { name: 'cil-file' }
  },
  {
    name: 'Requests Dashboard',
    url: '/main/requests-user-dashboard',
    iconComponent: { name: 'cil-list' }
  },
  {
    name: 'Profile',
    url: '/main/profile',
    iconComponent: { name: 'cil-user' }
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
