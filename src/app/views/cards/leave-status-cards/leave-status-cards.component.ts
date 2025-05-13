import { Component, OnInit } from '@angular/core';
import { AdminHrHomeService } from '../../../services/admin-hr-home.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-leave-status-cards',
  imports:[CommonModule],
  styleUrl: './leave-status-cards.scss',
  templateUrl: './leave-status-cards.component.html',
})
export class LeaveStatusCardsComponent implements OnInit {
  approved = 0;
  rejected = 0;
  onHold = 0;
  loading = true;

  constructor(private dashboardService: AdminHrHomeService) {}

  ngOnInit(): void {
    this.fetchCounts();
  }

  fetchCounts() {
    this.loading = true;
    this.dashboardService.getApprovedLeavesThisMonth().subscribe(res => {
      this.approved = res.approved_this_month;
    });

    this.dashboardService.getRejectedLeavesThisMonth().subscribe(res => {
      this.rejected = res.rejected_this_month;
    });

    this.dashboardService.getOnHoldLeavesThisMonth().subscribe(res => {
      this.onHold = res.on_hold_this_month;
      this.loading = false;
    });
  }
}
