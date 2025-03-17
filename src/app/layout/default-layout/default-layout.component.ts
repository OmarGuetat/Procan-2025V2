import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NgScrollbar } from 'ngx-scrollbar';
import { IconDirective } from '@coreui/icons-angular';
import { ContainerComponent, SidebarComponent, SidebarHeaderComponent, SidebarBrandComponent, SidebarNavComponent, SidebarFooterComponent, SidebarToggleDirective, SidebarTogglerDirective, ShadowOnScrollDirective } from '@coreui/angular';
import { DefaultFooterComponent, DefaultHeaderComponent } from './';
import { adminNavItems, employeeNavItems, hrNavItems } from './_nav'; // Import HR navigation items

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss'],
  imports: [
    SidebarComponent,
    SidebarHeaderComponent,
    SidebarBrandComponent,
    SidebarNavComponent,
    SidebarFooterComponent,
    SidebarToggleDirective,
    SidebarTogglerDirective,
    ContainerComponent,
    DefaultFooterComponent,
    DefaultHeaderComponent,
    ShadowOnScrollDirective,
    IconDirective,
    NgScrollbar,
    RouterOutlet,
    RouterLink
  ]
})
export class DefaultLayoutComponent implements OnInit {

  public navItems: any[] = []; // Initialize navItems as an empty array

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Dynamically load nav items based on the user role
    this.navItems = this.getNavItemsBasedOnRole();
  }

  private getNavItemsBasedOnRole() {
    const userRole = this.authService.getRole(); // Get role from UserService

    // Determine which navigation items to load based on role
    if (userRole === 'admin') {
      return adminNavItems; // Admin role
    } else if (userRole === 'employee') {
      return employeeNavItems; // Employee role
    } else if (userRole === 'hr') {
      return hrNavItems; // HR role
    } else {
      return []; // Return empty if no role found
    }
  }
}
