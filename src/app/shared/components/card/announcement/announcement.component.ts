import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Turbo$Announcement } from '../../../../core/schemas';

@Component({
  selector: 'card-announcement',
  templateUrl: './announcement.component.html'
})
export class CardAnnouncementComponent {
  @Input() announcement: Turbo$Announcement;
  @Input() compact = false;
  @Input() useNotifiers = false;

  @Output() markRead = new EventEmitter<string>();

  constructor() {}

  markAsRead(): void {
    this.markRead.emit(this.announcement.id);
  }
}
