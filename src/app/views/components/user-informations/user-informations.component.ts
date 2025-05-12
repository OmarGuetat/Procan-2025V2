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
  leaveBalance: any = {};
  company: string | null = '';  
  today: string = new Date().toLocaleDateString();

  constructor(
    private http: HttpClient,
    private employeeHrHomeService: EmployeeHrHomeService
  ) {}

  ngOnInit(): void {
    this.getUserInfo();
    this.getLeaveBalance();
    this.company = localStorage.getItem('company');
    console.log(this.company);
  }

  getUserInfo(): void {
    this.employeeHrHomeService.getAuthenticatedUserInfo().subscribe({
      next: (data) => this.userInfo = data,
      error: (err) => console.error('User info error:', err)
    });}

    getLeaveBalance(): void {
      this.employeeHrHomeService.getLeaveBalance().subscribe({
        next: (res) => {
          this.leaveBalance = res.data; // correctly access nested 'data'
        },
        error: (err) => console.error('Leave balance error:', err)
      });
    }
  
}
