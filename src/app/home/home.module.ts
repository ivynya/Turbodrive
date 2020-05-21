import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';

import { HomeComponent } from './home.component';
import { SharedModule } from '../shared/shared.module';

import { DueDateTimePipe } from '../shared/pipes/due-date-time.pipe';

@NgModule({
  declarations: [HomeComponent, DueDateTimePipe],
  imports: [CommonModule, SharedModule, HomeRoutingModule]
})
export class HomeModule {}
