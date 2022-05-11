import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from 'angular-2-local-storage';
import { Login } from 'src/app/models/login';
import { LoadingService } from 'src/app/services/loading.service';
import { LoginService } from 'src/app/services/login.service';
import { RestResponse } from 'src/app/shared/auth.model';
import { ToastService } from 'src/app/shared/toast.service';

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
  constructor(private toastService: ToastService,
    private loginService: LoginService,
    private localStorageService: LocalStorageService,
    private loadingService: LoadingService,
    private router: Router) { }

  ngOnInit(): void {
    this.agreeTermAndCondition = false;
    this.fieldPasswordType = this.fieldConfirmPasswordType = "password";
    this.data = new Login();
    this.onClickValidation = false;
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
}
