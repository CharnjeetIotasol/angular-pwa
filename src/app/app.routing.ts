import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';

export const ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  // {
  //   path: 'dashboard',
  //   loadChildren: () => import('./pages/layout/layout.module').then(m => m.LayoutModule),
  //   data: { roles: ['ROLE_ADMIN', 'ROLE_PARTNER'] }
  // },
  { path: '**', redirectTo: '/login' }
];
