import { TranslateService } from '@ngx-translate/core';
import { ToastService } from '../shared/toast.service';
import { Attachment } from './attachment';
import { BaseModel } from './base.model';

export class Category extends BaseModel {

	tenantId: number;
	slug: string;
	name: string;
	description: string;
	icon: Array<Attachment>;

	constructor() {
		super();
		this.isDeleted = false;
		this.isActive = true;
		this.icon = new Array<Attachment>();
	}

	static fromResponse(data: any): Category {
		const obj = new Category();
		obj.id = data.id;
		obj.tenantId = data.tenantId;
		obj.slug = data.slug;
		obj.createdBy = data.createdBy;
		obj.updatedBy = data.updatedBy;
		obj.createdOn = data.createdOn;
		obj.updatedOn = data.updatedOn;
		obj.isDeleted = data.isDeleted;
		obj.isActive = data.isActive;
		obj.name = data.name;
		obj.description = data.description;
		obj.icon = data.icon;
		return obj;
	}

	isValidateRequest(form: any, toastService: ToastService, translate: TranslateService) {
		return true;
	}

	forRequest() {
		this.name = this.trimMe(this.name);
		this.description = this.trimMe(this.description);
		return this;
	}
}
