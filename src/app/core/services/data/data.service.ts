import { Injectable } from '@angular/core';

import { 
  Turbo$Announcement, 
  Turbo$CourseData, 
  Turbo$CourseWork,
  Turbo$Course
} from '../../schemas';
import { StorageService } from '../storage/storage.service';
import { google, classroom_v1 } from 'googleapis';

@Injectable({ providedIn: 'root' })
export class DataService {
  private classroom: classroom_v1.Classroom;
  // Next page tokens
  private tokens: {
    announcements: string;
    assignments: string;
  }
  private unsubscribers: {
    courses: Function;
    courseData: Function;
  }

  constructor(private storage: StorageService) {
    this.classroom = google.classroom({version: 'v1'});
    this.tokens = { announcements: "", assignments: "" };
    this.unsubscribers = { courses: undefined, courseData: undefined };
  }

  // Subscribe data methods used by components
  subscribeCourses(callback: (data: Turbo$Course[]) => void, 
                  forceUpdate = false): void {
    // If a previous unsubscriber exists, unsubscribe
    if (this.unsubscribers.courses)
      this.unsubscribers.courses();
    
    // Set watcher to callback function
    const unsub = this.storage.watch("courses", (n) => {
      callback(n);
    });
    // Set a new unsubscriber
    this.unsubscribers.courses = unsub;

    // If cache exists, immediately return it
    if (this.storage.has("courses")) {
      callback(this.storage.get("courses"));

      // Force updates the cache if set to true
      if (forceUpdate) this.updateCourses();
    }
    else {
      // Calls update if no cache available
      this.updateCourses();
    }
  }

  subscribeCourseDataAll(callback: (data: {[id: string]: Turbo$CourseData}) => void, 
                        forceUpdate = false): void {
    // If a previous unsubscriber exists, unsubscribe
    if (this.unsubscribers.courseData)
      this.unsubscribers.courseData();

    // Watch all courseData for changes 
    const unsub = this.storage.watch("courseData", (n) => {
      callback(n);
    });
    // Set a new unsubscriber
    this.unsubscribers.courseData = unsub;

    // If course data exists, return it
    if (this.storage.has("courseData")) {
      callback(this.storage.get("courseData"));

      if (!forceUpdate) return;
    }

    // Subscribe to course changes
    this.subscribeCourses((data) => {
      // For each course trigger an update
      data.forEach((course) => {
        this.updateAnnouncements(course.id);
        this.updateAssignments(course.id);
      });
    });
  }

  subscribeCourseData(courseId: string, callback: (data: Turbo$CourseData) => void, 
                      forceUpdate = false): void {
    const selector = `courseData.${courseId}`;

    // If a previous unsubscriber exists, unsubscribe
    if (this.unsubscribers.courseData)
      this.unsubscribers.courseData();

    // Set watcher to callback
    const unsub = this.storage.watch(selector, (n) => {
      callback(n);
    });
    // Set a new unsubscriber
    this.unsubscribers.courseData = unsub;

    // If cache exists, immediately return it
    if (this.storage.has(selector)) {
      callback(this.storage.get(selector));

      // Force an update check if set to true
      if (forceUpdate) {
        this.updateAnnouncements(courseId);
        this.updateAssignments(courseId);
      }
    }
    else {
      // Calls update if no cache available
      this.updateAnnouncements(courseId);
      this.updateAssignments(courseId);
    }
  }

  // Mark an item with type (announcements, assignments) and id as read
  markRead(courseId: string, type: string, id: string): void {
    const selector = `courseData.${courseId}.${type}`;

    if (this.storage.has(selector)) {
      const items: (Turbo$CourseWork|Turbo$Announcement)[] = this.storage.get(selector);
      const index = items.findIndex((el) => {
        return el.id == id; });
      items[index].read = true;
      this.storage.set(selector, items);

      // If announcements and no items unread, mark all read
      if (type === "announcements" && !items.some((i) => !i.read)) {
        this.markCourseRead(courseId);
      }
    }
    else {
      console.error(`Error: Storage does not have ${type} in course ${courseId}.`);
    }
  }

  // Mark all unread items in a course's category as read
  markAllRead(courseId: string, type: string, startIndex = 0): void {
    const selector = `courseData.${courseId}.${type}`;
    
    if (this.storage.has(selector)) {
      let items: (Turbo$CourseWork|Turbo$Announcement)[] = this.storage.get(selector);
      items = items.filter((i) => { return !i.read });
      items.forEach((el: Turbo$CourseWork|Turbo$Announcement, i: number) => {
        if (i >= startIndex) {
          el.read = true;
          items[i] = el;
        }
      });

      // Send new items to storage
      this.storage.set(selector, items);
      // Mark course as read if type is announcements
      if (type === "announcements" && startIndex === 0)
        this.markCourseRead(courseId);
    }
    else {
      console.error(`Error: Storage does not have ${type} in course ${courseId}.`);
    }
  }

  // Checks course announcements, tries to mark read
  tryMarkCourseRead(courseId: string): void {
    const selector = `courseData.${courseId}.announcements`;
    const items: Turbo$Announcement[] = this.storage.get(selector);
    if (!items.some((item) => !item.read)) {
      this.markCourseRead(courseId);
    }
  }

  // Marks a course as having no unread items
  private markCourseRead(courseId: string): void {
    const courses: Turbo$Course[] = this.storage.get("courses");
    const thisCourse = courses.findIndex((c) => c.id === courseId);
    courses[thisCourse].hasUnread = false;
    this.storage.set("courses", courses);
  }

  // Marks a course as having unread items
  private markCourseUnread(courseId: string): void {
    const courses: Turbo$Course[] = this.storage.get("courses");
    const thisCourse = courses.findIndex((c) => c.id === courseId);
    courses[thisCourse].hasUnread = true;
    this.storage.set("courses", courses);
  }

  // Update all courses from API
  updateCourses(): void {
    this.classroom.courses.list({ courseStates: ["ACTIVE"] }, 
    (err, res) => {
      if (err) return console.error(err);
      
      const rcourses = res.data.courses;
      const cached: Turbo$Course[] = this.storage.get("courses");

      const newValues = [];
      rcourses.forEach((course) => {
        const newCourse: Turbo$Course = course;
        let find: Turbo$Course;
        if (cached) {
          find = cached.find((c) => c.id === course.id);
        }
        
        if (find) {
          // Transfer values to new data
          newCourse.hasUnread = find.hasUnread;
          newCourse.rank = find.rank;
        }
        else {
          // Set default values
          newCourse.hasUnread = true;
          newCourse.rank = newValues.length;
        }
        newValues.push(newCourse);
      });

      this.storage.update("courses", newValues);
    });
  }

  // Update most recent 10 announcements
  updateAnnouncements(courseId: string): void {
    // Get announcements for course ID
    this.classroom.courses.announcements.list({
      courseId: courseId,
      orderBy: "updateTime",
      pageSize: 10
    }, (err, res) => {
      if (err) return console.error(err);
      this.tokens.announcements = res.data.nextPageToken;

      // Get cached items for reference
      const selector = `courseData.${courseId}.announcements`;
      const cached: Turbo$Announcement[] = this.storage.get(selector);
      if (!cached) {
        // If no cache, set it
        this.storage.set(selector, res.data.announcements);
        this.markCourseUnread(courseId);
        return;
      }

      // Transfer existing read values to new data
      const newValues = [];
      for (let i = 0; i < res.data.announcements.length; i++) {
        const a: Turbo$Announcement = res.data.announcements[i];
        if (cached.some((c) => {return (c.id === a.id && c.updateTime === a.updateTime && c.read)}))
          a.read = true;
        else
          a.read = false;
        newValues.push(a);
      }

      // Set data, mark unread if there are updates
      if (this.storage.update(selector, newValues)) {
        this.markCourseUnread(courseId);
      }
    });
  }

  // Update most recent 15 assignments
  updateAssignments(courseId: string): void {
    // Get coursework
    this.classroom.courses.courseWork.list({
      courseId: courseId,
      orderBy: "updateTime",
      pageSize: 15
    }, (err, res) => {
      if (err) return console.error(err);
      this.tokens.assignments = res.data.nextPageToken;

      // Get cached items for reference
      const selector = `courseData.${courseId}.assignments`;
      const cached: Turbo$CourseWork[] = this.storage.get(selector);
      if (!cached) {
        // If no cache, set it
        this.storage.set(selector, res.data.courseWork);
        this.markCourseUnread(courseId);
        return;
      }

      // Transfer existing read values to new data
      const newValues = [];
      for (let i = 0; i < res.data.courseWork.length; i++) {
        const a: Turbo$CourseWork = res.data.courseWork[i];
        // Find an assignment that matches the metadata
        const c = cached.find((c) => {return (c.id === a.id && c.updateTime === a.updateTime)});
        if (c && (c.read || c.submitted)) {
          a.read = c.read ?? false;
          a.submitted = c.submitted ?? false;
        }
        else {
          a.read = false;
          a.submitted = false;
        }
        newValues.push(a);
      }

      if (this.storage.update(`courseData.${courseId}.assignments`, newValues)) {
        this.markCourseUnread(courseId);
      }
    });
  }
}