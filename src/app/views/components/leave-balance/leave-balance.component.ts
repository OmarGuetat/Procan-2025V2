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
  leaveBalances: any[] = [];
  leaveBalance = {
    leave_type: '',
    max_days: 0
  };

  constructor(private leaveBalanceService: LeaveBalanceService) {}

  ngOnInit(): void {
    this.fetchLeaveBalances();
  }

  fetchLeaveBalances() {
    this.leaveBalanceService.getLeaveBalances().subscribe({
      next: (data) => (this.leaveBalances = data),
      error: (err) => console.error('Error fetching leave balances:', err),
    });
  }

  addLeaveBalance() {
    this.leaveBalanceService.addLeaveBalance(this.leaveBalance).subscribe({
      next: () => {
        this.fetchLeaveBalances();
        this.leaveBalance = { leave_type: '', max_days: 0 }; // Reset form
      },
      error: (err) => console.error('Error adding leave balance:', err),
    });
  }

  updateLeaveBalance(leave: any) {
    this.leaveBalanceService.updateLeaveBalance(leave.id, { max_days: leave.max_days }).subscribe({
      next: () => console.log('Leave updated'),
      error: (err) => console.error('Error updating leave:', err),
    });
  }

  deleteLeaveBalance(id: number) {
    this.leaveBalanceService.deleteLeaveBalance(id).subscribe({
      next: () => this.fetchLeaveBalances(),
      error: (err) => console.error('Error deleting leave:', err),
    });
  }
}
