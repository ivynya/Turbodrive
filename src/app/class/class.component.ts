import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { classroom_v1 } from 'googleapis';
import { DataService, StorageService } from '../core/services';

@Component({
  selector: 'app-class',
  templateUrl: './class.component.html',
  styleUrls: ['./class.component.scss']
})
export class ClassComponent implements OnInit {
  course: classroom_v1.Schema$Course;
  courseData: { [id: string]: {
    announcements: classroom_v1.Schema$Announcement[];
    assignments: classroom_v1.Schema$CourseWork[];
  };} = {};

  constructor(private activatedRoute: ActivatedRoute,
              private data: DataService,
              private storage: StorageService) {}

  ngOnInit(): void {
    if (this.storage.has("courses")) {
      const courses = this.storage.get("courses");

      this.activatedRoute.params.subscribe(params => {
        courses.forEach(course => {
          if (course.id === params.id) {
            this.course = course;

            this.data.subscribeCourseData(this.course.id, (data) => {
              this.courseData[this.course.id] = data;
            }, true);
          }
        });
      });
    }
  }
}
