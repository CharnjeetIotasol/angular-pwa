import { CommonUtil } from "../shared/common.util";

export class Login {
  userName: string;
  email: string;
  password: string;

  constructor() {
  }

  isValidLoginRequest(form: any) {
    if (CommonUtil.isNullOrUndefined(this.email) || this.email.trim() === '') {
      form.controls.username.setErrors({ invalid: true });
      return false;
    }
    if (CommonUtil.isNullOrUndefined(this.password) || this.password.trim() === '') {
      form.controls.password.setErrors({ invalid: true });
      return false;
    }
    return true;
  }

  isValidForgotPasswordRequest(form: any) {
    if (CommonUtil.isNullOrUndefined(this.email) || this.email.trim() === '') {
      form.controls.remail.setErrors({ invalid: true });
      return false;
    }
    return true;
  }
}
