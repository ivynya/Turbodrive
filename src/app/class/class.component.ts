import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { classroom_v1 } from 'googleapis';
import { DataService, StorageService } from '../core/services';
import { Schema$CourseData } from '../core/schemas';

@Component({
  selector: 'app-class',
  templateUrl: './class.component.html',
  styleUrls: ['./class.component.scss']
})
export class ClassComponent implements OnInit {
  course: classroom_v1.Schema$Course;
  feed: Array<classroom_v1.Schema$Announcement|classroom_v1.Schema$CourseWork> = [];

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
              // Reset feed
              this.feed = [];
              // Concatenates all items, sorts by updateTime descending
              this.feed = this.feed.concat(data.announcements);
              this.feed = this.feed.concat(data.assignments);
              this.feed = this.feed.sort((a, b) => { 
                return (a.updateTime < b.updateTime) ? 1 : -1
              });
            }, true);
          }
        });
      });
    }
  }
}
