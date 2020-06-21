import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService, StorageService } from '../core/services';
import { Turbo$Announcement, Turbo$CourseWork, Turbo$Course } from '../core/schemas';
import { WriteKeyExpr } from '@angular/compiler';

@Component({
  selector: 'app-class',
  templateUrl: './class.component.html',
  styleUrls: ['./class.component.scss']
})
export class ClassComponent implements OnInit {
  course: Turbo$Course;
  feed: Array<Turbo$Announcement|Turbo$CourseWork> = [];
  late: Array<Turbo$CourseWork> = [];

  constructor(private activatedRoute: ActivatedRoute,
              private data: DataService,
              private storage: StorageService) {}

  ngOnInit(): void {
    if (this.storage.has("courses")) {
      const courses: Turbo$Course[] = this.storage.get("courses");

      this.activatedRoute.params.subscribe(params => {
        this.course = courses.find((c) => c.id === params.id);

        this.data.subscribeCourseData(this.course.id, (data) => {
          // Reset feed
          this.feed = [];
          // Concatenates all items, sorts by updateTime descending
          this.feed = this.feed.concat(data.announcements);
          this.feed = this.feed.concat(data.assignments);
          this.feed = this.feed.sort((a, b) => { 
            return (a.updateTime < b.updateTime) ? 1 : -1
          });

          this.generateLateFeed(data.assignments);
        }, true);

        this.data.tryMarkCourseRead(this.course.id);
      });
    }
  }

  generateLateFeed(assignments: Turbo$CourseWork[]) {
    // Generate late work feed
    this.late = assignments.filter((work) => {
      if (!work.dueDate) return false;

      const wd = new Date();
      wd.setUTCFullYear(work.dueDate.year, work.dueDate.month, work.dueDate.day);
      wd.setUTCHours(work.dueTime.hours);
      wd.setUTCMinutes(work.dueTime.minutes ?? 0);
      wd.setUTCSeconds(0);

      return (wd < new Date() && !work.read);
    });
  }
  
  markAsRead(courseId: string, type: string, id: string): void {
    this.data.markRead(courseId, type, id);
  }
}
