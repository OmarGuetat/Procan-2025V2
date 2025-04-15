import { Component } from '@angular/core';
import { InvoiceService } from '../../../services/invoice.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-invoice-form',
  imports:[CommonModule,ReactiveFormsModule,FormsModule],
  templateUrl: './invoice-form.component.html',
  styleUrls: ['./invoice-form.component.css'],
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
      { name: '', quantity: 0, unit: 'hours', price_ht: 0, tva: 0, total_ht: 0, total_ttc: 0, comment: '' }
    ],
    TTotal_HT: 0,
    TTotal_TVA: 0,
    TTotal_TTC: 0,
  };
  confirmationMessage = '';
  confirmationError = '';
  
 

  constructor(private invoiceService: InvoiceService) {}

  
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
        this.currentStep = 3;0
      },
      (error) => {
        console.error('Error in Step 2:', error);
      }
    );
  }

  onSubmitStepThree() {
    this.updateCalculations();

    this.invoiceService.stepThree(this.stepThreeData).subscribe(
      (response) => {
        console.log('Step 3 Response:', response);
        this.currentStep = 4;
        
      },
      (error) => {
        console.error('Error in Step 3:', error);
      }
    );
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
  }
  
confirmInvoice() {
  this.invoiceService.confirm().subscribe({
    next: (res: any) => {
      this.confirmationMessage = res.message;
      this.confirmationError = '';
      this.currentStep = 5; // or reset/redirect if needed
    },
    error: (err) => {
      this.confirmationError = err?.error?.error || 'An unexpected error occurred.';
      this.confirmationMessage = '';
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
  

 
}