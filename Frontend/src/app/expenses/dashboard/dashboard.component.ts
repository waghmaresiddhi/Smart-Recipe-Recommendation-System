import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ExpensesService, Expense } from '../expenses.service'; // Adjust the import path accordingly

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  expenseFormVisible = false; // Toggle for displaying the form
  expenseForm: FormGroup; // Form for adding expenses
  searchQuery: string = ''; // Search query for filtering expenses by description
  selectedFilter: string = ''; // Keep this for future use if needed
  filterOptions: { label: string, value: string }[] = [
    { label: 'All', value: '' },
    { label: 'Groceries', value: 'Groceries' },
    { label: 'Food', value: 'Food' },
    { label: 'Utilities', value: 'Utilities' },
    { label: 'Transportation', value: 'Transportation' },
    { label: 'Entertainment', value: 'Entertainment' },
    { label: 'Healthcare', value: 'Healthcare' },
    { label: 'Rent', value: 'Rent' },
    { label: 'Insurance', value: 'Insurance' },
    { label: 'Clothing', value: 'Clothing' },
    { label: 'Other', value: 'Other' }
  ];
  expenses: Expense[] = []; // Store expenses
  chartData: any; // Define chart data structure
  chartVisible: boolean = false; // Variable to control the visibility of the chart
  sidebarHidden: boolean = false; // Initialize sidebar visibility

  dailyExpensesData: any; // Define daily expenses data structure
  monthlyExpensesData: any; // Define monthly expenses data structure
  dailyExpensesOptions: any; // Define options for daily expenses chart
  monthlyExpensesOptions: any; // Define options for monthly expenses chart

  constructor(
    private expensesService: ExpensesService,
    private fb: FormBuilder,
    private router: Router
  ) {
    // Initialize the form group with validators
    this.expenseForm = this.fb.group({
      amount: [null, [Validators.required, Validators.min(0)]],
      category: [null, Validators.required],
      date: [null, Validators.required],
      description: [''],
      searchQuery: [''], // FormControl for search query
      selectedFilter: [''] // FormControl for selected filter
    });
  }

  ngOnInit() {
    this.loadExpenses(); // Load expenses initially
  }

  loadExpenses() {
    this.expensesService.getExpenses().subscribe(expenses => {
      this.expenses = expenses;
      this.prepareChartData(); // Prepare chart data after loading expenses
      this.prepareDailyMonthlyData(); // Prepare daily and monthly data
    });
  }

  prepareDailyMonthlyData() {
    // Logic to prepare data for daily and monthly graphs
    const dailyData = this.getDailyData(this.expenses);
    const monthlyData = this.getMonthlyData(this.expenses);

    this.dailyExpensesData = {
      labels: dailyData.labels,
      datasets: [{
        label: 'Daily Expenses',
        data: dailyData.values,
        backgroundColor: '#42A5F5'
      }]
    };

    this.monthlyExpensesData = {
      labels: monthlyData.labels,
      datasets: [{
        label: 'Monthly Expenses',
        data: monthlyData.values,
        backgroundColor: '#66BB6A'
      }]
    };

    // Set options for the charts
    this.dailyExpensesOptions = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    };

    this.monthlyExpensesOptions = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    };
  }

  getDailyData(expenses: Expense[]) {
    // Logic to format data for daily expenses
    const dailyMap: { [key: string]: number } = {};
    expenses.forEach(expense => {
      const date = new Date(expense.date).toDateString(); // Format date to string
      dailyMap[date] = (dailyMap[date] || 0) + expense.amount;
    });

    return {
      labels: Object.keys(dailyMap),
      values: Object.values(dailyMap)
    };
  }

  getMonthlyData(expenses: Expense[]) {
    // Logic to format data for monthly expenses
    const monthlyMap: { [key: string]: number } = {};
    expenses.forEach(expense => {
      const month = new Date(expense.date).toLocaleString('default', { month: 'long', year: 'numeric' }); // Get month and year
      monthlyMap[month] = (monthlyMap[month] || 0) + expense.amount;
    });

    return {
      labels: Object.keys(monthlyMap),
      values: Object.values(monthlyMap)
    };
  }

  toggleExpenseForm() {
    this.expenseFormVisible = !this.expenseFormVisible; // Toggle visibility
  }

  toggleChartVisibility() {
    this.chartVisible = !this.chartVisible; // Toggle chart visibility
  }

  toggleSidebar() {
    this.sidebarHidden = !this.sidebarHidden; // Toggle sidebar visibility
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
      alert('Please fill in all required fields.'); // Handle form validation errors if needed
    }
  }

  // Method to filter expenses based on the search query
  filterExpenses() {
    const searchQuery = this.expenseForm.get('searchQuery')?.value.toLowerCase();
    const selectedFilter = this.expenseForm.get('selectedFilter')?.value;

    return this.expenses.filter(expense => {
      return (
        expense.description.toLowerCase().includes(searchQuery) &&
        (selectedFilter ? expense.category === selectedFilter : true)
      );
    });
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

  // Method to clear filters
  clearFilters() {
    this.expenseForm.get('searchQuery')?.setValue(''); // Clear search query
    this.expenseForm.get('selectedFilter')?.setValue(''); // Clear selected filter
    // Optionally, you could reload the expenses to refresh the view:
    this.loadExpenses(); // Reload expenses if needed
  }
}
