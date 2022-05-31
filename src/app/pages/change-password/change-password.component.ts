import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Login } from 'src/app/models/login';
import { LoadingService } from 'src/app/services/loading.service';
import { LoginService } from 'src/app/services/login.service';
import { RestResponse } from 'src/app/shared/auth.model';
import { ToastService } from 'src/app/shared/toast.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  onClickValidation: boolean;
  data: Login;
  fieldType: string;
  confirmFieldType: string;
  currentFieldType: string;
  @Output()
  completeEvent = new EventEmitter<any>();
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
    this.currentFieldType = "password";
  }

  togglePasswordField(fieldType: string) {
    if (fieldType === "PASSWORD") {
      this.fieldType = this.fieldType === "password" ? "text" : "password";
    } else if (fieldType === "C_PASSWORD") {
      this.confirmFieldType = this.confirmFieldType === "password" ? "text" : "password";
    } else if (fieldType === "CURRENT_PASSWORD") {
      this.currentFieldType = this.currentFieldType === "password" ? "text" : "password";
    }
  }

  async save(form: any): Promise<any> {
    this.onClickValidation = !form.valid;
    if (!form.valid || !this.data.isValidChangePasswordRequest(form)) {
      this.onClickValidation = true;
      return;
    }
    try {
      this.loadingService.show();
      const data: RestResponse = await this.loginService.changePassword(this.data);
      this.loadingService.hide();
      if (!data.status) {
        this.toastService.error(data.message);
        return;
      }
      this.toastService.success(data.message);
      this.completeEvent.emit({ "status": "COMPLETED", "messgae": "" });
    } catch (e: any) {
      this.loadingService.hide();
      this.toastService.error(e.message);
    }
  }
}
