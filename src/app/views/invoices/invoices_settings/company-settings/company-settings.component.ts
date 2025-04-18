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
  dismissAlert() {
    this.alertMessage = '';
  }
  constructor(private fb: FormBuilder, private companyService: CompanyService) {
    this.searchForm = this.fb.group({
      name: [ '', Validators.required]
    });

    this.companyForm = this.fb.group({
      name: [{ value: ''}], 
      phone_number: [
        {value:''},
        [
          Validators.maxLength(15),
          Validators.required
        ]
      ],
      address: [ {value:''},Validators.required], 
      postal_code: [ {value:''},Validators.required], 
      country: [{ value: ''}, Validators.required],
      tva_number: [
        {value:''},
        [Validators.min(0), Validators.max(100)] 
      ],
      rib_bank: [
        {value:''},
        Validators.pattern(/^\d*$/) 
      ],
      email: [ {value:''}, Validators.email], 
      website: [
        {value:''},
        Validators.pattern(/^(https?:\/\/)([\w-]+\.)+[\w-]{2,}(\/\S*)?$/)
      ] 
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
      error: (error) => {
        if (error && error.error) {
            const errors = error.error.errors; 
            const firstErrorKey = Object.keys(errors)[0]; 
            this.alertMessage = errors[firstErrorKey][0]; 
        } else {
            this.alertMessage = 'Company not found';
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
        if (error && error.error) {
            const errors = error.error.errors; 
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
