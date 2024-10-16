import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, ReplaySubject } from 'rxjs';
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
                id: 'profile',
                title: 'My Profile',
                type: 'basic',
                icon: 'pi pi-user',
                link: '/profile'
            },
           
            {
                id: 'edit-expenses',
                title: 'Edit Expenses',
                type: 'basic',
                icon: 'pi pi-cog',
                link: '/edit-expenses'
            },
            {
                id: 'view-reports',
                title: 'View Reports',
                type: 'basic',
                icon: 'pi pi-file',
                link: '/view-reports'
            },
            {
                id: 'show-chart',
                title: 'Show Chart',
                type: 'basic',
                icon: 'pi pi-chart-pie',
                link: '/show-chart'
            },
            {
                id: 'help-center',
                title: 'Help Center',
                type: 'basic',
                icon: 'pi pi-question-circle',
                link: '/help-center'
            },
            {
                id: 'settings',
                title: 'Settings',
                type: 'basic',
                icon: 'pi pi-cog',
                link: '/settings'
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
