import { Component } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ListComponent } from '../../components/list-component/list-component.component';

@Component({
  selector: 'app-leave-dashboard',
  imports: [ListComponent, FormsModule,CommonModule],
  templateUrl: './leave-dashboard.component.html',
  styleUrls: ['./leave-dashboard.component.css']
})
export class LeaveDashboardComponent {
  searchQuery: string = ''; 
  selectedUserIdChange: number | null = null;
  selectedRequestsUserIdChange: number | null = null;
  
  searchEmployees(): void {
   
  }
  onUserSelected(userId: number | null): void {
    this.selectedUserIdChange = userId;
    this.selectedRequestsUserIdChange = null; 
  }
  onRequestsUserSelected(userId: number | null): void {
    this.selectedRequestsUserIdChange = userId;
    this.selectedUserIdChange = null; 
  }
}
