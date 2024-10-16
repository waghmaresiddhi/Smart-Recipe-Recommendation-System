import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ExpensesService, Expense } from '../expenses.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-expenses',
  templateUrl: './edit-expenses.component.html',
  styleUrls: ['./edit-expenses.component.css']
})
export class EditExpensesComponent implements OnInit, OnDestroy {
  editExpenseForm!: FormGroup;
  selectedExpense: Expense | null = null;
  expenses$ = this.expensesService.expenses$;
  subscription!: Subscription;
  isEditing: boolean = false; // Track editing state

  // Array of categories
  categories: string[] = [
    'Groceries',
    'Food',
    'Utilities',
    'Transportation',
    'Entertainment',
    'Healthcare',
    'Rent',
    'Insurance',
    'Clothing',
    'Other'
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private expensesService: ExpensesService
  ) {}

  ngOnInit(): void {
    this.editExpenseForm = this.fb.group({
      amount: ['', [Validators.required, Validators.min(0)]],
      category: ['', Validators.required],
      date: ['', Validators.required],
      description: ['']
    });

    // Optional: Load expenses initially if necessary
    // this.loadExpenses();
  }

  editExpense(expense: Expense): void {
    this.selectedExpense = expense; // Set the selected expense
    this.isEditing = true; // Enable editing

    // Load the selected expense into the form
    this.editExpenseForm.patchValue({
      amount: expense.amount,
      category: expense.category,
      date: expense.date,
      description: expense.description
    });
  }

  onSubmitEdit(): void {
    if (this.editExpenseForm.valid && this.selectedExpense) {
      const updatedExpense: Expense = {
        ...this.selectedExpense,
        ...this.editExpenseForm.value
      };

      this.expensesService.updateExpense(this.selectedExpense.id, updatedExpense).subscribe(
        () => {
          alert('Expense updated successfully!');
          this.cancelEdit(); // Navigate back to the expense list after updating
        },
        (error) => {
          console.error('Failed to update expense', error);
        }
      );
    }
  }

  deleteExpense(expenseId: number): void {
    if (confirm('Are you sure you want to delete this expense?')) {
      this.expensesService.deleteExpense(expenseId).subscribe(() => {
        this.loadExpenses(); // Refresh the expense list after deletion
      }, error => {
        console.error('Error deleting expense:', error);
      });
    }
  }

  cancelEdit(): void {
    this.isEditing = false; // Disable editing
    this.selectedExpense = null; // Clear the selected expense
    this.editExpenseForm.reset(); // Reset the form
    // Optionally, you can keep the user on the same page if you don't want to navigate away
    // this.router.navigate(['/expense-list']); // Uncomment if you want to navigate back to the expense list
  }

  loadExpenses(): void {
    this.expensesService.getExpenses().subscribe();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
