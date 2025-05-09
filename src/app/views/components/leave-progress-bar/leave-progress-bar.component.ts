import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-leave-progress-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './leave-progress-bar.component.html',
  styleUrls: ['./leave-progress-bar.component.scss']
})
export class LeaveProgressBarComponent {
  @Input() used: number = 0;
  @Input() remaining: number = 0;
  @Input() total: number = 0;

  get usedPercentage(): number {
    return this.total ? (this.used / this.total) * 100 : 0;
  }

  get remainingPercentage(): number {
    return this.total ? (this.remaining / this.total) * 100 : 0;
  }
}
