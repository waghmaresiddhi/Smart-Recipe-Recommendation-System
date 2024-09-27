// src/app/expenses/expense-form/expense-form.component.ts
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ExpensesService } from '../expenses.service';

@Component({
  selector: 'app-expense-form',
  templateUrl: './expense-form.component.html',
  styleUrls: ['./expense-form.component.css']
})

export class ExpenseFormComponent {
  expenseForm: FormGroup;

  constructor(private fb: FormBuilder, private expensesService: ExpensesService) {
    this.expenseForm = this.fb.group({
      amount: ['', [Validators.required, Validators.min(0)]],
      category: ['', Validators.required],
      date: ['', Validators.required],
      description: ['']
    });
  }

  onSubmit() {
    if (this.expenseForm.valid) {
      this.expensesService.addExpense(this.expenseForm.value).subscribe({
        next: (response) => {
          alert('Expense added successfully!');
          this.expenseForm.reset();
        },
        error: (err) => {
          alert('Error adding expense: ' + err.message);
        }
      });
    } else {
      alert('Please fill in all required fields.');
    }
  }
}
