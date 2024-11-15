import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { NoAuthGuard } from 'app/core/auth/guards/noAuth.guard';
import { LayoutComponent } from 'app/layout/layout.component';
import { InitialDataResolver } from 'app/app.resolvers';
import { ExpenseFormComponent } from 'app/expenses/expense-form/expense-form.component';
import { DashboardComponent } from 'app/expenses/dashboard/dashboard.component';
import { EditExpensesComponent } from 'app/expenses/edit-expenses/edit-expenses.component';
import { ViewReportsComponent } from 'app/expenses/view-reports/view-reports.component';
import { ShowChartComponent } from 'app/expenses/show-chart/show-chart.component';
import { HelpCenterComponent } from 'app/expenses/help-center/help-center.component';
import { SettingsComponent } from 'app/expenses/settings/settings.component';

// @formatter:off
// tslint:disable:max-line-length
const routes: Routes = [
    // Redirect empty path to '/example' for authenticated users
    { path: '', pathMatch: 'full', redirectTo: 'example' },

    // Redirect signed-in user to the '/example' path after signing in
    { path: 'signed-in-redirect', pathMatch: 'full', redirectTo: 'example' },

    // Auth routes for unauthenticated users
    {
        path: '',
        canActivate: [NoAuthGuard],
        canActivateChild: [NoAuthGuard],
        component: LayoutComponent,
        data: { layout: 'empty' },
        children: [
            { path: 'confirmation-required', loadChildren: () => import('app/modules/auth/confirmation-required/confirmation-required.module').then(m => m.AuthConfirmationRequiredModule) },
            { path: 'forgot-password', loadChildren: () => import('app/modules/auth/forgot-password/forgot-password.module').then(m => m.AuthForgotPasswordModule) },
            { path: 'reset-password', loadChildren: () => import('app/modules/auth/reset-password/reset-password.module').then(m => m.AuthResetPasswordModule) },
            { path: 'sign-in', loadChildren: () => import('app/modules/auth/sign-in/sign-in.module').then(m => m.AuthSignInModule) },
            { path: 'sign-up', loadChildren: () => import('app/modules/auth/sign-up/sign-up.module').then(m => m.AuthSignUpModule) },
            { path: 'verify-email/:token', loadChildren: () => import('app/modules/auth/verify-email/verify-email.module').then(m => m.VerifyEmailModule) },
            { path: 'request-verification-link/:email', loadChildren: () => import('app/modules/auth/request-verification-link/request-verification-link.module').then(m => m.RequestVerificationLinkModule) },
            { path: 'linkedin-login', loadChildren: () => import('app/modules/auth/linkedin-login/linkedin-login.module').then(m => m.LinkedinLoginModule) }
        ]
    },

    // Auth routes for authenticated users
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        data: { layout: 'empty' },
        children: [
            { path: 'sign-out', loadChildren: () => import('app/modules/auth/sign-out/sign-out.module').then(m => m.AuthSignOutModule) },
            { path: 'unlock-session', loadChildren: () => import('app/modules/auth/unlock-session/unlock-session.module').then(m => m.AuthUnlockSessionModule) }
        ]
    },

    // Landing routes (public)
    {
        path: '',
        component: LayoutComponent,
        data: { layout: 'empty' },
        children: [
            { path: 'home', loadChildren: () => import('app/modules/landing/home/home.module').then(m => m.LandingHomeModule) },
        ]
    },

    // Admin routes (authenticated users only)
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        resolve: { initialData: InitialDataResolver },
        children: [
            { path: 'example', loadChildren: () => import('app/modules/admin/example/example.module').then(m => m.ExampleModule) },
            { path: 'profile', loadChildren: () => import('app/modules/admin/profile/profile.module').then(m => m.ProfileModule) },
            { path: 'change-password', loadChildren: () => import('app/modules/admin/change-password/change-password.module').then(m => m.ChangePasswordModule) },
            { path: 'e-commerce', loadChildren: () => import('app/modules/admin/e-commerce-mobile/e-commerce-mobile.module').then(m => m.ECommerceMobileModule) },
            { path: 'expense-form', component: ExpenseFormComponent }, // Added route for ExpenseFormComponent
            { path: 'dashboard', component: DashboardComponent }, // Added route for DashboardComponent
            { path: 'edit-expenses', component: EditExpensesComponent }, // Added route for EditExpensesComponent
            { path: 'view-reports', component: ViewReportsComponent }, // Added route for ViewReportsComponent
            { path: 'show-chart', component: ShowChartComponent }, // Added route for ShowChartComponent
            { path: 'help-center', component: HelpCenterComponent }, // Added route for HelpCenterComponent
            { path: 'settings', component: SettingsComponent } // Added route for SettingsComponent
        ]
    },

    // Wildcard route for invalid paths
    { path: '**', redirectTo: '/sign-in' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }

// Exporting the appRoutes constant
export const appRoutes = routes; // Make sure this line is included
