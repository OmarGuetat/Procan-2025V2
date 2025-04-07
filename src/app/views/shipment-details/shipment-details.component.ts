import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdminAccessUserService } from '../../../services/admin-access-user.service'; 
import { CommonModule } from '@angular/common';
import { ExpeditionCardComponent } from '../../components/expedition-card/expedition-card.component';

@Component({
  selector: 'app-shipment-details',
  imports:[CommonModule,ExpeditionCardComponent],
  templateUrl: './shipment-details.component.html',
  styleUrls: ['./shipment-details.component.scss']
})
export class ShipmentDetailsComponent implements OnInit {
  shipmentId!: number; // Declare shipmentId as a number
  shipment: any = null;
  loading: boolean = true;
  alertMessage: string = '';
  alertType: string = '';
  message: string | null = null;
  errorMessage: string | null = null;
  constructor(
    private route: ActivatedRoute,  // ActivatedRoute to fetch route parameters
    private shipmentService: AdminAccessUserService
  ) {}

  ngOnInit(): void {
    // Get shipment ID from route params
    this.route.params.subscribe(params => {
      this.shipmentId = +params['id']; // Extract 'id' from the URL and convert it to a number
      console.log(this.shipmentId);
      this.loadShipmentDetails();
    });
  }

  loadShipmentDetails() {
    if (this.shipmentId) {
      this.shipmentService.getShipmentDetails(this.shipmentId).subscribe(
        (data: any) => {  // Explicitly typing 'data' as 'any'
          this.shipment = data.shipment;
          this.loading = false;
        },
        (error:any) => {
          this.errorMessage = 'Failed to load shipment details.';
          this.loading = false;
        }
      );
    } else {
      this.errorMessage = 'No shipment ID provided.';
      this.loading = false;
    }
  }
  dismissAlert() {
    this.alertMessage = '';
  }

  acceptShipment() {
    this.shipmentService.acceptShipment(this.shipmentId).subscribe(
      response => {
        console.log(response.message); // Show the success message
        this.shipment.admin_status = 'accepté'; // Update local status
        this.alertMessage = response.message || 'azes';
        this.alertType = 'alert-success';

        setTimeout(() => {
          this.dismissAlert();
        }, (2000));
      },
      error => {
        this.alertMessage = error.error.error || 'Failed to accept shipment.';
        this.alertType = 'alert-danger';
        setTimeout(() => {
          this.dismissAlert();
        }, (2000));
      }
    );
  }

  rejectShipment() {
    this.shipmentService.rejectShipment(this.shipmentId).subscribe(
      response => {
        console.log(response.message); // Show the success message
        this.shipment.admin_status = 'refusé'; // Update local status
        this.alertMessage = response.message || 'azes';
        this.alertType = 'alert-success';

        setTimeout(() => {
          this.dismissAlert();
        }, (2000));
      },
      error => {
        this.alertMessage = error.error.error || 'Failed to reject shipment.';
        this.alertType = 'alert-danger';
        setTimeout(() => {
          this.dismissAlert();
        }, (2000));
      }
    );
  }
}
