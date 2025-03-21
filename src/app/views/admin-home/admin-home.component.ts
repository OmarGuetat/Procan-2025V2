import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { LeaveBalanceComponent } from '../leave-balance/leave-balance.component';
import { ManageHolidaysComponent } from '../manage-holidays/manage-holidays.component';

@Component({
  selector: 'app-admin-home',
  imports: [LeaveBalanceComponent,ManageHolidaysComponent],
  templateUrl: './admin-home.component.html',
  styleUrl: './admin-home.component.scss'
})
export class AdminHomeComponent implements AfterViewInit {
  @ViewChild('leftColumn') leftColumn!: ElementRef;
  @ViewChild('rightColumn') rightColumn!: ElementRef;
  ngAfterViewInit() {
    // Adjust the height of the right column after the view is initialized
    this.adjustRightColumnHeight();
  }

  private adjustRightColumnHeight() {
    // Get the height of the left column
    const leftColumnHeight = this.leftColumn.nativeElement.offsetHeight;

    // Set the height of the right column
    this.rightColumn.nativeElement.style.height = `${leftColumnHeight}px`;
  }
}
