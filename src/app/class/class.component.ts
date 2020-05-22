import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { classroom_v1 } from 'googleapis';
import * as Store from 'electron-store';

@Component({
  selector: 'app-class',
  templateUrl: './class.component.html',
  styleUrls: ['./class.component.scss']
})
export class ClassComponent implements OnInit {
  course: classroom_v1.Schema$Course;

  constructor(private activatedRoute: ActivatedRoute) { 
  }

  ngOnInit(): void {
    const store = new Store();
    const courses = store.get("courses");

    this.activatedRoute.params.subscribe(params => {
      this.course = courses.filter((c: classroom_v1.Schema$Course) => {
        return c.id === this.activatedRoute.snapshot.params.id;
      })[0];
      console.log(this.course);
    });
  }
}
