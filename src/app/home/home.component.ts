import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../core/services';
import { classroom_v1 } from 'googleapis';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  courses: classroom_v1.Schema$Course[];
  courseData: { [id: string]: {
    announcements: classroom_v1.Schema$Announcement[];
    assignments: classroom_v1.Schema$CourseWork[];
  }} = {};

  constructor(private router: Router,
              private data: DataService) { }

  ngOnInit(): void {
    // Subscribe to courses
    this.data.subscribeCourses((data) => {
      this.courses = data.courses;
    }, true);

    // Subscribe to course data
    this.data.subscribeCourseDataAll((data) => {
      this.courseData = data;
    }, true);
  }
}
