import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Expense {
  id?: number; // id is optional because it may not be available for new expenses
  amount: number;
  category: string;
  date: string;
  description?: string; // description is optional
}

@Injectable({
  providedIn: 'root'
})
export class ExpensesService {
  private apiUrl = 'http://localhost:8000/api/expenses/'; // Ensure this matches your backend API URL
  private expensesSubject = new BehaviorSubject<Expense[]>([]); // Initialize BehaviorSubject
  expenses$ = this.expensesSubject.asObservable(); // Expose observable for subscribers

  constructor(private http: HttpClient) {
    this.loadExpenses(); // Load existing expenses on service initialization
  }

  // Load all expenses from the API
  private loadExpenses() {
    this.getExpenses().subscribe(expenses => {
      this.expensesSubject.next(expenses); // Emit initial expenses
    });
  }

  // Get all expenses
  getExpenses(): Observable<Expense[]> {
    return this.http.get<Expense[]>(this.apiUrl); // Fetch expenses from the API
  }

  // Add a new expense
  addExpense(expense: Expense): Observable<Expense> {
    return this.http.post<Expense>(this.apiUrl, expense).pipe(
      map(newExpense => {
        this.expensesSubject.next([...this.expensesSubject.value, newExpense]); // Update the BehaviorSubject
        return newExpense; // Return the new expense
      })
    );
  }

  // Update an existing expense
  updateExpense(id: number, expense: Expense): Observable<Expense> {
    return this.http.put<Expense>(`${this.apiUrl}${id}/`, expense).pipe(
      map(updatedExpense => {
        const updatedExpenses = this.expensesSubject.value.map(exp => (exp.id === id ? updatedExpense : exp));
        this.expensesSubject.next(updatedExpenses); // Update the BehaviorSubject
        return updatedExpense; // Return the updated expense
      })
    );
  }

  // Delete an expense
  deleteExpense(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}/`).pipe(
      map(() => {
        const updatedExpenses = this.expensesSubject.value.filter(exp => exp.id !== id);
        this.expensesSubject.next(updatedExpenses); // Update the BehaviorSubject
      })
    );
  }
}
