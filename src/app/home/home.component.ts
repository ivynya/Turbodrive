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
  announcements: { [id: string] : classroom_v1.Schema$Announcement[] } = {};

  constructor(private router: Router) { }

  ngOnInit(): void {
    const store = new Store();

    // If cached, load data
    if (store.has("courses")) {
      this.courses = store.get("courses");
    }
    if (store.has("announcements")) {
      this.announcements = store.get("announcements");
    }

    // Update courses from API
    const classroom = google.classroom({version: 'v1'});
    classroom.courses.list({
      courseStates: ["ACTIVE"]
    }, (err, res) => {
      if (err) return console.error(err);

      const rcourses = res.data.courses;
      if (rcourses && rcourses.length) {
        this.courses = rcourses;
        // Get announcements for each course
        this.courses.forEach((course) => {
          classroom.courses.announcements.list({
            courseId: course.id,
            orderBy: "updateTime",
            pageSize: 5
          }, (err, res) => {
            if (err) return console.error(err);
            this.announcements[course.id] = res.data.announcements;
            this.announcements[course.id].forEach(a => {
              a.creationTime = a.creationTime.slice(0, 10);
            });

            store.set("announcements", this.announcements);
          });
        });

        store.set("courses", res.data.courses);
      } else {
        console.log('No courses found.');
      }
    });
  }
}
