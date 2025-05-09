import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LeaveService } from '../../services/leave.service'; 
import { CommonModule } from '@angular/common';
import { RequestCardComponent } from '../cards/request-card/request-card.component';
import { RequestCardSkeletonComponent } from '../cards/request-card-skeleton/request-card-skeleton.component';
@Component({
  selector: 'app-leave-decision-details',
  imports: [CommonModule, RequestCardComponent,RequestCardSkeletonComponent],
  templateUrl: './leave-decision-details.component.html',
  styleUrls: ['./leave-decision-details.component.scss']
})
export class LeaveDecisionDetailsComponent implements OnInit {
  leaveId!: number;
  leave: any = null;
  alertMessage = '';
  alertType = '';
  errorMessage: string | null = null;
  isLoading = false;
  isUpdating = false;
  
  constructor(
    private route: ActivatedRoute,
    private leaveService: LeaveService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.leaveId = +params['id'];
      this.loadLeaveDetails();
    });
  }

  dismissAlert(): void {
    this.alertMessage = '';
  }
  loadLeaveDetails(): void {
    this.isLoading = true;
    this.leaveService.getLeaveDetail(this.leaveId).subscribe({
      next: (res) => {
        this.leave = res.leave;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Failed to load leave details.';
        this.isLoading = false;
      }
    });
  }
  
  updateStatus(status: 'approved' | 'rejected'): void {
    this.isUpdating = true;
    this.leaveService.updateLeaveStatus(this.leaveId, status).subscribe({
      next: (res) => {
        this.leave.status = status;
        this.alertMessage = res.message || 'Status updated.';
        this.alertType = 'alert-success';
        this.isUpdating = false;
        setTimeout(() => this.dismissAlert(), 2000);
      },
      error: (err) => {
        this.alertMessage = err.error.error || 'Failed to update status.';
        this.alertType = 'alert-danger';
        this.isUpdating = false;
        setTimeout(() => this.dismissAlert(), 2000);
      }
    });
  }
  
 
}
