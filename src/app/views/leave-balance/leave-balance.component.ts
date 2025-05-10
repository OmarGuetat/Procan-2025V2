import { Component, OnInit } from '@angular/core';
import { LeaveBalanceService } from '../../services/leave-balance.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SkeletonTableCardComponent } from '../components/Skeletons/skeleton-table-card/skeleton-table-card.component';



@Component({
  selector: 'app-leave-balance',
  imports:[ReactiveFormsModule,CommonModule,FormsModule,SkeletonTableCardComponent],
  templateUrl: './leave-balance.component.html',
  styleUrls: ['./leave-balance.component.scss'],
})
export class LeaveBalanceComponent implements OnInit {
  leaveBalances = [
    { leave_type: 'paternity_leave', max_days: 0, id: null },
    { leave_type: 'maternity_leave', max_days: 0, id: null },
    { leave_type: 'sick_leave', max_days: 0, id: null }
  ];
  isLoading = true;
  constructor(private leaveBalanceService: LeaveBalanceService) {}

  ngOnInit(): void {
    this.getLeaveBalances();
  }
  getLeaveIconClass(type: string): string {
    const iconMap: { [key: string]: string } = {
      paternity_leave: 'bi-person-badge',
      maternity_leave: 'bi-person-heart',
      sick_leave: 'bi-thermometer'
    };
    return iconMap[type] || 'bi-question-circle';
  }
  
  getLeaveBalances(): void {
    this.isLoading = true;
    this.leaveBalanceService.getLeaveBalances().subscribe(
      (data) => {
        console.log(data)
        // Merge received data with default leave types
        this.leaveBalances = this.leaveBalances.map((defaultLeave) => {
          const existingLeave = data.find((l: any) => l.leave_type === defaultLeave.leave_type);
  
          if (existingLeave) {
            return {
              ...existingLeave,
              max_days: existingLeave.leave_type === 'maternity_leave'
                ? existingLeave.max_days / 30
                : existingLeave.max_days
            };
          }
          return defaultLeave;
        });
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching leave balances:', error) ;
        this.isLoading = true;}
    );
  }
  updateLeaveBalance(leave: any): void {
    if (!leave.id ) return;
  
    const adjustedLeave = {
      max_days: leave.leave_type === 'maternity_leave' ? leave.max_days * 30 : leave.max_days
    };
    
    this.leaveBalanceService.updateLeaveBalance(leave.id, adjustedLeave)
      .subscribe(
        () => this.getLeaveBalances(),
        (error) => console.error('Error updating leave:', error)
      );
  }
  
  addLeaveBalance(leave: any): void {
    const adjustedLeave = {
      leave_type: leave.leave_type,
      max_days: leave.leave_type === 'maternity_leave' ? leave.max_days * 30 : leave.max_days
    };
  
    this.leaveBalanceService.addLeaveBalance(adjustedLeave)
      .subscribe(
        () => this.getLeaveBalances(),
        (error) => console.error('Error adding leave:', error)
      );
  }  
  formatLeaveType(leaveType: string): string {
    // Replace underscores with spaces and capitalize each word
    return leaveType
      .replace(/_/g, ' ') // Replace underscores with spaces
      .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize each word
  }
}