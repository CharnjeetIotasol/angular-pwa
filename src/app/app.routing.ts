import { Routes } from '@angular/router';
import { ForbiddenComponent } from './pages/forbidden/forbidden.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { LoginComponent } from './pages/login/login.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { OnboardingComponent } from './pages/onboarding/onboarding.component';
import { RegisterComponent } from './pages/register/register.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { AuthGuard } from './shared/auth.guard';

export const ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'account/register',
    pathMatch: 'full'
  },
  {
    path: 'account/login',
    component: LoginComponent
  },
  {
    path: 'account/register',
    component: RegisterComponent
  },
  {
    path: 'account/onboarding',
    component: OnboardingComponent
  },
  {
    path: 'account/forgot/password',
    component: ForgotPasswordComponent
  },
  {
    path: 'account/recover/:code',
    component: ResetPasswordComponent
  },
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_USER'] },
    loadChildren: () => import('./pages/layout/layout.module').then(m => m.LayoutModule)
  },
  {
    path: '403',
    component: ForbiddenComponent
  },
  {
    path: '404',
    component: NotFoundComponent
  },
  {
    path: '**',
    redirectTo: '/account/login'
  }
];
