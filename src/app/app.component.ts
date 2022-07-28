import { Component, HostListener, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AppUpdateService } from 'src/services/app-update.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'angular-pwa';
  deferredPrompt: any;
  showButton = false;
  constructor(private translate: TranslateService, private appUpdateService: AppUpdateService) {
    translate.setDefaultLang('en');
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
