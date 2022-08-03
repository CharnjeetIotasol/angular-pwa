import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AppUpdateService } from 'src/services/app-update.service';
import { AuthService } from './shared/auth.services';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'angular-pwa';
  deferredPrompt: any;
  showButton = false;
  logoPath: string;
  constructor(private translate: TranslateService,
    private appUpdateService: AppUpdateService,
    public authService: AuthService) {
    translate.setDefaultLang('en');

    if (this.authService.isPartnerUser()) {
      const partnerDetail = this.authService.getPartnerDetail();
      if (partnerDetail) {
        document.documentElement.style.setProperty('--theme-custom-primary', partnerDetail.primaryColor);
        document.documentElement.style.setProperty('--theme-site-primary', partnerDetail.primaryColor);
      }
    } else {
      document.documentElement.style.setProperty('--theme-custom-primary', '#1e006d');
      document.documentElement.style.setProperty('--theme-site-primary', '#ee8264');
    }
  }

  ngOnInit(): void {
    this.appUpdateService.checkForUpdate();
  }

  // @HostListener('window:beforeinstallprompt', ['$event'])
  // onbeforeinstallprompt(e: any) {
  //   e.preventDefault();
  //   this.deferredPrompt = e;
  //   this.showButton = true;
  // }

  // addToHomeScreen() {
  //   this.showButton = false;
  //   // Show the prompt
  //   this.deferredPrompt.prompt();
  //   // Wait for the user to respond to the prompt
  //   this.deferredPrompt.userChoice
  //     .then((choiceResult: any) => {
  //       if (choiceResult.outcome === 'accepted') {
  //         console.log('User accepted the A2HS prompt');
  //       } else {
  //         console.log('User dismissed the A2HS prompt');
  //       }
  //       this.deferredPrompt = null;
  //     });
  // }
}
