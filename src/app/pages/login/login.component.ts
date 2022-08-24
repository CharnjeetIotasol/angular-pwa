import { FacebookLoginProvider, GoogleLoginProvider, SocialAuthService } from '@abacritt/angularx-social-login';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { LocalStorageService } from 'angular-2-local-storage';
import { Login } from 'src/app/models/login';
import { LoadingService } from 'src/app/services/loading.service';
import { LoginService } from 'src/app/services/login.service';
import { RestResponse } from 'src/app/shared/auth.model';
import { CommonUtil } from 'src/app/shared/common.util';
import { ToastService } from 'src/app/shared/toast.service';

declare const AppleID: any;

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
    AppleID.auth.init({
      clientId: 'com.rv.signin',
      scope: "name email",
      redirectURI: `https://dreamy-tanuki-7f8d5b.netlify.app/apple/callback`,
      state: "what ever string to be remembered",
      usePopup: true
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
      if (response.user.isOnboardingCompleted) {
        this.localStorageService.set('token', response.token);
        this.localStorageService.set('user', response.user);
      } else {
        this.localStorageService.set('temp-token', response.token);
        this.localStorageService.set('temp-user', response.user);
      }
      setTimeout(() => {
        if (response.user.isOnboardingCompleted) {
          this.router.navigate(['/dashboard']);
        } else {
          this.router.navigate(['/account/onboarding']);
        }
      }, 500);
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
    alert("processSocialLogin");
    const input = new Login();
    input.firstName = user.firstName;
    input.lastName = user.lastName;
    input.email = user.email;
    if (user.provider === "GOOGLE") {
      input.googleId = user.id;
    } else if (user.provider === "FACEBOOK") {
      input.facebookId = user.id;
    } else if (user.provider === "APPLE") {
      input.appleId = user.id;
    }
    alert(JSON.stringify(input));
    if (!this.isValidSocialRegisterRequest(input)) {
      return;
    }
    alert("Sending Call to API");
    this.loadingService.show();
    try {
      const data: RestResponse = await this.loginService.socialLogin(input);
      this.loadingService.hide();
      alert("Got Response from API");
      alert(JSON.stringify(data));
      if (!data.status) {
        this.toastService.error(data.message);
        return;
      }
      const response = data.data;
      response.token.expires_at = new Date(response.token.expires).getTime();
      if (response.user.isOnboardingCompleted) {
        this.localStorageService.set('token', response.token);
        this.localStorageService.set('user', response.user);
      } else {
        this.localStorageService.set('temp-token', response.token);
        this.localStorageService.set('temp-user', response.user);
      }
      setTimeout(() => {
        this.socialAuthService.signOut();
        if (response.user.isOnboardingCompleted) {
          this.router.navigate(['/dashboard']);
        } else {
          this.router.navigate(['/account/onboarding']);
        }
      }, 500);
    } catch (e: any) {
      this.loadingService.hide();
      this.toastService.error(e.message);
    }
  }

  isValidSocialRegisterRequest(input: Login) {
    if (CommonUtil.isNullOrUndefined(input.firstName) || input.firstName.trim() === '') {
      this.toastService.error("First Name is required");
      return false;
    }
    if (CommonUtil.isNullOrUndefined(input.email) || input.email.trim() === '') {
      this.toastService.error("Sorry, We are unable to fetch email address from social. Please change setting in social account to access your email address.");
      return false;
    }
    return true;
  }

  async loginWithApple() {
    try {
      const data = await AppleID.auth.signIn();
      alert("Got Response From Apple");
      if (!data.authorization || !data.authorization.id_token) {
        this.toastService.error("Sorry, Somethings went wrong while Sign With Apple. Please try after some time.")
        return;
      }
      const helper = new JwtHelperService();
      const decodedToken = helper.decodeToken(data.authorization.id_token);
      if (data.user) {
        const user = {} as any;
        user.email = data.user.email;
        user.firstName = data.user.name ? data.user.name.firstName : "Guest";
        user.lastName = data.user.name ? data.user.name.lastName : "";
        user.id = decodedToken.sub;
        user.provider = "APPLE";
        this.processSocialLogin(user);
        return;
      }
      const user = {} as any;
      user.email = decodedToken.email;
      user.id = decodedToken.sub;
      user.provider = "APPLE";
      this.processSocialLogin(user);
    } catch (error) {
      alert(JSON.stringify(error));
      this.toastService.error("Sorry, Somethings went wrong while Sign With Apple. Please try after some time.")
    }
  }
}
