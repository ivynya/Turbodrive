import { Component, Input } from '@angular/core';
import { Turbo$Course } from '../../core/schemas';

@Component({
  selector: 'home-class-bar',
  templateUrl: './class-bar.component.html',
  styleUrls: ['./class-bar.component.scss']
})
export class ClassBarComponent {
  @Input() courses: Turbo$Course[];

  constructor() { }
}
