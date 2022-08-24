import { FacebookLoginProvider, GoogleLoginProvider, SocialAuthService } from '@abacritt/angularx-social-login';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from 'angular-2-local-storage';
import { Login } from 'src/app/models/login';
import { LoadingService } from 'src/app/services/loading.service';
import { LoginService } from 'src/app/services/login.service';
import { RestResponse } from 'src/app/shared/auth.model';
import { CommonUtil } from 'src/app/shared/common.util';
import { ToastService } from 'src/app/shared/toast.service';
declare const AppleID: any;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  onClickValidation: boolean;
  data: Login;
  fieldPasswordType: string;
  fieldConfirmPasswordType: string;
  agreeTermAndCondition: boolean;
  options: any;
  constructor(private toastService: ToastService,
    private loginService: LoginService,
    private localStorageService: LocalStorageService,
    private loadingService: LoadingService,
    private router: Router,
    private socialAuthService: SocialAuthService) { }

  ngOnInit(): void {
    this.options = {
      types: []
    };
    this.agreeTermAndCondition = false;
    this.fieldPasswordType = this.fieldConfirmPasswordType = "password";
    this.data = new Login();
    this.onClickValidation = false;

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
    this.fieldPasswordType = this.fieldPasswordType === "password" ? "text" : "password";
  }

  toggleConfirmPasswordField() {
    this.fieldConfirmPasswordType = this.fieldConfirmPasswordType === "password" ? "text" : "password";
  }

  createAccount(form: any): void {
    this.onClickValidation = !form.valid;
    if (!form.valid) {
      return;
    }
    if (!this.data.isValidRegisterRequest(form) || !this.agreeTermAndCondition) {
      this.onClickValidation = true;
      return;
    }
    this.loadingService.show();
    const names = this.data.name.split(" ");
    this.data.firstName = this.data.name;
    if (names.length === 2) {
      this.data.firstName = names[0];
      this.data.lastName = names[1];
    }
    this.loginService.register(this.data)
      .then((data: RestResponse) => {
        this.loadingService.hide();
        if (!data.status) {
          this.toastService.error(data.message);
          return;
        }
        const response = data.data;
        this.processToken(response);
      }, (e: any) => {
        this.loadingService.hide();
        this.toastService.error(e.message);
      });
  }

  processToken(response: any) {
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
    });
  }

  onAddressChange(address: any) {
    this.data.address = address.formatted_address;
  }

  loginWithGoogle(): void {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  loginWithFacebook(): void {
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

  async processSocialLogin(user: any) {
    const input = new Login();
    input.firstName = user.firstName;
    input.lastName = user.lastName;
    input.email = user.email;
    if (user.provider === "GOOGLE") {
      input.googleId = user.id;
    } else if (user.provider === "FACEBOOK") {
      input.facebookId = user.id;
    } else if (user.provider === "APPLE") {
      input.linkedinId = user.email;
    }
    if (!this.isValidSocialRegisterRequest(input)) {
      return;
    }
    this.loadingService.show();
    try {
      const data: RestResponse = await this.loginService.socialLogin(input);
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
      const user = data.user;
      user.provider === "APPLE";
      this.processSocialLogin(user);
    } catch (error) {
      this.toastService.error("Sorry, Somethings went wrong while Sign With Apple. Please try after some time.")
    }
  }
}
