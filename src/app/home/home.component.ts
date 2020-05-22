import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { google, classroom_v1 } from 'googleapis';
import * as Store from 'electron-store';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  courses: classroom_v1.Schema$Course[];
  courseData: {
    [id: string]: {
      announcements: classroom_v1.Schema$Announcement[];
      assignments: classroom_v1.Schema$CourseWork[];
    };
  } = {};

  constructor(private router: Router) { }

  ngOnInit(): void {
    const store = new Store();

    // If cached, load data
    if (store.has("courses")) {
      this.courses = store.get("courses");
    }
    if (store.has("courseData")) {
      this.courseData = store.get("courseData");
    }

    // Update courses from API
    const classroom = google.classroom({version: 'v1'});
    classroom.courses.list({
      courseStates: ["ACTIVE"]
    }, (err, res) => {
      if (err) return console.error(err);

      const rcourses = res.data.courses;
      if (rcourses && rcourses.length) {
        // Define and cache courses
        this.courses = rcourses;
        store.set("courses", this.courses);

        // Get courseData
        rcourses.forEach((course) => {
          // Initialize if null
          if (!this.courseData[course.id]) {
            this.courseData[course.id] = { 
               announcements: [],
               assignments: []
            };
          }

          // Get announcements for each course
          classroom.courses.announcements.list({
            courseId: course.id,
            orderBy: "updateTime",
            pageSize: 5
          }, (err, res) => {
            if (err) return console.error(err);
            this.courseData[course.id].announcements = res.data.announcements;

            // Cache data
            store.set("courseData", this.courseData);
          });
            
          // Get coursework
          classroom.courses.courseWork.list({
            courseId: course.id,
            orderBy: "updateTime",
            pageSize: 5
          }, (err, res) => {
            if (err) return console.error(err);
            this.courseData[course.id].assignments = res.data.courseWork;

            // Cache data
            store.set("courseData", this.courseData);
          });
        });
      } else {
        console.log('No courses found.');
      }
    });
  }
}
