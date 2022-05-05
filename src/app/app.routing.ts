import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';

export const ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'acccount/register',
    pathMatch: 'full'
  },
  {
    path: 'acccount/login',
    component: LoginComponent
  },
  {
    path: 'acccount/register',
    component: RegisterComponent
  },
  // {
  //   path: 'dashboard',
  //   loadChildren: () => import('./pages/layout/layout.module').then(m => m.LayoutModule),
  //   data: { roles: ['ROLE_ADMIN', 'ROLE_PARTNER'] }
  // },
  {
    path: '**',
    component: LoginComponent
  }
];
