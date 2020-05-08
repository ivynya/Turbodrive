import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { google } from 'googleapis';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  url: string;
  secrets: Object;

  constructor(private http: HttpClient, private activatedRoute: ActivatedRoute) {
    this.http.get("http://localhost:4200/assets/appsettings.json")
      .subscribe(data => { 
        this.secrets = data; 

        const oauth2Client = new google.auth.OAuth2(
          this.secrets["googleClientId"],
          this.secrets["googleClientSecret"],
          "http://localhost:4200/oauthcallback"
        );
    
        const scopes = [
          'https://www.googleapis.com/auth/classroom.announcements.readonly',
          'https://www.googleapis.com/auth/classroom.courses.readonly',
          'https://www.googleapis.com/auth/classroom.coursework.me'
        ];
    
        this.url = oauth2Client.generateAuthUrl({
          // 'online' (default) or 'offline' (gets refresh_token)
          access_type: 'offline',
          scope: scopes
        });
      });
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      console.log(params["code"]);
    });
  }

}
