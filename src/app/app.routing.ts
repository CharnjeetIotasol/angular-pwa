import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { OnboardingComponent } from './pages/onboarding/onboarding.component';
import { RegisterComponent } from './pages/register/register.component';

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
  // {
  //   path: 'dashboard',
  //   loadChildren: () => import('./pages/layout/layout.module').then(m => m.LayoutModule),
  //   data: { roles: ['ROLE_ADMIN', 'ROLE_PARTNER'] }
  // },
  {
    path: '**',
    redirectTo: '/account/login'
  }
];
