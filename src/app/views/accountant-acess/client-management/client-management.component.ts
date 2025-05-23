import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClientService } from '../../../services/client.service';
import { CommonModule } from '@angular/common';
import { SkeletonTableComponent } from '../../components/Skeletons/skeleton-table/skeleton-table.component';

@Component({
  selector: 'app-client-management',
  imports: [CommonModule,FormsModule,ReactiveFormsModule,SkeletonTableComponent],
  templateUrl: './client-management.component.html',
  styleUrl: './client-management.component.scss'
})
export class ClientManagementComponent implements OnInit, OnDestroy {
  clients: any[] = [];
  clientForm: FormGroup;
  isEditMode: boolean = false;
  editClientId: number | null = null; 
  currentPage = 1;
  totalPages = 1;
  pages: number[] = [];
  clientToDeleteId: number | null = null;
  isIndividual: boolean = false;
  searchQuery: string = '';
  currentPlaceholder: string = 'Search by Phone Number';
  private placeholderIndex: number = 0;
  private placeholderInterval: any;
  loading = false;
  countries: string[] = ['Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda', 'Argentina', 'Armenia', 'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan', 'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cambodia', 'Cameroon', 'Canada', 'Cape Verde', 'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo', 'Costa Rica', 'Croatia', 'Cuba', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Eswatini', 'Ethiopia', 'Fiji', 'Finland', 'France', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Italy', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Korea (North)', 'Korea (South)', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico', 'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar', 'Namibia', 'Nauru', 'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'North Macedonia', 'Norway', 'Oman', 'Pakistan', 'Palau', 'Palestine', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Qatar', 'Romania', 'Russia', 'Rwanda', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines', 'Samoa', 'San Marino', 'Sao Tome and Principe', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Sweden', 'Switzerland', 'Syria', 'Tajikistan', 'Tanzania', 'Thailand', 'Timor-Leste', 'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Vatican City', 'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe'];
  constructor(
    private clientService: ClientService,
    private fb: FormBuilder
  ) {
    this.clientForm = this.fb.group({
      client_type: ['', Validators.required],
      civility: [''],
      first_name: [''],
      last_name: [''],
      name: [''],
      tva_number_client: [''],
      address: ['', Validators.required],
      postal_code: ['', Validators.required],
      rib_bank: [''],
      country: ['', Validators.required],
      email: ['', Validators.email],
      phone_number: ['', [Validators.required, Validators.maxLength(15)]],
    });
  }

  ngOnInit(): void {
    this.fetchClients();
    // Change placeholder every second
    this.placeholderInterval = setInterval(() => {
      this.changePlaceholder();
    }, 2500);
  }
  ngOnDestroy(): void {
    // Clear the interval when the component is destroyed to avoid memory leaks
    if (this.placeholderInterval) {
      clearInterval(this.placeholderInterval);
    }
  }
  changePlaceholder(): void {
    const placeholders = [
      'Search by Phone Number',
      'Search by Name',
      'Search by Email'
    ];

    // Cycle through placeholders every 1 second
    this.currentPlaceholder = placeholders[this.placeholderIndex];
    this.placeholderIndex = (this.placeholderIndex + 1) % placeholders.length;
    // Trigger slide effect by removing and adding the show-placeholder class
    const inputElement = document.querySelector('.input-group input') as HTMLInputElement;
    inputElement.classList.remove('show-placeholder'); // Remove class to trigger slide-out

    // Change the placeholder text after a slight delay
    setTimeout(() => {
      this.currentPlaceholder = placeholders[this.placeholderIndex];
      inputElement.classList.add('show-placeholder'); // Add class to trigger slide-in
    }, 300); // Wait for the slide-out to complete before updating the text

    this.placeholderIndex = (this.placeholderIndex + 1) % placeholders.length;

  }
  fetchClients(): void {
    this.loading = true;
  
    let name = '';
    let email = '';
    let phone_number = '';
  
    if (this.searchQuery.includes('@')) {
      email = this.searchQuery;
    } else if (/\d/.test(this.searchQuery)) {
      phone_number = this.searchQuery;
    } else {
      name = this.searchQuery;
    }
  
    this.clientService.getClients(name, email, phone_number, this.currentPage).subscribe({
      next: response => {
        console.log(response);
        this.clients = response.data;
        this.totalPages = response.meta.last_page;
        this.currentPage = response.meta.current_page;
        this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
        this.loading = false;
      },
      error: error => {
        console.error('Error fetching clients:', error);
        this.loading = false;
      }
    });
  }
  
  
  

  openEditClientModal(client: any): void {
    this.isEditMode = true;
    this.editClientId = client.id;
    this.clientForm.patchValue(client);

    const modal = new bootstrap.Modal(document.getElementById('editClientModal') as HTMLElement);
    modal.show();
  }

  resetForm(): void {
    this.clientForm.reset();
    this.isEditMode = false;
    this.editClientId = null;
  }

  changePage(page: number): void {
    this.currentPage = page;
    this.fetchClients();
  }
  
  // Trigger to open the modal
  openAddClientModal(): void {
    this.clientForm.reset();
    const modal = new bootstrap.Modal(document.getElementById('addClientModal') as HTMLElement);
    modal.show();
  }
  updateClient(): void {
    if (this.clientForm.invalid) {
      return;
    }

    if (this.isEditMode && this.editClientId !== null) {
      // Update the client data
      this.clientService.updateClient(this.editClientId, this.clientForm.value).subscribe(() => {
        this.fetchClients();
        const modal = bootstrap.Modal.getInstance(document.getElementById('editClientModal') as HTMLElement);
        modal.hide();
      });
    } else {
      // Add new client logic here if needed
    }
  }
  // Save the client
  saveClient(): void {
    if (this.clientForm.invalid) {
      this.clientForm.markAllAsTouched();
      return;
    }

    if (this.isEditMode && this.editClientId !== null) {
      this.clientService.updateClient(this.editClientId, this.clientForm.value).subscribe(() => {
        this.resetForm();
        this.fetchClients();
      });
    } else {
      this.clientService.addClient(this.clientForm.value).subscribe(() => {
        this.resetForm();
        this.fetchClients();
      });
    }
  }
   // Trigger the delete confirmation modal
   openDeleteConfirmation(clientId: number): void {
    this.clientToDeleteId = clientId;
    const modal = new bootstrap.Modal(document.getElementById('deleteConfirmationModal') as HTMLElement);
    modal.show();
  }

  // Confirm the deletion of the client
  confirmDelete(): void {
    if (this.clientToDeleteId !== null) {
      this.clientService.deleteClient(this.clientToDeleteId).subscribe(() => {
        this.fetchClients();
        const modal = new bootstrap.Modal(document.getElementById('deleteConfirmationModal') as HTMLElement);
        modal.hide();
      });
    }
  }
}