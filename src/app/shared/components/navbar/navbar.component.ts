import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { classroom_v1 } from 'googleapis';
import { ElectronService } from '../../../core/services';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  courses: classroom_v1.Schema$Course[];
  
  constructor(private router: Router,
              private electron: ElectronService) { }

  ngOnInit(): void {
    if (this.electron.ipcRenderer.sendSync("store-has", "courses")) {
      this.courses = this.electron.ipcRenderer.sendSync("store-get", "courses");
    }
  }
}
