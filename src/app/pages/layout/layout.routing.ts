import { Routes } from "@angular/router";
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
      }
    ],
  },
];
