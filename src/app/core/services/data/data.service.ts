import { Injectable } from '@angular/core';

import { StorageService } from '../storage/storage.service';
import { google, classroom_v1 } from 'googleapis';

@Injectable({ providedIn: 'root' })
export class DataService {
  private classroom: classroom_v1.Classroom;

  constructor(private storage: StorageService) {
    this.classroom = google.classroom({version: 'v1'});
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

  subscribeCourseDataAll(callback: (data: { [id: string]: {
                            announcements: classroom_v1.Schema$Announcement[];
                            assignments: classroom_v1.Schema$CourseWork[];
                        };}) => void,
                        forceUpdate = false): void {
    // Subscribe to course changes
    this.subscribeCourses((data) => {
      // For each course subscribe to data event
      data.courses.forEach((course) => {
        this.subscribeCourseData(course.id, (data) => {
          callback(this.storage.get("courseData"));
        }, forceUpdate);
      });
    }, forceUpdate);
  }

  subscribeCourseData(courseId: string, 
                      callback: (data: {
                        announcements: classroom_v1.Schema$Announcement[];
                        assignments: classroom_v1.Schema$CourseWork[];
                      }) => void,
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

  // Update most recent 5 announcements
  updateAnnouncements(courseId: string, callback?: (res: classroom_v1.Schema$ListAnnouncementsResponse) => void): void {
    // Get announcements for course ID
    this.classroom.courses.announcements.list({
      courseId: courseId,
      orderBy: "updateTime",
      pageSize: 5
    }, (err, res) => {
      if (err) return console.error(err);

      this.storage.update(`courseData.${courseId}.announcements`, res.data.announcements);
      if (callback) callback(res.data);
    });
  }

  // Update most recent 5 assignments
  updateAssignments(courseId: string): void {
    // Get coursework
    this.classroom.courses.courseWork.list({
      courseId: courseId,
      orderBy: "updateTime",
      pageSize: 5
    }, (err, res) => {
      if (err) return console.error(err);

      this.storage.update(`courseData.${courseId}.assignments`, res.data.courseWork)
    });
  }
}
