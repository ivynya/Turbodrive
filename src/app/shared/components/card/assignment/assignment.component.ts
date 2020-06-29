import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Turbo$CourseWork } from '../../../../core/schemas';

@Component({
  selector: 'card-assignment',
  templateUrl: './assignment.component.html'
})
export class CardAssignmentComponent {
  @Input() assignment: Turbo$CourseWork;
  @Input() compact = false;
  @Input() useNotifiers = false;

  @Output() markRead = new EventEmitter<string>();

  constructor() {}

  markAsRead(): void {
    this.markRead.emit(this.assignment.id);
  }
}
