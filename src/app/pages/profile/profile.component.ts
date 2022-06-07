import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FileLikeObject, FileUploader } from 'ng2-file-upload';
import { Login } from 'src/app/models/login';
import { DataService } from 'src/app/services/data.service';
import { LoadingService } from 'src/app/services/loading.service';
import { MapService } from 'src/app/services/map.service';
import { RestResponse } from 'src/app/shared/auth.model';
import { AuthService } from 'src/app/shared/auth.services';
import { FileCropperComponent } from 'src/app/shared/file-cropper/file-cropper.component';
import { ToastService } from 'src/app/shared/toast.service';
import { environment } from 'src/environments/environment';
@Component({
	selector: 'app-profile',
	templateUrl: './profile.component.html',
	styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

	user: Login;
	onClickValidation: boolean;
	@Output()
	completeEvent = new EventEmitter<any>();
	profilePicUploader: FileUploader;
	@ViewChild('profilePicUploaderElement') profilePicUploaderElement: ElementRef<HTMLElement>;
	isOpenCropPopup: boolean;

	constructor(private loadingService: LoadingService,
		private toastService: ToastService,
		private mapService: MapService,
		private dataService: DataService,
		private authService: AuthService,
		public dialog: MatDialog) { }

	ngOnInit(): void {
		this.isOpenCropPopup = false;
		this.profilePicUploader = this.initializeUploader('PROFILE_PIC', '.jpg,.jpeg,.png', 10240, 1, this.toastService);
		this.fetchMyDetail();
	}

	initializeUploader(type: string, allowedExtensions: string, maxFileSize: number, aspectRatio: number, toastService: ToastService) {
		const uploaderOptions = {
			url: environment.BaseApiUrl + '/api/file/group/items/upload',
			autoUpload: true,
			maxFileSize: maxFileSize * 1024,
			filters: new Array<any>()
		};
		if (allowedExtensions !== '') {
			uploaderOptions.filters.push({
				name: 'extension',
				fn: (item: any): boolean => {
					const fileExtension = item.name.slice(item.name.lastIndexOf('.') + 1).toLowerCase();
					return allowedExtensions.indexOf(fileExtension) !== -1;
				}
			});
		}
		const uploader = new FileUploader(uploaderOptions);
		uploader.onAfterAddingFile = (item => {
			item.withCredentials = false;
		});

		uploader.onWhenAddingFileFailed = (item: FileLikeObject, filter: any, options: any) => {
			switch (filter.name) {
				case 'fileSize':
					toastService.error('File size to too large');
					break;
				case 'extension':
					toastService.error('Only ' + allowedExtensions + " file extensions are allowed");
					break;
				default:
					toastService.error('Unknown error');
			}
		};
		uploader.onSuccessItem = (fileItem, response) => {
			const uploadResponse = JSON.parse(response);
			if (uploadResponse.length > 0) {
				this.user.profilePic = uploadResponse[0].path;
				this.saveProfile();
			}
		};

		return uploader;
	}

	fetchMyDetail() {
		this.user = new Login();
		this.loadingService.show();
		this.dataService.fetchMyDetail()
			.subscribe((response: RestResponse) => {
				this.loadingService.hide();
				if (!response.status) {
					this.toastService.error(response.message);
					return;
				}
				this.user = response.data;
				this.user.uiAddress = this.user.address;
			}, (error) => {
				this.loadingService.hide();
				this.toastService.error(error.message);
			});
	}

	onAddressChange(address: any) {
		this.user.address = address.formatted_address;
	}

	updateProfile(form: any) {
		this.onClickValidation = !form.valid;
		if (!form.valid) {
			return;
		}
		this.saveProfile();
	}

	saveProfile() {
		this.loadingService.show();
		const names = this.user.fullName.split(" ");
		this.user.firstName = this.user.fullName;
		if (names.length === 2) {
			this.user.firstName = names[0];
			this.user.lastName = names[1];
		}
		this.dataService.updateMyDetail(this.user)
			.then((data: RestResponse) => {
				this.loadingService.hide();
				if (!data.status) {
					this.toastService.error(data.message);
					return;
				}
			}, (e: any) => {
				this.loadingService.hide();
				this.toastService.error(e.message);
			});
	}

	onChangePassword() {
		this.completeEvent.emit({ "status": "CHANGE_PASSWORD_REQUESTED", "messgae": "" });
	}

	onInterest() {
		this.completeEvent.emit({ "status": "INTEREST_REQUESTED", "messgae": "" });
	}

	logout() {
		this.authService.logout();
	}

	openFileUploaderPopup() {
		const el: HTMLElement = this.profilePicUploaderElement.nativeElement;
		el.click();
	}

	onFileChangeEvent($event: any) {
		let hasOtherFileError = false;
		for (let index = 0; index < $event.target.files.length; index++) {
			const file = $event.target.files[index];
			const fileExtension = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
			if ('.jpg,.jpeg,.png'.indexOf(fileExtension) === -1) {
				hasOtherFileError = true;
				break;
			}
		}
		if (hasOtherFileError) {
			this.toastService.error('Sorry, only image file is support.');
			return;
		}
		const fileData = {} as any;
		fileData.files = $event.target.files;
		this.isOpenCropPopup = true;
		const dialogRef = this.dialog.open(FileCropperComponent, {
			width: '600px',
			data: fileData
		});
		dialogRef.afterClosed().subscribe(result => {
			if (!result) {
				return;
			}
			this.isOpenCropPopup = false;
			this.profilePicUploader.addToQueue(result);
			this.profilePicUploader.uploadAll();
			setTimeout(() => {
				this.isOpenCropPopup = false;
			}, 200);
		});
	}
}
