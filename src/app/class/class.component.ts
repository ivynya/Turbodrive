import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService, StorageService } from '../core/services';
import { Turbo$Announcement, Turbo$CourseWork, Turbo$Course, Turbo$CourseData } from '../core/schemas';

enum FeedType {
  Stream,
  Announcements,
  Assignments,
  Topics
}

@Component({
  selector: 'app-class',
  templateUrl: './class.component.html',
  styleUrls: ['./class.component.scss']
})
export class ClassComponent implements OnInit {
  course: Turbo$Course;

  courseData: Turbo$CourseData;
  feed: Array<Turbo$Announcement|Turbo$CourseWork> = [];
  feedType: FeedType = FeedType.Stream;

  upcoming: Turbo$CourseWork[] = [];
  late: Turbo$CourseWork[] = [];

  constructor(private activatedRoute: ActivatedRoute,
              private data: DataService,
              private storage: StorageService) {}

  ngOnInit(): void {
    if (this.storage.has("courses")) {
      const courses: Turbo$Course[] = this.storage.get("courses");

      this.activatedRoute.params.subscribe(params => {
        // Try and find requested course
        this.course = courses.find((c) => c.id === params.id);
        if (!this.course) return;

        this.data.subscribeCourseData(this.course.id, (data) => {
          this.courseData = data;

          this.updateFeed(data);
          this.generateLateFeed(data.assignments);
        }, true);
      });
    }
  }

  setFeedType(type: number): void {
    document.getElementById(`ft-${this.feedType}`).classList.remove("active");
    document.getElementById(`ft-${type}`).classList.add("active");

    this.feedType = type;
    if (this.courseData)
      this.updateFeed(this.courseData);
  }

  // Update main feed based on current feed type
  updateFeed(data: Turbo$CourseData): void {
    // Reset feed
    this.feed = [];

    // Call appropriate function for each type
    switch (this.feedType) {
      case FeedType.Stream:
        this.generateStream(data);
        this.data.tryMarkCourseRead(this.course.id);
        break;
      case FeedType.Announcements:
        this.generateAnnouncements(data.announcements);
        this.data.tryMarkCourseRead(this.course.id);
        break;
      case FeedType.Assignments:
        this.generateAssignments(data.assignments);
        break;
      case FeedType.Topics:
        break;
    }
  }

  // Generates a feed with announcements only
  generateAnnouncements(announcements: Turbo$Announcement[]): void {
    this.feed = announcements;
  }
  
  // Generates a feed with assignments only
  generateAssignments(assignments: Turbo$CourseWork[]): void {
    this.feed = assignments;
  }

  // Generates a feed with all announcements and assignments
  generateStream(data: Turbo$CourseData): void {
    // Concatenates all items, sorts by updateTime descending
    this.feed = this.feed.concat(data.announcements);
    this.feed = this.feed.concat(data.assignments);
    this.feed = this.feed.sort((a, b) => { 
      return (a.updateTime < b.updateTime) ? 1 : -1
    });
  }

  generateUpcomingFeed(assignments: Turbo$CourseWork[]): void {
    // Generate late work feed
    this.late = assignments.filter((work) => {
      if (!work.dueDate) return false;

      const wd = new Date();
      wd.setUTCFullYear(work.dueDate.year, work.dueDate.month - 1, work.dueDate.day);
      wd.setUTCHours(work.dueTime.hours);
      wd.setUTCMinutes(work.dueTime.minutes ?? 0);
      wd.setUTCSeconds(0);

      return (wd > new Date() && !work.read);
    });
  }

  generateLateFeed(assignments: Turbo$CourseWork[]): void {
    // Generate late work feed
    this.late = assignments.filter((work) => {
      if (!work.dueDate) return false;

      const wd = new Date();
      wd.setUTCFullYear(work.dueDate.year, work.dueDate.month - 1, work.dueDate.day);
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
