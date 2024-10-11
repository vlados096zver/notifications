import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {HomePageRoutingModule} from "./home-routing";
import {HomePage} from "./home.page";
import {CommonModule} from "@angular/common";


@NgModule({
  imports: [
    CommonModule,
    HomePageRoutingModule,

  ],
  declarations: [
    HomePage
  ],
  exports: [RouterModule]
})
export class HomePageModule {}
