import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DetailsPage } from './details.page';
import { DetailsPageRoutingModule } from './details-routing.module';
import {CommonModule} from "@angular/common";

@NgModule({
  imports: [CommonModule, DetailsPageRoutingModule],
  declarations: [DetailsPage],
  exports: [RouterModule]
})
export class DetailsPageModule {}
