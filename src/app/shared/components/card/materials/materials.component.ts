import { Component, Input } from '@angular/core';
import { classroom_v1 } from 'googleapis';

@Component({
  selector: 'card-materials',
  templateUrl: './materials.component.html',
  styleUrls: ['./materials.component.scss']
})
export class MaterialsComponent {
  @Input() materials: classroom_v1.Schema$Material[];
  
  constructor() { }
}
