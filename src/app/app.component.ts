import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  recordForm: FormGroup;
  records: any[] = [];
  totalAmount: number = 0;
  searchTerm: string = '';
constructor(private fb: FormBuilder) {
    this.recordForm = this.fb.group({
        name: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]],
        amount: ['', [Validators.required, Validators.pattern('^[0-9]*$')]]
    });
}

  onSubmit() {
    if (this.recordForm.valid) {
      const emailExists = this.records.some(record => record.email === this.recordForm.value.email);
      if (!emailExists) {
        this.recordForm.value.amount = parseFloat(this.recordForm.value.amount).toFixed(2);
        this.records.push(this.recordForm.value);
        this.sortRecords();
        this.calculateTotalAmount();
        this.recordForm.reset();
      } else {
        alert('Email address already exists!');
      }
    }
  }

  sortRecords() {
    this.records.sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount));
  }

  calculateTotalAmount() {
    this.totalAmount = this.records.reduce((sum, record) => sum + parseFloat(record.amount), 0).toFixed(2);
  }

  deleteRecord(index: number) {
    this.records.splice(index, 1);
    this.calculateTotalAmount();
  }

  get filteredRecords() {
    return this.records.filter(record => 
      record.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      record.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      record.phone.includes(this.searchTerm) ||
      record.amount.includes(this.searchTerm)
    );
  }
}
