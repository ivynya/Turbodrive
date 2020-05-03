import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClassRoutingModule } from './class-routing.module';

import { ClassComponent } from './class.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [ClassComponent],
  imports: [CommonModule, SharedModule, ClassRoutingModule]
})
export class ClassModule {}
