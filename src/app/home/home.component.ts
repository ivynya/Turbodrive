import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { google, classroom_v1 } from 'googleapis';
import { ElectronService } from '../core/services';

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

  constructor(private router: Router,
              private electron: ElectronService) { }

  ngOnInit(): void {
    // If cached, load data
    if (this.electron.ipcRenderer.sendSync('store-has', "courses")) {
      this.courses = this.electron.ipcRenderer.sendSync('store-get', "courses");
    }
    if (this.electron.ipcRenderer.sendSync('store-has', "courseData")) {
      this.courseData = this.electron.ipcRenderer.sendSync('store-get', "courseData");
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
        this.electron.ipcRenderer.sendSync('store-set', "courses", rcourses);

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
            this.electron.ipcRenderer.sendSync('store-set', "courseData", this.courseData);
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
            this.electron.ipcRenderer.sendSync('store-set', "courseData", this.courseData);
          });
        });
      } else {
        console.log('No courses found.');
      }
    });
  }
}
