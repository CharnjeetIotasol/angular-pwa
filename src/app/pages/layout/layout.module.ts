import { AgmCoreModule } from '@agm/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { AgmOverlays } from "agm-overlays";
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { HttpLoaderFactory } from 'src/app/app.module';
import { MaterialAppModule } from 'src/app/material.module';
import { SharedModuleModule } from 'src/app/shared/shared-module.module';
import { ChangePasswordComponent } from '../change-password/change-password.component';
import { LandingComponent } from '../landing/landing.component';
import { ProfileComponent } from '../profile/profile.component';
import { LayoutComponent } from './layout.component';
import { LAYOUTROUTING } from './layout.routing';

@NgModule({
	declarations: [
		LayoutComponent,
		LandingComponent,
		ProfileComponent,
		ChangePasswordComponent
	],
	imports: [
		CommonModule,
		FormsModule,
		MaterialAppModule,
		SharedModuleModule,
		TranslateModule.forChild({
			loader: {
				provide: TranslateLoader,
				useFactory: HttpLoaderFactory,
				deps: [HttpClient]
			}
		}),
		RouterModule.forChild(LAYOUTROUTING),
		AgmOverlays,
		AgmCoreModule.forRoot({
			apiKey: 'AIzaSyApoDaDS76qQ-1hMuVMIOx63AwSW85EZhE'
		}),
		GooglePlaceModule
	],
	providers: [
	]
})
export class LayoutModule {
}
