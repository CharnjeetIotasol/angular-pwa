import { BaseModel } from "./base.model";

export class Attachment extends BaseModel {
    filename: string;
    mimeType: string;
    thumbnail: string;
    size: number;
    originalName: string;
    onServer: boolean;
    typeId: number;
    type: string;
    codeId: string;

    isValidateRequest(form: any) {
        return true;
    }

    forRequest() {
        return this;
    }
}
