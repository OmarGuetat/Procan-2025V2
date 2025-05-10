import { Component, OnInit } from '@angular/core';
import { ContainerComponent, SidebarComponent, SidebarHeaderComponent, SidebarBrandComponent, SidebarNavComponent, SidebarFooterComponent, SidebarToggleDirective, SidebarTogglerDirective, ShadowOnScrollDirective } from '@coreui/angular';
import { NgScrollbar } from 'ngx-scrollbar';
import {  DefaultFooterComponent, DefaultHeaderComponent } from '../';
import { adminNavItems,hrNavItems } from '../_nav';
import { AuthService } from '../../../services/auth.service';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  imports: [
    SidebarComponent,
    SidebarHeaderComponent,
    SidebarBrandComponent,
    SidebarNavComponent,
    SidebarFooterComponent,
    SidebarToggleDirective,
    SidebarTogglerDirective,
    ContainerComponent,

    DefaultHeaderComponent,
    ShadowOnScrollDirective,
    NgScrollbar,
    RouterOutlet,
    RouterLink,DefaultFooterComponent
  ]
})
export class adminSidebarComponent implements OnInit {

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
    } else if (userRole === 'hr') {
      return hrNavItems; // HR role
    } else {
      return []; // Return empty if no role found
    }
  }
}
