import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';

import { 
  PageNotFoundComponent, 
  NavbarComponent, 
  MaterialsComponent 
} from './components/';
import { WebviewDirective } from './directives/';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [PageNotFoundComponent, WebviewDirective, NavbarComponent, MaterialsComponent],
  imports: [CommonModule, TranslateModule, FormsModule, RouterModule],
  exports: [TranslateModule, WebviewDirective, FormsModule, NavbarComponent, MaterialsComponent]
})
export class SharedModule {}
