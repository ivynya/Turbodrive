import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../core/services';
import { Turbo$CourseData, Turbo$Course } from '../core/schemas';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  courses: Turbo$Course[];
  courseData: { [id: string]: Turbo$CourseData } = {};

  constructor(private router: Router,
              private data: DataService) { }

  ngOnInit(): void {
    // Subscribe to courses
    this.data.subscribeCourses((data) => {
      this.courses = data;
    }, true);

    // Subscribe to course data
    this.data.subscribeCourseDataAll((data) => {
      Object.keys(data).forEach((key: string) => {
        // Set announcements to only be unread ones
        data[key].announcements = data[key].announcements?.filter((a) => {
          return !a.read; });
        // Set assignments to only be unread ones
        data[key].assignments = data[key].assignments?.filter((a) => {
          return !a.read; });
      });

      // Update this.courseData with filtered data
      this.courseData = data;
    }, true);
  }

  markAsRead(courseId: string, type: string, id: string): void {
    this.data.markRead(courseId, type, id);
  }

  markAllRead(courseId: string, type: string, num: number): void {
    this.data.markAllRead(courseId, type, num);
  }
}
