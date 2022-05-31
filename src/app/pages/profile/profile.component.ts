import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Login } from 'src/app/models/login';
import { DataService } from 'src/app/services/data.service';
import { LoadingService } from 'src/app/services/loading.service';
import { MapService } from 'src/app/services/map.service';
import { RestResponse } from 'src/app/shared/auth.model';
import { ToastService } from 'src/app/shared/toast.service';

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
  constructor(private loadingService: LoadingService,
    private toastService: ToastService,
    private mapService: MapService,
    private dataService: DataService) { }

  ngOnInit(): void {
    this.fetchMyDetail();
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
        this.user = data.data;
      }, (e: any) => {
        this.loadingService.hide();
        this.toastService.error(e.message);
      });
  }

  onChangePassword() {
    this.completeEvent.emit({ "status": "CHANGE_PASSWORD_REQUESTED", "messgae": "" });
  }
}
