import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-skeleton-table-card',
  imports:[CommonModule],
  templateUrl: './skeleton-table-card.component.html',
  styleUrls: ['./skeleton-table-card.component.scss']
})
export class SkeletonTableCardComponent {
  @Input() title: string = 'Loading...';
  @Input() icon: string = 'bi-table';
  @Input() cols: number = 3;
  @Input() rows: number = 3;

  getColumns(): any[] {
    return Array(this.cols);
  }

  getRows(): any[] {
    return Array(this.rows);
  }
}
