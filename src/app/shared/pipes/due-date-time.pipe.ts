import { Pipe, PipeTransform } from '@angular/core';
import { classroom_v1 } from 'googleapis';
    
@Pipe({ name: 'dueDateTime' })
export class DueDateTimePipe implements PipeTransform {
  transform(dueDate: classroom_v1.Schema$Date, 
            dueTime: classroom_v1.Schema$TimeOfDay): string {
    // If no due date, return empty
    if (!dueDate)
      return "";

    // Create Date object and set as UTC
    const datetime: Date = new Date();
    datetime.setUTCFullYear(dueDate.year, dueDate.month - 1, dueDate.day);
    datetime.setUTCHours(dueTime.hours ?? 0); 
    datetime.setUTCMinutes(dueTime.minutes ?? 0);
    datetime.setUTCSeconds(0);
    
    // Return ISO string to be piped to date
    return datetime.toISOString();
  }
}