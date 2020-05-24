import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from '../../../core/services';
import { classroom_v1 } from 'googleapis';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  courses: classroom_v1.Schema$Course[] = [];
  
  constructor(private router: Router,
              private storage: StorageService) { }

  ngOnInit(): void {
    if (this.storage.has("courses")) {
      this.courses = this.storage.get("courses");
    }

    this.storage.watch("courses", (n, o) => {
      this.courses = n;
    });
  }
}
