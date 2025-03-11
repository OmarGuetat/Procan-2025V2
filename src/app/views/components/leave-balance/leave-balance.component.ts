import { Component, OnInit } from '@angular/core';
import { LeaveBalanceService } from '../../../services/leave-balance.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-leave-balance',
  imports:[ReactiveFormsModule,CommonModule,FormsModule],
  templateUrl: './leave-balance.component.html',
  styleUrls: ['./leave-balance.component.scss'],
})
export class LeaveBalanceComponent implements OnInit {
  leaveBalances = [
    { leave_type: 'paternity_leave', max_days: 0, id: null },
    { leave_type: 'maternity_leave', max_days: 0, id: null },
    { leave_type: 'sick_leave', max_days: 0, id: null }
  ];

  constructor(private leaveBalanceService: LeaveBalanceService) {}

  ngOnInit(): void {
    this.getLeaveBalances();
  }

  getLeaveBalances(): void {
    this.leaveBalanceService.getLeaveBalances().subscribe(
      (data) => {
        // Merge received data with default leave types
        this.leaveBalances = this.leaveBalances.map((defaultLeave) => {
          const existingLeave = data.find((l: any) => l.leave_type === defaultLeave.leave_type);
          return existingLeave ? existingLeave : defaultLeave;
        });
      },
      (error) => console.error('Error fetching leave balances:', error)
    );
  }

  updateLeaveBalance(leave: any): void {
    if (!leave.id) return;
    
    this.leaveBalanceService.updateLeaveBalance(leave.id, { max_days: leave.max_days })
      .subscribe(
        () => this.getLeaveBalances(),
        (error) => console.error('Error updating leave:', error)
      );
  }

  addLeaveBalance(leave: any): void {
    this.leaveBalanceService.addLeaveBalance({ leave_type: leave.leave_type, max_days: leave.max_days })
      .subscribe(
        () => this.getLeaveBalances(),
        (error) => console.error('Error adding leave:', error)
      );
  }

  formatLeaveType(type: string): string {
    const mapping: any = {
      'paternity_leave': 'Paternity Leave',
      'maternity_leave': 'Maternity Leave',
      'sick_leave': 'Sick Leave'
    };
    return mapping[type] || type;
  }
}