import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { Component, computed, inject, input, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import {
  AvatarComponent,
  BadgeComponent,
  BreadcrumbRouterComponent,
  ColorModeService,
  ContainerComponent,
  DropdownComponent,
  DropdownDividerDirective,
  DropdownHeaderDirective,
  DropdownItemDirective,
  DropdownMenuDirective,
  DropdownToggleDirective,
  HeaderComponent,
  HeaderNavComponent,
  HeaderTogglerDirective,
  NavItemComponent,
  NavLinkDirective,
  SidebarToggleDirective
} from '@coreui/angular';

import { IconDirective } from '@coreui/icons-angular';
import { AuthService } from '../../../services/auth.service';
import { EmployeeService } from '../../../services/employee-service.service';


@Component({
    selector: 'app-default-header',
    templateUrl: './default-header.component.html',
    imports: [ContainerComponent, HeaderTogglerDirective,CommonModule, SidebarToggleDirective, IconDirective, HeaderNavComponent, NavItemComponent, NavLinkDirective, RouterLink, RouterLinkActive, NgTemplateOutlet, BreadcrumbRouterComponent, DropdownComponent, DropdownToggleDirective, AvatarComponent, DropdownMenuDirective, DropdownHeaderDirective, DropdownItemDirective, BadgeComponent, DropdownDividerDirective]
})
export class DefaultHeaderComponent extends HeaderComponent implements OnInit  {
  avatarPath: string = '';
  fullName: string = 'User';
  isAdmin: boolean = false;
  ngOnInit(): void {
    this.loadUserData();
  }

  readonly #colorModeService = inject(ColorModeService);
  readonly colorMode = this.#colorModeService.colorMode;

  readonly colorModes = [
    { name: 'light', text: 'Light', icon: 'cilSun' },
    { name: 'dark', text: 'Dark', icon: 'cilMoon' },
    { name: 'auto', text: 'Auto', icon: 'cilContrast' }
  ];

  readonly icons = computed(() => {
    const currentMode = this.colorMode();
    return this.colorModes.find(mode => mode.name === currentMode)?.icon ?? 'cilSun';
  });

  constructor(private authService: AuthService,private employeeService: EmployeeService) {
    super();
  }

  sidebarId = input('sidebar1');
  loadUserData(): void {
    const role = localStorage.getItem('role');
    if (role !== 'admin') {
      this.employeeService.getData().subscribe(response => {
        this.avatarPath = response.avatar_path || '';
        this.fullName = response.full_name || 'User';
      });
    } else {
      this.fullName = 'Admin';
      this.isAdmin = true;
    }
  }
  logout(): void {
    this.authService.logout();
    localStorage.removeItem('role');
  }
  
}
