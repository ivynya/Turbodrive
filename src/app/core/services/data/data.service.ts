import { Injectable } from '@angular/core';

import { Turbo$CourseData, Turbo$Announcement, Turbo$CourseWork } from '../../schemas';
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

  subscribeCourses(callback: (data: classroom_v1.Schema$ListCoursesResponse) => void, 
                  forceUpdate = false): void {
    // If a previous unsubscriber exists, unsubscribe
    if (this.unsubscribers.courses)
      this.unsubscribers.courses();
    
    // Set watcher to callback function
    const unsub = this.storage.watch("courses", (n, o) => {
      callback({ courses: n });
    });
    // Set a new unsubscriber
    this.unsubscribers.courses = unsub;

    // If cache exists, immediately return it
    if (this.storage.has("courses")) {
      callback({ courses: this.storage.get("courses") });

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
    const unsub = this.storage.watch("courseData", (n, o) => {
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
      data.courses.forEach((course) => {
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
    const unsub = this.storage.watch(selector, (n, o) => {
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
      const items = this.storage.get(selector);
      const index = items.findIndex((el: Turbo$CourseWork|Turbo$Announcement) => {
        return el.id == id; });
      items[index].read = true;
      this.storage.set(selector, items);
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
      this.storage.set(selector, items);
    }
    else {
      console.error(`Error: Storage does not have ${type} in course ${courseId}.`);
    }
  }

  // Update all courses from API
  updateCourses(): void {
    this.classroom.courses.list({ courseStates: ["ACTIVE"] }, 
    (err, res) => {
      if (err) return console.error(err);
      
      const rcourses = res.data.courses;
      if (rcourses && rcourses.length) {
        // Update courses, will trigger watchers if changed
        this.storage.update("courses", rcourses);
      } else {
        console.log('No courses found.');
      }
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

      // Set next page token
      this.tokens.announcements = res.data.nextPageToken;

      // Get cached items for ref
      const selector = `courseData.${courseId}.announcements`;
      const cached: Turbo$Announcement[] = this.storage.get(selector);
      if (!cached) {
        // If no cache, set it
        this.storage.set(selector, res.data.announcements);
        return;
      }

      // Transfer existing read values to new data
      let newValues = [];
      for (var i = 0; i < res.data.announcements.length; i++) {
        const a: Turbo$Announcement = res.data.announcements[i];
        if (cached.some((c) => {return (c.id === a.id && c.updateTime === a.updateTime && c.read)}))
          a.read = true;
        else
          a.read = false;
        newValues.push(a);
      }

      // Set data
      this.storage.set(selector, newValues);
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

      this.storage.update(`courseData.${courseId}.assignments`, res.data.courseWork);
      this.tokens.assignments = res.data.nextPageToken;
    });
  }
}