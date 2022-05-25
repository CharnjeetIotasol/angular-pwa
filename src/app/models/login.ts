import { CommonUtil } from "../shared/common.util";

export class Login {
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  userName: string;
  googleId: string;
  facebookId: string;
  linkedinId: string;
  password: string;
  confirmPassword: string;
  address: string;
  code: string;
  uniqueCode: string;
  uiAddress: string;
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

  isValidResetPasswordRequest(form: any) {
    if (CommonUtil.isNullOrUndefined(this.password) || this.password.trim() === '') {
      form.controls.userPassword.setErrors({ invalid: true });
      return false;
    }
    if (CommonUtil.isNullOrUndefined(this.confirmPassword) || this.confirmPassword.trim() === '') {
      form.controls.userCofirmPassword.setErrors({ invalid: true });
      return false;
    }
    if (this.password && this.confirmPassword && this.confirmPassword !== this.password) {
      form.controls.userCofirmPassword.setErrors({ invalid: true });
      return false;
    }
    return true;
  }

  isValidRegisterRequest(form: any) {
    if (CommonUtil.isNullOrUndefined(this.name) || this.name.trim() === '') {
      form.controls.userName.setErrors({ required: true });
      return false;
    }
    if (CommonUtil.isNullOrUndefined(this.email) || this.email.trim() === '') {
      form.controls.userEmail.setErrors({ required: true });
      return false;
    }
    if (CommonUtil.isNullOrUndefined(this.address) || this.address.trim() === '') {
      form.controls.userAddress.setErrors({ required: true });
      return false;
    }
    if (CommonUtil.isNullOrUndefined(this.password) || this.password.trim() === '') {
      form.controls.userPassword.setErrors({ required: true });
      return false;
    }
    if (CommonUtil.isNullOrUndefined(this.confirmPassword) || this.confirmPassword.trim() === '') {
      form.controls.userConfirmPassword.setErrors({ required: true });
      return false;
    }
    if (this.password && this.confirmPassword && this.password !== this.confirmPassword) {
      form.controls.userConfirmPassword.setErrors({ required: true });
      return false;
    }
    return true;
  }
}
