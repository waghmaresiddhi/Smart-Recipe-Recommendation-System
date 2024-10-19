import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ExpensesService, Expense } from '../expenses.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router'; // Import Router

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
  successMessage: string = ''; // Initialize successMessage

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
    private expensesService: ExpensesService,
    private router: Router // Inject Router
  ) {}

  ngOnInit(): void {
    this.editExpenseForm = this.fb.group({
      amount: ['', [Validators.required, Validators.min(0)]],
      category: ['', Validators.required],
      date: ['', Validators.required],
      description: ['']
    });

    this.loadExpenses(); // Load expenses initially
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

    // Open the modal
    this.openModal();
  }

  onSubmitEdit(): void {
    if (this.editExpenseForm.valid && this.selectedExpense) {
      const updatedExpense: Expense = {
        ...this.selectedExpense,
        ...this.editExpenseForm.value
      };

      this.expensesService.updateExpense(this.selectedExpense.id, updatedExpense).subscribe(
        () => {
          this.successMessage = 'Expense updated successfully!'; // Set success message
          this.cancelEdit(); // Close modal and reset after update
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
    this.closeModal(); // Close the modal
    this.successMessage = ''; // Reset success message
  }

  loadExpenses(): void {
    // Use subscription to load expenses and manage it for cleanup
    this.subscription = this.expensesService.getExpenses().subscribe();
  }

  // Modal control methods
  openModal(): void {
    const modalElement = document.getElementById('popupOverlay');
    if (modalElement) {
      modalElement.classList.add('show');
      modalElement.style.display = 'flex'; // Change to flex for centering
    }
  }

  closeModal(): void {
    const modalElement = document.getElementById('popupOverlay');
    if (modalElement) {
      modalElement.classList.remove('show');
      modalElement.style.display = 'none';
    }
  }

  ngOnDestroy(): void {
    // Unsubscribe from the subscription when the component is destroyed
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  goBack() {
    this.router.navigate(['/dashboard']); // Replace with your dashboard route
  }
}
