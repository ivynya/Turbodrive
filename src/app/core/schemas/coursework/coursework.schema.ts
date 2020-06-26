import { classroom_v1 } from 'googleapis';

export interface Turbo$CourseWork extends classroom_v1.Schema$CourseWork {
  read?: boolean;
  submitted?: boolean;
}