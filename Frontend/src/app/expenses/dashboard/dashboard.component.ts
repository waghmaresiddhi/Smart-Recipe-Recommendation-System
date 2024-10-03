import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ExpensesService, Expense } from '../expenses.service'; // Adjusted import path

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  expenseFormVisible = false; // Toggle for displaying the form
  expenseForm: FormGroup; // Form for adding expenses
  searchQuery: string = '';
  selectedFilter: string = '';
  filterOptions: { label: string, value: string }[] = [
    { label: 'All', value: '' },
    { label: 'Groceries', value: 'Groceries' },
    { label: 'Utilities', value: 'Utilities' },
    { label: 'Transportation', value: 'Transportation' },
    { label: 'Entertainment', value: 'Entertainment' },
    { label: 'Healthcare', value: 'Healthcare' },
    { label: 'Rent', value: 'Rent' },
    { label: 'Insurance', value: 'Insurance' },
    { label: 'Clothing', value: 'Clothing' },
    { label: 'Other', value: 'Other' }
  ];
  expenses: Expense[] = [];
  chartData: any; // Define chart data structure
  chartVisible: boolean = false; // Variable to control the visibility of the chart
  expenseListVisible: boolean = false; // Property to control expense list visibility

  constructor(private expensesService: ExpensesService, private fb: FormBuilder, private router: Router) {
    // Initialize the form group with validators
    this.expenseForm = this.fb.group({
      amount: [null, [Validators.required, Validators.min(0)]],
      category: [null, Validators.required],
      date: [null, Validators.required],
      description: ['']
    });
  }

  ngOnInit() {
    this.loadExpenses(); // Load expenses initially
  }

  loadExpenses() {
    this.expensesService.getExpenses().subscribe(expenses => {
      this.expenses = expenses;
      this.prepareChartData(); // Prepare chart data after loading expenses
    });
  }

  toggleExpenseForm() {
    this.expenseFormVisible = !this.expenseFormVisible; // Toggle visibility
  }

  // Method to toggle the visibility of the expense list
  toggleExpenseListVisibility() {
    this.expenseListVisible = !this.expenseListVisible; // Toggle visibility
  }

  // Method to toggle the visibility of the chart
  toggleChartVisibility() {
    this.chartVisible = !this.chartVisible;
  }

  addExpense() {
    if (this.expenseForm.valid) {
      const newExpense: Expense = this.expenseForm.value; // Get form value as new expense
      this.expensesService.addExpense(newExpense).subscribe(expense => {
        this.expenses.push(expense); // Add the new expense to the local expenses array
        this.expenseForm.reset(); // Reset the form after submission
        this.prepareChartData(); // Update chart data with the new expense
        this.toggleExpenseForm(); // Hide the form after adding the expense
      });
    } else {
      // Handle form validation errors if needed
      alert('Please fill in all required fields.');
    }
  }

  filterExpenses() {
    const filteredExpenses = this.expenses.filter(expense => {
      const matchesSearch = expense.description?.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchesFilter = this.selectedFilter ? expense.category === this.selectedFilter : true;
      return matchesSearch && matchesFilter;
    });

    this.prepareChartData(filteredExpenses); // Update chart data based on filtered expenses
  }

  prepareChartData(expenses: Expense[] = this.expenses) {
    const chartData = {
      labels: [],
      datasets: [
        {
          data: [],
          backgroundColor: [] // Define colors for pie chart segments
        }
      ]
    };

    const categoryMap: { [key: string]: number } = {};

    // Create a map of expenses by category
    expenses.forEach(expense => {
      if (categoryMap[expense.category]) {
        categoryMap[expense.category] += expense.amount;
      } else {
        categoryMap[expense.category] = expense.amount;
      }
    });

    // Populate chart data
    for (const category in categoryMap) {
      chartData.labels.push(category);
      chartData.datasets[0].data.push(categoryMap[category]);
      chartData.datasets[0].backgroundColor.push(this.getRandomColor()); // Generate a random color for each category
    }

    this.chartData = chartData; // Assign prepared chart data to the chartData property
  }

  getRandomColor() {
    // Generate a random color for pie chart segments
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  navigateTo(path: string): void {
    this.router.navigate([path]); // Use Router to navigate to the specified path
  }
}
