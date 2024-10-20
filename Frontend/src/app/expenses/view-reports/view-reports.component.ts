import { Component, OnInit } from '@angular/core';
import { ExpensesService, Expense } from '../expenses.service';

@Component({
  selector: 'app-view-reports',
  templateUrl: './view-reports.component.html',
  styleUrls: ['./view-reports.component.scss']
})
export class ViewReportsComponent implements OnInit {
  expenses: Expense[] = [];
  isEditing: boolean = false;
  popupTitle: string = '';
  popupCategory: string = ''; // To hold the category for the popup

  report: { [key: string]: number } = {
    Groceries: 0,
    Food: 0,
    Utilities: 0,
    Transportation: 0,
    Entertainment: 0,
    Rent: 0,
    Insurance: 0,
    Clothing: 0,
    Other: 0
  };

  detailedExpenses: { [key: string]: Expense[] } = {
    Groceries: [],
    Food: [],
    Utilities: [],
    Transportation: [],
    Entertainment: [],
    Rent: [],
    Insurance: [],
    Clothing: [],
    Other: []
  };

  constructor(private expenseService: ExpensesService) {}

  ngOnInit(): void {
    this.loadExpenses();
  }

  loadExpenses(): void {
    this.expenseService.getExpenses().subscribe({
      next: (data: Expense[]) => {
        this.expenses = data;
        this.calculateReport();
      },
      error: (err) => {
        console.error('Error loading expenses:', err);
      }
    });
  }

  calculateReport(): void {
    Object.keys(this.report).forEach(key => {
      this.report[key] = 0;
      this.detailedExpenses[key] = [];
    });

    this.expenses.forEach(expense => {
      const category = expense.category ? expense.category.trim() : '';
      const amount = typeof expense.amount === 'string' ? parseFloat(expense.amount) : expense.amount;

      if (category && !isNaN(amount)) {
        if (this.report.hasOwnProperty(category)) {
          this.report[category] += amount;
          this.detailedExpenses[category].push(expense);
        } else {
          this.report['Other'] += amount;
          this.detailedExpenses['Other'].push(expense);
        }
      }
    });

    console.log('Expense Report:', this.report);
    console.log('Detailed Expenses:', this.detailedExpenses);
  }

  openDetailPopup(category: string): void {
    this.popupCategory = category; // Set the selected category for the popup
    this.popupTitle = `Details for ${category}`; // Set the title for the popup
    this.isEditing = true; // Show the popup
  }

  closePopup(): void {
    this.isEditing = false; // Hide the popup
  }

  getCategoryKeys(): string[] {
    return Object.keys(this.report); // Returns the keys for the report categories
  }
}
