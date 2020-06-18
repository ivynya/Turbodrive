import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../../../core/services';
import { Turbo$Course } from '../../../core/schemas';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  courses: Turbo$Course[] = [];
  
  constructor(private router: Router,
              private data: DataService) { }

  ngOnInit(): void {
    this.data.subscribeCourses((data) => {
      this.courses = data;
    });
  }

  refresh(): void {
    this.courses.forEach(course => {
      this.data.updateAnnouncements(course.id);
      this.data.updateAssignments(course.id);
    });
  }
}
