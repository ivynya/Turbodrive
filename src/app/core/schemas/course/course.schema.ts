import { classroom_v1 } from 'googleapis';

export interface Turbo$Course extends classroom_v1.Schema$Course {
  hasUnread?: boolean;
  rank?: number;
}