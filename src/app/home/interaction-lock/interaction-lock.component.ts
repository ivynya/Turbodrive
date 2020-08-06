import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'interaction-lock',
  templateUrl: './interaction-lock.component.html',
  styleUrls: ['./interaction-lock.component.scss']
})
export class InteractionLockComponent implements OnInit, OnDestroy {
  show = false;

  constructor() { }

  ngOnInit(): void {
    document.addEventListener("keydown", (e) => this.showHandler(this, e));
    document.addEventListener("keyup", (e) => this.hideHandler(this, e));
  }

  ngOnDestroy(): void {
    document.removeEventListener("keydown", (e) => this.showHandler(this, e));
    document.removeEventListener("keyup", (e) => this.hideHandler(this, e));
  }

  showHandler(ref: this, e: KeyboardEvent): void {
    if (e.key === "Alt") ref.show = true;
  }

  hideHandler(ref: this, e: KeyboardEvent): void {
    if (e.key === "Alt") ref.show = false; 
  }
}
