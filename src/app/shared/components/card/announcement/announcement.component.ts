import { Component, EventEmitter, Input, Output, ViewChild, ElementRef } from '@angular/core';

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

  @ViewChild("comment") commentInput: ElementRef;
  showComment = false;

  constructor() {}

  comment(): void {
    this.showComment = true;
    this.commentInput.nativeElement.focus();
  }

  markAsRead(): void {
    this.markRead.emit(this.announcement.id);
  }
}
