import { Component } from '@angular/core';
import { FormBuilder, FormGroup,  ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CardModule, GridModule, ModalModule } from '@coreui/angular';
import { CompanyService } from '../../../../services/company.service';

@Component({
  selector: 'app-company-settings',
  standalone: true,
  imports: [CommonModule, GridModule, CardModule, ModalModule,ReactiveFormsModule],
  templateUrl: './company-settings.component.html'
})
export class CompanySettingsComponent {
  searchForm: FormGroup;
  companyForm: FormGroup;
  company: any = null;
  isModalOpen = false;
  isEditMode = false;
  alertMessage: string = '';
  alertType: string = '';
  companyOptions = [
    { label: 'Procan', value: 'procan' },
    { label: 'Adequate', value: 'adequate' }
  ];
  companyFields = [
    { controlName: 'name', label: 'Name', placeholder: 'Company name' },
    { controlName: 'phone_number', label: 'Phone Number', placeholder: 'Phone number' },
    { controlName: 'address', label: 'Address', placeholder: 'Company address' },
    { controlName: 'postal_code', label: 'Postal Code', placeholder: 'Postal code' },
    { controlName: 'country', label: 'Country', placeholder: 'Country (France or Tunisia)' },
    { controlName: 'tva_number', label: 'TVA Number', placeholder: 'TVA number' },
    { controlName: 'rib_bank', label: 'RIB Bank', placeholder: 'Bank RIB' },
    { controlName: 'email', label: 'Email', placeholder: 'Email address', type: 'email' },
    { controlName: 'website', label: 'Website', placeholder: 'https://...' },
   
  ];
  getIcon(controlName: string): string {
    const icons: { [key: string]: string } = {
      name: 'bi bi-building',
      phone_number: 'bi bi-telephone',
      address: 'bi bi-geo-alt',
      postal_code: 'bi bi-mailbox',
      country: 'bi bi-globe',
      tva_number: 'bi bi-receipt',
      rib_bank: 'bi bi-bank',
      email: 'bi bi-envelope',
      website: 'bi bi-link-45deg',
    };
    return icons[controlName] || 'bi bi-input-cursor';
  }
  dismissAlert() {
    this.alertMessage = '';
  }
  constructor(private fb: FormBuilder, private companyService: CompanyService) {
    this.searchForm = this.fb.group({
      name: ['', Validators.required]
    });

    this.companyForm = this.fb.group({
      name: [{ value: '', disabled: true }, Validators.required],
      phone_number: ['', [Validators.required, Validators.pattern(/^\d+$/)]], // Only numbers
      address: ['', Validators.required],
      postal_code: [''], // Not required
      country: [{ value: '', disabled: true }, Validators.required],
      tva_number: ['', [Validators.required, Validators.min(1), Validators.max(99)]],
      rib_bank: ['', [Validators.required, Validators.pattern(/^\d+$/)]], // Only numbers
      email: ['', [Validators.required, Validators.email]],
      website: [
        '',
        Validators.pattern(/^(https?:\/\/)([\w-]+\.)+[\w-]{2,}(\/\S*)?$/)
      ],
    });
    
    
  }

  onSearch() {
    const name = this.searchForm.get('name')?.value;
    if (!name) return;
    console.log(name)
    this.companyService.getByName(name).subscribe({
      next: (res) => {
        this.company = res;
        this.isEditMode = !!res.id;
      },
      error: (err) => {
        if (err.error) {
          const errors = err.error; 
          const firstErrorKey = Object.keys(errors)[0]; 
        this.alertMessage = errors[firstErrorKey][0]; 
        } else {
          this.alertMessage = 'Company not found.';
        }
        this.alertType = 'alert-danger';
      }
    });
  }

  openUpdateModal() {
    if (this.company) {
      this.companyForm.patchValue(this.company);
      this.isEditMode = !!this.company.id;
      this.isModalOpen = true;
    }
  }

  onSubmit() {
    if (this.companyForm.invalid) return;

    const formData = this.companyForm.value;

    const request$ = this.isEditMode
      ? this.companyService.updateCompany(this.company.id, formData)
      : this.companyService.createCompany(formData);

    request$.subscribe({
      next: (res) => {
        this.alertMessage = res.message || 'Company updated successfully!';
        this.alertType = 'alert-success';

        setTimeout(() => {
          this.dismissAlert();
          location.reload();
        }, 500);
      },
      error: (error) => {
        if (error.error) {
          const errors = error.error; 
          const firstErrorKey = Object.keys(errors)[0]; 
        this.alertMessage = errors[firstErrorKey][0]; 
        } else {
          this.alertMessage = 'Error updating company';
        }
        this.alertType = 'alert-danger';
      }
    });
  }
}
