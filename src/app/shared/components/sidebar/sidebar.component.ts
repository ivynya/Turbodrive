import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { classroom_v1 } from 'googleapis';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  @Input() show: boolean = false;
  @Input() courses: classroom_v1.Schema$Course[] = [];
  
  constructor(private router: Router) { }

  toggleShow() {
    this.show = !this.show;
  }

  hide() {
    this.show = false;
  }
}
