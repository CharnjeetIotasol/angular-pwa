import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpLoaderFactory } from 'src/app/app.module';
import { MaterialAppModule } from 'src/app/material.module';
import { SharedModuleModule } from 'src/app/shared/shared-module.module';
import { LandingComponent } from '../landing/landing.component';
import { LayoutComponent } from './layout.component';
import { LAYOUTROUTING } from './layout.routing';
import { AgmOverlays } from "agm-overlays"
import { AgmCoreModule } from '@agm/core';

@NgModule({
	declarations: [
		LayoutComponent,
		LandingComponent
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
	],
	providers: [
	]
})
export class LayoutModule {
}
