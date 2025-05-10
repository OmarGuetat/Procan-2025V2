import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ContainerComponent } from '@coreui/angular';
import { AuthService } from '../../services/auth.service';
import { adminSidebarComponent } from './sidebar/sidebar.component';
import { DefaultHeaderComponent } from './default-header/default-header.component';
import { EmployeeHeaderComponent } from './employee-header/employee-header.component';
import { AccountantHeaderComponent } from './accountant-header/accountant-header.component';
import { CommonModule } from '@angular/common';
import { DefaultFooterComponent } from './default-footer/default-footer.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss'],
  imports: [
    adminSidebarComponent,
    EmployeeHeaderComponent,
    AccountantHeaderComponent,
    ContainerComponent,
    RouterOutlet,CommonModule,DefaultFooterComponent
  ]
})
export class DefaultLayoutComponent implements OnInit {
  public userRole: string = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.userRole = this.authService.getRole() ?? 'guest' ;  
  }
}
