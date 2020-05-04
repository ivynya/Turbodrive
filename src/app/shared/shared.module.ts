import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';

import { PageNotFoundComponent } from './components/';
import { NavbarComponent } from './components/';
import { WebviewDirective } from './directives/';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [PageNotFoundComponent, WebviewDirective, NavbarComponent],
  imports: [CommonModule, TranslateModule, FormsModule, RouterModule],
  exports: [TranslateModule, WebviewDirective, FormsModule, NavbarComponent]
})
export class SharedModule {}
