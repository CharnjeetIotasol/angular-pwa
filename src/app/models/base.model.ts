import { TranslateService } from '@ngx-translate/core';
import { CommonUtil } from '../shared/common.util';
import { ToastService } from '../shared/toast.service';

export abstract class BaseModel {
    id: string;
    createdOn: Date;
    updatedOn: Date;
    isDeleted: boolean;
    isActive: boolean;
    createdBy: number;
    updatedBy: number;
    totalCount: number;

    constructor() {
        this.isDeleted = false;
        this.isActive = true;
    }

    isNullOrUndefinedAndEmpty(name: string) {
        return CommonUtil.isNullOrUndefined(name) || name.trim() === '';
    }

    abstract isValidateRequest(form: any, toastService: ToastService, translate: TranslateService): boolean;

    abstract forRequest(): any;

    trimMe(val: string) {
        return CommonUtil.isNullOrUndefined(val) ? val : val.trim();
    }

    convertCalToDate(val: any) {
        return CommonUtil.isNullOrUndefined(val) ? val : val.jsdate;
    }
}
