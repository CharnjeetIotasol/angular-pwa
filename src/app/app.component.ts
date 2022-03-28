import { Component } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'angular-pwa';

  constructor(private swUpdateService: SwUpdate) {
    this.swUpdateService.checkForUpdate().then((response) => {
      console.log(response);
    })
  }
}
