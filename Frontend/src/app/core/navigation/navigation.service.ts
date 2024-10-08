import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, ReplaySubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Navigation } from 'app/core/navigation/navigation.types';

@Injectable({
    providedIn: 'root'
})
export class NavigationService {
    private _navigation: ReplaySubject<Navigation> = new ReplaySubject<Navigation>(1);

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for navigation
     */
    get navigation$(): Observable<Navigation> {
        return this._navigation.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get all navigation data
     */
    get(): Observable<Navigation> {
        const singleNav = [
            {
                id: 'example',
                title: 'Example',
                type: 'basic',
                icon: 'heroicons_outline:chart-pie',
                link: '/example'
            },
            {
                id: 'e-commerce',
                title: 'E-Commerce',
                type: 'basic',
                icon: 'heroicons_outline:chart-pie',
                link: '/e-commerce/'
            },
            {
                id: 'json',
                title: 'Json Schema',
                type: 'basic',
                icon: 'heroicons_outline:chart-pie',
                link: '/e-commerce/jsonschema'
            },
            // New Navigation Item for Expense Tracker
            {
                id: 'expense-tracker',
                title: 'Expense Tracker',
                type: 'basic',
                icon: 'heroicons_outline:credit-card',
                link:'/dashboard' 
            },
        ];

        const nav = {
            compact: singleNav,
            default: singleNav,
            futuristic: singleNav,
            horizontal: singleNav,
        } as Navigation;

        this._navigation.next(nav);
        return of(nav);
    }
}
