import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { google, classroom_v1 } from 'googleapis';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  courses: classroom_v1.Schema$Course[];

  constructor(private router: Router) { }

  ngOnInit(): void {
    // Test works
    const classroom = google.classroom({version: 'v1'});
    classroom.courses.list({
      courseStates: ["ACTIVE"]
    }, (err, res) => {
      if (err) return console.error(err);
      const rcourses = res.data.courses;
      if (rcourses && rcourses.length) {
        console.log('Courses:');
        rcourses.forEach((course) => {
          console.log(`${course.name} ${course.section} ${course.description} ${course.descriptionHeading} ${course.room}`);
        });
        this.courses = res.data.courses;
      } else {
        console.log('No courses found.');
      }
    });
  }
}
