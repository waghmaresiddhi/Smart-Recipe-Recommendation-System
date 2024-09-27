// src/app/expenses/expenses.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExpensesService {
  private apiUrl = 'http://localhost:8000/api/expenses/'; // Adjust to your backend API URL

  constructor(private http: HttpClient) {}

  // Create a new expense
  addExpense(expense: any): Observable<any> {
    return this.http.post(this.apiUrl, expense);
  }
}
