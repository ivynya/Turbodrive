import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { classroom_v1 } from 'googleapis';
import * as Store from 'electron-store';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  courses: classroom_v1.Schema$Course[];
  
  constructor(private router: Router) { }

  ngOnInit(): void {
    const store = new Store();
    if (store.has("courses")) {
      this.courses = store.get("courses");
    }
  }
}
