import { Pipe, PipeTransform } from '@angular/core';
import { classroom_v1 } from 'googleapis';
    
@Pipe({ name: 'dueDateTime' })
export class DueDateTimePipe implements PipeTransform {
  transform(dueDate: classroom_v1.Schema$Date, 
            dueTime: classroom_v1.Schema$TimeOfDay): string {
    let datetime: Date;

    // If no due date, return empty
    if (!dueDate)
      return "";

    // If a due time is specified, add data
    datetime = new Date(dueDate.year, dueDate.month, dueDate.day, 
                        dueTime.hours ?? 0, dueTime.minutes ?? 0);
    
    // Return ISO string to be piped to date
    return datetime.toISOString();
  }
}