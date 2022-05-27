import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.services';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const roles = route.data.roles as Array<string>;
    return this.authService.isAuthorizedUser(roles).then((response: any) => {
      if (roles.indexOf('ROLE_ANONYMOUS') !== -1) {
        if (response.hasAccess) {
          this.router.navigate(['dashboard']);
          return false;
        }
        return true;
      }
      if (!response.hasAccess) {
        this.router.navigate(['account/login'], { queryParams: { redirectTo: state.url } });
        return false;
      }
      if (!response.hasRoleAccess) {
        this.router.navigate(['403']);
        return false;
      }
      return true;
    });
  }
}
