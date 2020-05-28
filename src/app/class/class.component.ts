import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { classroom_v1 } from 'googleapis';
import { StorageService } from '../core/services';

@Component({
  selector: 'app-class',
  templateUrl: './class.component.html',
  styleUrls: ['./class.component.scss']
})
export class ClassComponent implements OnInit {
  course: classroom_v1.Schema$Course;
  courseData: {
    [id: string]: {
      announcements: classroom_v1.Schema$Announcement[];
      assignments: classroom_v1.Schema$CourseWork[];
    };
  } = {};

  constructor(private activatedRoute: ActivatedRoute,
              private storage: StorageService) {}

  ngOnInit(): void {
    let courses: any;
    if (this.storage.has("courses")) {
      courses = this.storage.get("courses");

      this.activatedRoute.params.subscribe(params => {
        this.course = courses.filter((c: classroom_v1.Schema$Course) => {
          return c.id === params.id;
        })[0];
      });
    }

    if (this.storage.has("courseData")) {
      this.courseData = this.storage.get("courseData");
    }
  }
}
