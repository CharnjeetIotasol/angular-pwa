import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpLoaderFactory } from '../app.module';
import { OnboardingComponent } from '../pages/onboarding/onboarding.component';
import { ValidationMessageComponent } from './validation-message/validation-message.component';



@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
  ],
  declarations: [
    ValidationMessageComponent,
    OnboardingComponent
  ],
  exports: [
    ValidationMessageComponent,
    OnboardingComponent
  ],
})
export class SharedModuleModule { }
