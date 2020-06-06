import { classroom_v1 } from 'googleapis';

export interface Schema$CourseData {
  // Feed items
  announcements: classroom_v1.Schema$Announcement[];
  assignments: classroom_v1.Schema$CourseWork[];
  // Items read - id
  read: string[];
}