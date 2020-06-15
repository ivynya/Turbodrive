import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { classroom_v1 } from 'googleapis';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  @Input() courses: classroom_v1.Schema$Course[] = [];
  show = false;
  
  constructor(private router: Router) { }

  toggleShow(): void {
    this.show = !this.show;
  }

  hide(): void {
    this.show = false;
  }
  
  stopPropagation(event: Event): void {
    event.stopPropagation();
  }
}
