import { Component } from '@angular/core';
import { LeaveBalanceComponent } from '../components/leave-balance/leave-balance.component';

@Component({
  selector: 'app-admin-home',
  imports: [LeaveBalanceComponent],
  templateUrl: './admin-home.component.html',
  styleUrl: './admin-home.component.scss'
})
export class AdminHomeComponent {

}
