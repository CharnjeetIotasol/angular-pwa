import { Routes } from "@angular/router";
import { ChangePasswordComponent } from "../change-password/change-password.component";
import { LandingComponent } from "../landing/landing.component";
import { LayoutComponent } from "./layout.component";

export const LAYOUTROUTING: Routes = [
  {
    path: "",
    component: LayoutComponent,
    children: [
      {
        path: "",
        component: LandingComponent
      },
      {
        path: "change/password",
        component: ChangePasswordComponent
      }
    ],
  },
];
