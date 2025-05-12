import { Component } from '@angular/core';
import { PaymentStatusChartComponent } from '../../components/charts-stats/payment-status-chart/payment-status-chart.component';
import { InvoiceTypeChartComponent } from '../../components/charts-stats/invoice-type-chart/invoice-type-chart.component';
import { PaymentModeChartComponent } from '../../components/charts-stats/payment-mode-chart/payment-mode-chart.component';
@Component({
  selector: 'app-accountant-home',
  standalone: true,
  imports: [PaymentStatusChartComponent,InvoiceTypeChartComponent,PaymentModeChartComponent],
  templateUrl: './accountant-home.component.html',
  styleUrl: './accountant-home.component.scss'
})
export class AccountantHomeComponent {

}
