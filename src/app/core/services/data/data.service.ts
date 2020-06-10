import { Injectable } from '@angular/core';

import { Schema$CourseData } from '../../schemas';
import { StorageService } from '../storage/storage.service';
import { google, classroom_v1 } from 'googleapis';

@Injectable({ providedIn: 'root' })
export class DataService {
  private classroom: classroom_v1.Classroom;
  // Next page tokens
  tokens: {
    announcements: string;
    assignments: string;
  }

  constructor(private storage: StorageService) {
    this.classroom = google.classroom({version: 'v1'});
    this.tokens = { announcements: "", assignments: "" };
  }

  subscribeCourses(callback: (data: classroom_v1.Schema$ListCoursesResponse) => void, 
                  forceUpdate = false): void {
    // Set watcher to callback function
    this.storage.watch("courses", (n, o) => {
      callback({ courses: n });
    });

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

  subscribeCourseDataAll(callback: (data: {[id: string]: Schema$CourseData}) => void, 
                        forceUpdate = false): void {
    // Watch all courseData for changes 
    this.storage.watch("courseData", (n, o) => {
      callback(n);
    });

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

  subscribeCourseData(courseId: string, callback: (data: Schema$CourseData) => void, 
                      forceUpdate = false): void {
    const selector = `courseData.${courseId}`;

    // Set watcher to callback
    this.storage.watch(selector, (n, o) => {
      callback(n);
    });

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

  markRead(courseId: string, id: string): void {
    let read: string[] = [];
    if (this.storage.has(`courseData.${courseId}.read`)) {
      read = this.storage.get(`courseData.${courseId}.read`);
    }
    read.push(id);
    this.storage.set(`courseData.${courseId}.read`, read);
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

      this.storage.update(`courseData.${courseId}.announcements`, res.data.announcements);
      this.tokens.announcements = res.data.nextPageToken;
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