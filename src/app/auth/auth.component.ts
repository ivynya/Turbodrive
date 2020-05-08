import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { google } from 'googleapis';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  oauth2Client: any;
  secrets: Object;
  url: string;

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router) { }

  ngOnInit(): void {
    this.secrets = require('../../assets/appsettings.json');

    this.oauth2Client = new google.auth.OAuth2(
      this.secrets["googleClientId"],
      this.secrets["googleClientSecret"],
      "http://localhost:4200/oauthcallback"
    );

    const scopes = [
      'https://www.googleapis.com/auth/classroom.announcements.readonly',
      'https://www.googleapis.com/auth/classroom.courses.readonly',
      'https://www.googleapis.com/auth/classroom.coursework.me'
    ];

    this.url = this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes
    });

    // Check for returned auth code
    this.activatedRoute.queryParams.subscribe(async params => {
      if (params["code"]) {
        // Get access token
        const { tokens } = await this.oauth2Client.getToken(params["code"]);
        this.oauth2Client.setCredentials(tokens);
        // Set as globally accessible
        google.options({
          auth: this.oauth2Client
        });

        // Redirect to home page
        this.router.navigate(['/home']);
      }
    });
  }

}
