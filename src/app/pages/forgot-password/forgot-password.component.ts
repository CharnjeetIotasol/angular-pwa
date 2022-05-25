import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Login } from 'src/app/models/login';
import { LoadingService } from 'src/app/services/loading.service';
import { LoginService } from 'src/app/services/login.service';
import { RestResponse } from 'src/app/shared/auth.model';
import { ToastService } from 'src/app/shared/toast.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  onClickValidation: boolean;
  data: Login;
  constructor(private toastService: ToastService,
    private loginService: LoginService,
    private router: Router,
    private loadingService: LoadingService) {
  }

  ngOnInit(): void {
    this.onClickValidation = false;
    this.data = new Login();
  }

  async forgot(form: any): Promise<any> {
    this.onClickValidation = !form.valid;
    if (!form.valid) {
      return;
    }
    if (!this.data.isValidForgotPasswordRequest(form)) {
      return;
    }
    try {
      this.loadingService.show();
      const data: RestResponse = await this.loginService.forgotPassword(this.data);
      this.loadingService.hide();
      if (!data.status) {
        this.toastService.error(data.message);
        return;
      }
      this.toastService.success(data.message);
      setTimeout(() => {
        this.router.navigate(['/account/login']);
      });
    } catch (e: any) {
      this.loadingService.hide();
      this.toastService.error(e.message);
    }
  }
}
