import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Login } from 'src/app/models/login';
import { LoadingService } from 'src/app/services/loading.service';
import { LoginService } from 'src/app/services/login.service';
import { RestResponse } from 'src/app/shared/auth.model';
import { CommonUtil } from 'src/app/shared/common.util';
import { ToastService } from 'src/app/shared/toast.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  onClickValidation: boolean;
  data: Login;
  fieldType: string;
  confirmFieldType: string;
  constructor(private toastService: ToastService,
    private loginService: LoginService,
    private router: Router,
    private loadingService: LoadingService,
    private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.onClickValidation = false;
    this.data = new Login();
    this.fieldType = "password";
    this.confirmFieldType = "password";
    this.route.queryParams.subscribe(params => {
      this.data.code = encodeURIComponent(params.p);
      this.data.uniqueCode = this.route.snapshot.params.code;
      if (CommonUtil.isNullOrUndefined(this.data.code) || this.data.code === '') {
        this.router.navigate(['404']);
      }
    });
  }

  togglePasswordField(fieldType: string) {
    if (fieldType === "PASSWORD") {
      this.fieldType = this.fieldType === "password" ? "text" : "password";
    } else if (fieldType === "C_PASSWORD") {
      this.confirmFieldType = this.confirmFieldType === "password" ? "text" : "password";
    }
  }

  async reset(form: any): Promise<any> {
    this.onClickValidation = !form.valid;
    if (!form.valid || !this.data.isValidResetPasswordRequest(form)) {
      this.onClickValidation = true;
      return;
    }
    try {
      this.loadingService.show();
      const data: RestResponse = await this.loginService.recoverPassword(this.data);
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
