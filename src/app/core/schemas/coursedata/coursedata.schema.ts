import { Turbo$Announcement } from '../announcement/announcement.schema';
import { Turbo$CourseWork } from '../coursework/coursework.schema';

export interface Turbo$CourseData {
  // Feed items
  announcements: Turbo$Announcement[];
  assignments: Turbo$CourseWork[];
}