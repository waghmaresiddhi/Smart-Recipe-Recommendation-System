import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ExpensesService, Expense } from '../expenses.service'; // Adjusted import path

@Component({
  selector: 'app-expense-form',
  templateUrl: './expense-form.component.html',
  styleUrls: ['./expense-form.component.css']
})
export class ExpenseFormComponent implements OnInit {
  expenseForm: FormGroup;
  expenses: Expense[] = [];
  isEditing = false;
  editingExpenseId: number | null = null; // To track which expense is being edited

  // Define categories for the dropdown
  categories: string[] = [
    'Groceries',
    'Utilities',
    'Transportation',
    'Entertainment',
    'Healthcare',
    'Rent',
    'Insurance',
    'Clothing',
    'Other'
  ];

  constructor(private fb: FormBuilder, private expensesService: ExpensesService) {
    this.expenseForm = this.fb.group({
      amount: ['', [Validators.required]],
      category: ['', [Validators.required]], // Category is now required
      date: ['', [Validators.required]],
      description: ['']
    });
  }

  ngOnInit() {
    this.loadExpenses(); // Load existing expenses when the component initializes
  }

  loadExpenses() {
    this.expensesService.getExpenses().subscribe(expenses => {
      this.expenses = expenses;
    });
  }

  onSubmit() {
    if (this.expenseForm.valid) {
      const expense: Expense = this.expenseForm.value;

      if (this.isEditing && this.editingExpenseId !== null) {
        // Logic to update the expense
        this.expensesService.updateExpense(this.editingExpenseId, expense).subscribe(updatedExpense => {
          const index = this.expenses.findIndex(exp => exp.id === updatedExpense.id);
          if (index !== -1) {
            this.expenses[index] = updatedExpense; // Update the expense in the array
          }
          this.expenseForm.reset();
          this.isEditing = false; // Reset editing state
          this.editingExpenseId = null; // Clear the editing expense ID
        });
      } else {
        this.expensesService.addExpense(expense).subscribe(newExpense => {
          this.expenses.push(newExpense);
          this.expenseForm.reset();
        });
      }
    }
  }

  editExpense(expense: Expense) {
    this.isEditing = true;
    this.editingExpenseId = expense.id; // Store the ID of the expense being edited
    this.expenseForm.patchValue(expense); // Pre-fill the form with the expense details
  }

  deleteExpense(id: number) {
    this.expensesService.deleteExpense(id).subscribe(() => {
      this.expenses = this.expenses.filter(exp => exp.id !== id);
    });
  }
}
