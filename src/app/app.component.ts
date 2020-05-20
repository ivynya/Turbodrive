import { Component, OnInit } from '@angular/core';
import { ElectronService } from './core/services';
import { TranslateService } from '@ngx-translate/core';
import { AppConfig } from '../environments/environment';

import { google } from 'googleapis';
import * as Store from 'electron-store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(public electronService: ElectronService,
              private translate: TranslateService) {
    translate.setDefaultLang('en');
    console.log('AppConfig', AppConfig);

    if (electronService.isElectron) {
      console.log(process.env);
      console.log('Mode electron');
      console.log('Electron ipcRenderer', electronService.ipcRenderer);
      console.log('NodeJS childProcess', electronService.childProcess);
    } else {
      console.log('Mode web');
    }
  }
  
  ngOnInit(): void {
    const store = new Store();

    const oauth2Client = new google.auth.OAuth2(
      AppConfig.googleClientId,
      AppConfig.googleClientSecret,
      AppConfig.googleCallbackUrl
    );

    // If a stored refresh token exists, authenticate
    if (store.has("refreshToken")) {
      oauth2Client.setCredentials({
        refresh_token: store.get("refreshToken")
      });

      // Set to globally accessible
      google.options({
        auth: oauth2Client
      });
    }
    // Otherwise, redirect to auth page
    else {
      const scopes = [
        'https://www.googleapis.com/auth/classroom.announcements.readonly',
        'https://www.googleapis.com/auth/classroom.courses.readonly',
        'https://www.googleapis.com/auth/classroom.coursework.me'
      ];

      const url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes
      });

      window.location.href = url;
    }
  }

}
