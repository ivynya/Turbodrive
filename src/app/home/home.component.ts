import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../core/services';
import { classroom_v1 } from 'googleapis';
import { Turbo$CourseData } from '../core/schemas';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  courses: classroom_v1.Schema$Course[];
  courseData: { [id: string]: Turbo$CourseData } = {};

  constructor(private router: Router,
              private data: DataService) { }

  ngOnInit(): void {
    // Subscribe to courses
    this.data.subscribeCourses((data) => {
      this.courses = data.courses;
    }, true);

    // Subscribe to course data
    this.data.subscribeCourseDataAll((data) => {
      // Set announcements to only be unread ones
      Object.keys(data).forEach((key: string) => {
        data[key].announcements = data[key].announcements.filter((a) => {
          return !a.read; });
      });

      // Update this.courseData with filtered data
      this.courseData = data;
    }, true);
  }

  markAsRead(courseId: string, type: string, id: string): void {
    this.data.markRead(courseId, type, id);
  }

  markAllRead(courseId: string, type: string): void {
    this.data.markAllRead(courseId, type, 2);
  }
}
