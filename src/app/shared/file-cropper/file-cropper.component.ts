import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { CommonUtil } from '../common.util';
import { ImageValidateService } from '../image-validate.service';

declare const $: any;

@Component({
  selector: 'app-file-cropper',
  templateUrl: './file-cropper.component.html',
  styleUrls: ['./file-cropper.component.scss']
})
export class FileCropperComponent implements OnInit {

  request: any;
  isOpenCrop: boolean;
  hasCropped: boolean;

  constructor(public dialogRef: MatDialogRef<FileCropperComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private imageValidateService: ImageValidateService) {
    this.request = {} as any;
    this.isOpenCrop = false;
  }

  ngOnInit() {
    this.init();
  }

  async init() {
    this.request = {} as any;
    this.isOpenCrop = true;
    this.hasCropped = false;
    if (CommonUtil.isNullOrUndefined(this.data.files)) {
      this.data.files = new Array<any>();
    }
    let hasImageFile = false;
    for (let index = 0; index < this.data.files.length; index++) {
      const file = this.data.files[index];
      if (this.imageValidateService.validImageTypes.includes(file.type)) {
        hasImageFile = true;
      }
    }
    for (let index = 0; index < this.data.files.length; index++) {
      if (this.imageValidateService.validImageTypes.includes(this.data.files[index].type)) {
        const fileReader = new FileReader();
        fileReader.onload = (e: any) => {
          this.data.files[index].base64 = e.target.result;
          this.request.imageBase64 = this.data.files[0].base64;
        };
        fileReader.readAsDataURL(this.data.files[index]);
      }
    }
    this.request.selectedIndex = 0;
  }

  selectCropFile(index: number) {
    this.request.imageBase64 = this.data.files[index].base64;
    this.request.selectedIndex = index;
  }

  upload() {
    this.data.files[this.request.selectedIndex].base64 = this.request.croppedImage;
    this.request.imageBase64 = this.request.croppedImage;
    this.hasCropped = true;
    this.uploadImages();
  }

  applyCrop() {

  }

  imageCropped(event: ImageCroppedEvent) {
    this.request.croppedImage = event.base64;
  }

  async uploadImages() {
    this.isOpenCrop = false;
    const files = new Array<any>();
    for (let index = 0; index < this.data.files.length; index++) {
      if (this.imageValidateService.validImageTypes.includes(this.data.files[index].type)) {
        files.push(this.imageValidateService.base64ToFile(this.data.files[index]));
      } else {
        files.push(this.data.files[index]);
      }
    }
    this.dialogRef.close(files);
  }

  async close() {
    this.isOpenCrop = false;
    this.dialogRef.close();
  }
}
