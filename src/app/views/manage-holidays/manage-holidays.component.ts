import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PublicHolidayService } from '../../services/public-holidays.service';
import { CommonModule } from '@angular/common';

interface PublicHoliday {
  id?: number;
  name: string;
  start_date: string;
  end_date: string;
}

@Component({
  selector: 'app-manage-holidays',
  imports:[ReactiveFormsModule,CommonModule],
  templateUrl: './manage-holidays.component.html',
  styleUrls: ['./manage-holidays.component.scss']
})
export class ManageHolidaysComponent implements OnInit {
  holidays: PublicHoliday[] = [];
  holidayForm: FormGroup;
  isEditing = false;
  selectedHolidayId?: number;
  dateInvalid = false;

  currentPage = 1;
  totalPages = 1;

  constructor(
    private holidayService: PublicHolidayService,
    private fb: FormBuilder
  ) {
    this.holidayForm = this.fb.group({
      name: ['', Validators.required],
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadHolidays();
  }

  loadHolidays(page: number = 1): void {
    this.holidayService.getHolidays(page).subscribe(response => {
      this.holidays = response.data;
      this.currentPage = response.meta.current_page;
      this.totalPages = response.meta.total_pages;
    });
  }

  goToPreviousPage(): void {
    if (this.currentPage > 1) {
      this.loadHolidays(this.currentPage - 1);
    }
  }

  goToNextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.loadHolidays(this.currentPage + 1);
    }
  }

  formatDate(date: string): string {
    return `${date} 08:00:00`;
  }

  checkDateValidity(): void {
    const startDate = this.holidayForm.value.start_date;
    const endDate = this.holidayForm.value.end_date;
    if (startDate && endDate) {
      this.dateInvalid = new Date(endDate) < new Date(startDate);
    } else {
      this.dateInvalid = false;
    }
  }

  addHoliday(): void {
    if (this.holidayForm.invalid) return;

    const holiday: PublicHoliday = {
      name: this.holidayForm.value.name,
      start_date: this.formatDate(this.holidayForm.value.start_date),
      end_date: this.formatDate(this.holidayForm.value.end_date),
    };

    if (this.isEditing) {
      this.holidayService.updateHoliday(this.selectedHolidayId!, holiday).subscribe(() => {
        this.resetForm();
        this.loadHolidays(this.currentPage);
      });
    } else {
      this.holidayService.addHoliday(holiday).subscribe(() => {
        this.resetForm();
        this.loadHolidays(this.currentPage);
      });
    }
  }

  editHoliday(holiday: PublicHoliday): void {
    this.isEditing = true;
    this.selectedHolidayId = holiday.id;
    this.holidayForm.patchValue({
      name: holiday.name,
      start_date: holiday.start_date.split(' ')[0],
      end_date: holiday.end_date.split(' ')[0]
    });
  }

  openDeleteModal(holidayId: number) {
    this.selectedHolidayId = holidayId;
    const modalElement = document.getElementById('deleteModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  confirmDelete() {
    if (this.selectedHolidayId !== null) {
      this.holidayService.deleteHoliday(this.selectedHolidayId!).subscribe(() => {
        this.loadHolidays(this.currentPage);
      });
    }
  }

  resetForm(): void {
    this.isEditing = false;
    this.selectedHolidayId = undefined;
    this.holidayForm.reset();
  }
}
