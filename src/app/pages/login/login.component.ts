import { FacebookLoginProvider, GoogleLoginProvider, SocialAuthService } from '@abacritt/angularx-social-login';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from 'angular-2-local-storage';
import { Login } from 'src/app/models/login';
import { LoadingService } from 'src/app/services/loading.service';
import { LoginService } from 'src/app/services/login.service';
import { RestResponse } from 'src/app/shared/auth.model';
import { ToastService } from 'src/app/shared/toast.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  fieldType: string;
  onClickValidation: boolean;
  data: Login;
  constructor(private toastService: ToastService,
    private loginService: LoginService,
    private router: Router,
    private localStorageService: LocalStorageService,
    private loadingService: LoadingService,
    private socialAuthService: SocialAuthService) {
    this.fieldType = "password";
  }

  ngOnInit(): void {
    this.onClickValidation = false;
    this.data = new Login();
    this.socialAuthService.authState.subscribe((user) => {
      if (!user) {
        return;
      }
      this.processSocialLogin(user);
    });
  }

  togglePasswordField() {
    this.fieldType = this.fieldType === "password" ? "text" : "password";
  }

  async login(form: any): Promise<any> {
    this.onClickValidation = !form.valid;
    if (!form.valid) {
      return;
    }
    if (!this.data.isValidLoginRequest(form)) {
      return;
    }
    try {
      this.loadingService.show();
      const data: RestResponse = await this.loginService.login(this.data);
      this.loadingService.hide();
      if (!data.status) {
        this.toastService.error(data.message);
        return;
      }
      const response = data.data;
      response.token.expires_at = new Date(response.token.expires).getTime();
      if (response.user) {
        response.user.businessName = response.businessName;
      }
      this.localStorageService.set('token', response.token);
      this.localStorageService.set('user', response.user);
      setTimeout(() => {
        this.router.navigate(['/dashboard']);
      });
    } catch (e: any) {
      this.loadingService.hide();
      this.toastService.error(e.message);
    }
  }

  loginWithGoogle(): void {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  loginWithFacebook(): void {
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

  async processSocialLogin(user: any) {
    console.log(user);
    this.router.navigate(['/account/onboarding']);
  }
}
