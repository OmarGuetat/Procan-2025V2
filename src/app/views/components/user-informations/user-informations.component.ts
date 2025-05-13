import { Component, OnInit } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { EmployeeHrHomeService } from '../../../services/employee-hr-home.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-informations',
  imports:[CommonModule],
  templateUrl: './user-informations.component.html',
  styleUrls: ['./user-informations.component.scss']
})
export class UserInformationsComponent implements OnInit {
  userInfo: any = {};
  leaveBalances: any[] = [];
  totalRemaining: number = 0;
  lastLeaveAddition: { leave_day_limit: number, date: string } | null = null;
  company: string | null = '';
  today: string = new Date().toLocaleDateString();

  constructor(
    private http: HttpClient,
    private employeeHrHomeService: EmployeeHrHomeService
  ) {}

  ngOnInit(): void {
    this.getUserInfo();
    this.getLeaveBalance();
    this.getLastLeaveAddition();
    this.company = localStorage.getItem('company');
  }

  getUserInfo(): void {
    this.employeeHrHomeService.getAuthenticatedUserInfo().subscribe({
      next: (data) => this.userInfo = data,
      error: (err) => console.error('User info error:', err)
    });
  }

  getLeaveBalance(): void {
    this.employeeHrHomeService.getLeaveBalance().subscribe({
      next: (res) => {
        this.leaveBalances = res.data || [];
        this.totalRemaining = this.leaveBalances.reduce((acc, item) => acc + item.remaining, 0);
      },
      error: (err) => console.error('Leave balance error:', err)
    });
  }

  getLastLeaveAddition(): void {
    this.employeeHrHomeService.getLastLeaveAddition().subscribe({
      next: (res) => {
        this.lastLeaveAddition = res.data;
      },
      error: (err) => console.error('Last leave addition error:', err)
    });
  }
}
