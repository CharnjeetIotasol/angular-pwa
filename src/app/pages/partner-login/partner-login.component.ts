import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from 'angular-2-local-storage';
import { DataService } from 'src/app/services/data.service';
import { RestResponse } from 'src/app/shared/auth.model';
import { ToastService } from 'src/app/shared/toast.service';

@Component({
  selector: 'app-partner-login',
  templateUrl: './partner-login.component.html',
  styleUrls: ['./partner-login.component.scss']
})
export class PartnerLoginComponent implements OnInit {

  partnerId: string;
  userId: string;
  partnerDetail: any;
  constructor(private route: ActivatedRoute,
    private localStorageService: LocalStorageService,
    private dataService: DataService,
    private toastService: ToastService,
    private router: Router) { }

  ngOnInit(): void {
    this.partnerId = this.route.snapshot.params.partnerId;
    this.userId = this.route.snapshot.params.userId;
    this.fetchPartnerDetail();
  }

  fetchPartnerDetail() {
    this.dataService.fetchPartnerDetail(this.partnerId)
      .subscribe((response: RestResponse) => {
        if (!response.status) {
          this.toastService.error(response.message);
          return;
        }
        this.partnerDetail = response.data;
        document.documentElement.style.setProperty('--theme-custom-primary', this.partnerDetail.primaryColor);
        document.documentElement.style.setProperty('--theme-site-primary', this.partnerDetail.primaryColor);
        this.processLogin();
      }, (error) => {
        this.toastService.error(error.message);
      })
  }

  hasLogo() {
    return this.partnerDetail && this.partnerDetail.logo && this.partnerDetail.logo.length > 0;
  }

  processLogin() {
    this.dataService.procesPartnerUserLogin(this.partnerId, this.userId)
      .subscribe((data: RestResponse) => {
        if (!data.status) {
          this.toastService.error(data.message);
          return;
        }
        const response = data.data;
        response.token.expires_at = new Date(response.token.expires).getTime();
        this.localStorageService.set('is-partner-user', true);
        this.localStorageService.set('partner-detail', this.partnerDetail);
        if (response.user.isOnboardingCompleted) {
          this.localStorageService.set('token', response.token);
          this.localStorageService.set('user', response.user);
        } else {
          this.localStorageService.set('temp-token', response.token);
          this.localStorageService.set('temp-user', response.user);
        }
        setTimeout(() => {
          if (response.user.isOnboardingCompleted) {
            this.router.navigate(['/dashboard']);
          } else {
            this.router.navigate(['/account/onboarding']);
          }
        }, 500);
      }, (error) => {
        this.toastService.error(error.message);
      })
  }
}
