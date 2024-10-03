import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router'; // Import Router
import { ExpensesService, Expense } from '../expenses.service'; // Adjust the import path as needed

@Component({
  selector: 'app-expense-form',
  templateUrl: './expense-form.component.html',
  styleUrls: ['./expense-form.component.css']
})
export class ExpenseFormComponent implements OnInit {
  expenseForm: FormGroup;
  isEditing = false;
  editingExpenseId: number | null = null; // To track which expense is being edited
  expenses: Expense[] = []; // The list of expenses
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
  errorMessage: string | null = null; // To hold error messages for display

  constructor(
    private fb: FormBuilder,
    private expensesService: ExpensesService,
    private router: Router // Inject Router
  ) {
    this.expenseForm = this.fb.group({
      amount: ['', [Validators.required]],
      category: ['', [Validators.required]],
      date: ['', [Validators.required]],
      description: ['']
    });
  }

  ngOnInit() {
    this.loadExpenses(); // Load expenses when the component is initialized
  }

  // Load expenses from the service
  loadExpenses() {
    this.expensesService.getExpenses().subscribe(
      (data: Expense[]) => {
        this.expenses = data; // Populate the expenses array
      },
      (error) => {
        console.error('Error loading expenses:', error);
        this.errorMessage = 'An error occurred while loading the expenses.';
      }
    );
  }

  onSubmit() {
    if (this.expenseForm.valid) {
      const expense: Expense = this.expenseForm.value;

      if (this.isEditing && this.editingExpenseId !== null) {
        // Update existing expense
        this.expensesService.updateExpense(this.editingExpenseId, expense).subscribe(
          updatedExpense => {
            // Update the list with the edited expense
            const index = this.expenses.findIndex(e => e.id === this.editingExpenseId);
            if (index !== -1) {
              this.expenses[index] = updatedExpense; // Update the specific expense in the list
            }

            this.resetForm();
          },
          error => {
            console.error('Error updating expense:', error);
            this.errorMessage = 'An error occurred while updating the expense.';
          }
        );
      } else {
        // Add new expense
        this.expensesService.addExpense(expense).subscribe(
          newExpense => {
            this.expenses.push(newExpense); // Add the new expense to the list
            this.resetForm();
          },
          error => {
            console.error('Error adding expense:', error);
            this.errorMessage = 'An error occurred while adding the expense.';
          }
        );
      }
    } else {
      this.errorMessage = 'Please fill out the form correctly.';
    }
  }

  editExpense(expense: Expense) {
    this.isEditing = true;
    this.editingExpenseId = expense.id; // Store the ID of the expense being edited
    this.expenseForm.patchValue(expense); // Pre-fill the form with the expense details
    this.errorMessage = null; // Clear any previous error
  }

  deleteExpense(id: number) {
    this.expensesService.deleteExpense(id).subscribe(
      () => {
        this.expenses = this.expenses.filter(expense => expense.id !== id); // Remove the deleted expense from the list
        this.errorMessage = null; // Clear any previous error
      },
      error => {
        console.error('Error deleting expense:', error);
        this.errorMessage = 'An error occurred while deleting the expense.';
      }
    );
  }

  resetForm() {
    this.expenseForm.reset({
      amount: '',
      category: '',
      date: '',
      description: ''
    });
    this.isEditing = false;
    this.editingExpenseId = null;
    this.errorMessage = null; // Clear any previous error
  }

  goBack() {
    this.router.navigate(['/dashboard']); // Adjust the route as necessary
  }
}
