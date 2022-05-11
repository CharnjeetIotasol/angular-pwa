import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from 'angular-2-local-storage';
import { IResourceWithId } from './auth.model';
import { CommonUtil } from './common.util';
import { HttpServiceRequests } from './http.service';

@Injectable({
    providedIn: 'root'
})
export class AuthService extends HttpServiceRequests<IResourceWithId> {

    constructor(public http: HttpClient, private localStorageService: LocalStorageService, private router: Router,
        private activatedRoute: ActivatedRoute) {
        super(http);
    }

    logout() {
        this.localStorageService.remove('token');
        this.localStorageService.remove('user');
        this.localStorageService.remove('project');
        this.localStorageService.remove('admin-token');
        this.localStorageService.remove('admin-user');
        this.router.navigate(['login']);
    }

    getToken(): any {
        return this.localStorageService.get('token') as any;
    }

    getAdminToken(): any {
        return this.localStorageService.get('admin-token') as any;
    }

    getUser(): any {
        return this.localStorageService.get('user') as any;
    }

    getRoles() {
        const user = this.localStorageService.get('user') as any;
        if (CommonUtil.isNullOrUndefined(user)) {
            return '';
        }
        return user.roles;
    }

    hasRole(roles: any[]): boolean {
        // this is used in case user has single role
        //return roles.indexOf(this.getRoles()) !== -1; 
        return roles.some(r => this.getUser().roles.includes(r));
    }

    isAdmin(): boolean {
        return this.hasRole(["ROLE_ADMIN"]);
    }

    isPartner(): boolean {
        return this.hasRole(["ROLE_PARTNER"]);
    }

    hasValidToken(): boolean {
        const token: any = this.getToken();
        return !CommonUtil.isNullOrUndefined(token) && token.accessToken && token.expires_at && token.expires_at > new Date().getTime();
    }

    hasAdminAccess(): boolean {
        const token: any = this.getAdminToken();
        return !CommonUtil.isNullOrUndefined(token) && token.accessToken && token.expires_at && token.expires_at > new Date().getTime();
    }

    isAuthorizedUser(roles: Array<string>) {
        const promise = new Promise((resolve) => {
            if (!this.hasValidToken()) {
                this.localStorageService.remove('token');
                this.localStorageService.remove('user');
                this.localStorageService.remove('admin-token');
                this.localStorageService.remove('admin-user');
            }
            resolve({ hasAccess: this.hasValidToken(), hasRoleAccess: roles.some(x => this.getRoles().indexOf(x) !== -1) });
        });
        return promise;
    }
}
