import { Component } from '@angular/core';
import { InvoiceService } from '../../../services/invoice.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StepIndicatorComponent } from '../../components/step-indicator/step-indicator.component';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

declare var bootstrap: any;
@Component({
  selector: 'app-invoice-form',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, StepIndicatorComponent],
  templateUrl: './invoice-form.component.html',
  styleUrls: ['./invoice-form.component.scss'],
})
export class InvoiceFormComponent {
  currentStep = 1;
  countries: string[] = ['Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda', 'Argentina', 'Armenia', 'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan', 'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cambodia', 'Cameroon', 'Canada', 'Cape Verde', 'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo', 'Costa Rica', 'Croatia', 'Cuba', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Eswatini', 'Ethiopia', 'Fiji', 'Finland', 'France', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Italy', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Korea (North)', 'Korea (South)', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico', 'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar', 'Namibia', 'Nauru', 'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'North Macedonia', 'Norway', 'Oman', 'Pakistan', 'Palau', 'Palestine', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Qatar', 'Romania', 'Russia', 'Rwanda', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines', 'Samoa', 'San Marino', 'Sao Tome and Principe', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Sweden', 'Switzerland', 'Syria', 'Tajikistan', 'Tanzania', 'Thailand', 'Timor-Leste', 'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Vatican City', 'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe'];
  stepOneData = {
    type: 'facture',
    creation_date: '',
    company_name: '',
    additional_date: '',
    additional_date_type: '',
    number: 'F-',
  };
  stepTwoData = {
    client_type: '',
    name: '',
    civility: '',
    first_name: '',
    last_name: '',
    tva_number_client: '',
    address: '',
    postal_code: '',
    country: '',
    rib_bank: '',
    email: '',
    phone_number: ''
  };
  stepThreeData = {
    services: [
      { name: '', quantity: 0, unit: '', price_ht: 0, tva: 0, total_ht: 0, total_ttc: 0, comment: '' }
    ],
    TTotal_HT: 0,
    TTotal_TVA: 0,
    TTotal_TTC: 0,
    payment_mode: '',
    due_date: '',
    payment_status: 'paid',
    amount_paid: 0,
  };

  alertMessage: string = '';
  alertType: string = '';
  confirmationMessage = '';
  confirmationError = '';
  clients: any[] = [];
  lastSavedInvoiceId: number | null = null;
  isSubmitting: boolean = false;
  isSendingEmail: boolean = false;
  constructor(private invoiceService: InvoiceService, private router: Router,private authService: AuthService) { }
  onTypeChange() {
    this.updateInvoiceNumber();
  }

  onCreationDateChange() {
    this.updateInvoiceNumber();
  }

  updateInvoiceNumber() {
    const prefix = this.stepOneData.type === 'facture' ? 'F-' : 'D-';

    if (!this.stepOneData.creation_date) {
      this.stepOneData.number = prefix;
      return;
    }

    const date = new Date(this.stepOneData.creation_date);
    const yearMonth = `${date.getFullYear()}${('0' + (date.getMonth() + 1)).slice(-2)}`; // YYYYMM

    // Only override if empty or matches default pattern
    if (
      !this.stepOneData.number ||
      this.stepOneData.number.startsWith('F-') ||
      this.stepOneData.number.startsWith('D-')
    ) {
      this.stepOneData.number = `${prefix}${yearMonth}`;
    }
  }
  showAlert(message: string, type: string) {
    this.alertMessage = message;
    this.alertType = type;
  }
  openExistingClientModal() {
    this.invoiceService.getAllClients().subscribe({
      next: (res: any) => {
        console.log(res);
        this.clients = res;
        const modal = new bootstrap.Modal(document.getElementById('existingClientModal')!);
        modal.show();
      },
      error: (err) => {
        console.error('Error loading clients', err);
      }
    });
  }
  selectClient(client: any) {
    this.invoiceService.getClientById(client.id).subscribe({
      next: (res: any) => {
        console.log(res)
        this.stepTwoData = {
          ...this.stepTwoData,
          name: res.data.name,
          client_type: res.data.client_type || '',
          tva_number_client: res.data.tva_number_client,
          address: res.data.address,
          postal_code: res.data.postal_code,
          country: res.data.country,
          rib_bank: res.data.rib_bank,
          email: res.data.email,
          phone_number: res.data.phone_number,
          civility: res.data.civility || '',
          first_name: res.data.first_name || '',
          last_name: res.data.last_name || '',
        };

        const modal = bootstrap.Modal.getInstance(document.getElementById('existingClientModal')!);
        modal?.hide();
      },
      error: (err) => {
        console.error('Failed to fetch client by ID', err);
      }
    });
  }
  goBack() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }
  goToStep(step: number) {
    this.currentStep = step;
  }
  onSubmitStepOne() {
    this.invoiceService.stepOne(this.stepOneData).subscribe(
      (response) => {
        console.log('Step 1 Response:', response);
        this.currentStep = 2;
      },
      (error) => {
        console.error('Error in Step 1:', error);
      }
    );
  }

  onSubmitStepTwo() {
    this.invoiceService.stepTwo(this.stepTwoData).subscribe(
      (response) => {
        console.log('Step 2 Response:', response);
        this.currentStep = 3;
      },
      (error) => {
        console.error('Error in Step 2:', error);
      }
    );
  }
  onSubmitStepThree() {
    if (this.isSubmitting) return; // Block if already submitting

    const hasNegative = this.stepThreeData.services.some(service =>
      service.quantity < 0 || service.price_ht < 0 || service.tva < 0
    );
    const isServiceValid = this.stepThreeData.services.some(service =>
      service.name && service.quantity !== null && service.price_ht !== null
    );

    if (!isServiceValid) {
      this.showAlert('Please fill in at least one valid service.', 'alert-danger');
      setTimeout(() => {
        this.dismissAlert();
      }, 2000);
      return;
    }

    if (hasNegative || (this.stepThreeData.amount_paid < 0)) {
      this.showAlert('Values cannot be negative.', 'alert-danger');
      setTimeout(() => {
        this.dismissAlert();
      }, 2000);
      return;
    }

    this.updateCalculations();

    this.isSubmitting = true;

    this.invoiceService.stepThree(this.stepThreeData).subscribe({
      next: (response) => {
        this.currentStep = 4;
      },
      error: (error) => {
        console.error('Error in Step 3:', error);
      }
    });
  }

  removeService(index: number) {
    this.stepThreeData.services.splice(index, 1);
    this.updateCalculations();
  }
  updateCalculations() {
    let totalHT = 0;
    let totalTVA = 0;
    let totalTTC = 0;

    this.stepThreeData.services.forEach(service => {
      service.total_ht = service.quantity * service.price_ht;
      const serviceTVA = (service.total_ht * service.tva) / 100;
      service.total_ttc = service.total_ht + serviceTVA;

      totalHT += service.total_ht;
      totalTVA += serviceTVA;
      totalTTC += service.total_ttc;
    });

    this.stepThreeData.TTotal_HT = totalHT;
    this.stepThreeData.TTotal_TVA = totalTVA;
    this.stepThreeData.TTotal_TTC = totalTTC;

    // Auto-fill if paid
    if (this.stepThreeData.payment_status === 'paid') {
      this.stepThreeData.amount_paid = totalTTC;
    } else if (this.stepThreeData.payment_status === 'unpaid') {
      this.stepThreeData.amount_paid = 0;
    }
  }

  dismissAlert() {
    this.alertMessage = '';
  }
  confirmInvoice() {
    this.isSubmitting = true;  
    const invoiceData = {
      step1: this.stepOneData,
      step2: this.stepTwoData,
      step3: this.stepThreeData
    };
    console.log(invoiceData);
    this.invoiceService.confirm(invoiceData).subscribe({
      next: (res: any) => {
        console.log(res);
        this.alertMessage = res.message || 'Invoice created successfully!';
        this.alertType = 'alert-success';
        this.confirmationMessage = res.message;
        this.lastSavedInvoiceId = res.invoice_id;
        this.currentStep = 5;
        setTimeout(() => {
          this.dismissAlert();
        }, 500);
        this.isSubmitting = false; 
      },
      error: (err) => {
        this.alertMessage = err?.error?.error || 'An error occurred.';
        this.alertType = 'alert-danger';
        this.isSubmitting = false; 
      }
    });
  }
  addService() {
    this.stepThreeData.services.push({
      name: '',
      quantity: 0,
      unit: 'hours',
      price_ht: 0,
      tva: 0,
      total_ht: 0,
      total_ttc: 0,
      comment: ''
    });
  }


  goToDashboard() {
    const role = this.authService.getRole();
    this.router.navigate([`/${role}/invoices-dashboard`]);
  }


  printInvoice(): void {
    if (this.lastSavedInvoiceId !== null) {
      this.invoiceService.downloadInvoicePdf(this.lastSavedInvoiceId).subscribe({
        next: (blob: Blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `invoice_${this.lastSavedInvoiceId}.pdf`;
          a.click();
          window.URL.revokeObjectURL(url);
        },
        error: (err) => {
          console.error('Error downloading PDF:', err);
          this.alertMessage = err?.error?.error || 'Error downloading PDF!';
          this.alertType = 'alert-danger';
          setTimeout(() => {
            this.dismissAlert();
          }, 3000);
        }

      });
    }
  }


  sendInvoiceEmail() {
  if (this.isSendingEmail) return; // Prevent multiple clicks

  this.isSendingEmail = true;

  this.invoiceService.sendInvoiceEmail(this.lastSavedInvoiceId!).subscribe({
    next: (res) => {
      this.alertMessage = res.message || 'Invoice sent to client successfully!';
      this.alertType = 'alert-success';
      setTimeout(() => {
        this.dismissAlert();
      }, 1000);
      this.isSendingEmail = false;  // Allow sending again after success
    },
    error: (err) => {
      console.error('Error sending invoice:', err);
      this.alertMessage = err?.error?.error || 'Failed To Send Email!';
      this.alertType = 'alert-danger';
      setTimeout(() => {
        this.dismissAlert();
      }, 3000);
      this.isSendingEmail = false;  // Allow sending again after error
    }
  });
}

}