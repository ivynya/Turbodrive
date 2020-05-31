import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DueDateTimePipe } from '../shared/pipes/due-date-time.pipe';

import { HomeRoutingModule } from './home-routing.module';

import { HomeComponent } from './home.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [DueDateTimePipe, HomeComponent],
  imports: [CommonModule, SharedModule, HomeRoutingModule]
})
export class HomeModule {}
