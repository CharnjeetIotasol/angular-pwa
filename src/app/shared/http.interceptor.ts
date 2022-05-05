import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from 'angular-2-local-storage';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

declare var $: any;

@Injectable()
export class HttpAuthInterceptor implements HttpInterceptor {

  constructor(private localStorageService: LocalStorageService, private router: Router) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token: any = this.localStorageService.get('token');
    if (token && token.accessToken && token.expires_at && token.expires_at > new Date().getTime()) {
      const authReq = req.clone({ setHeaders: { Authorization: 'Bearer ' + token.accessToken } });
      req = authReq;
    }
    return next.handle(req).pipe(catchError((error) => {
      if (error.status === 401) {
        this.localStorageService.remove('token');
        this.localStorageService.remove('user');
        this.router.navigate(['/login']);
      }
      return throwError(error);
    }));
  }
}
