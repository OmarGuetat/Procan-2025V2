import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReplaceUnderscoreCapitalizePipe } from './pipes/replace-underscore-capitalize.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [CommonModule,ReplaceUnderscoreCapitalizePipe,FormsModule,ReactiveFormsModule],
  exports: [
    ReplaceUnderscoreCapitalizePipe,
    CommonModule,FormsModule,ReactiveFormsModule
  ]
})
export class SharedModule {}
