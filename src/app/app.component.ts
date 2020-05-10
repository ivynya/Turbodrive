import { Component, OnInit } from '@angular/core';
import { ElectronService } from './core/services';
import { TranslateService } from '@ngx-translate/core';
import { AppConfig } from '../environments/environment';

import { google } from 'googleapis';
const app = require('electron').remote.app;
import * as fs from 'fs';

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
    const path = `${app.getAppPath()}/src/data`;
    const secrets = JSON.parse(fs.readFileSync(`${path}/credentials.json`, "utf8"));

    const oauth2Client = new google.auth.OAuth2(
      secrets["googleClientId"],
      secrets["googleClientSecret"],
      "http://localhost:4200/oauthcallback"
    );

    const scopes = [
      'https://www.googleapis.com/auth/classroom.announcements.readonly',
      'https://www.googleapis.com/auth/classroom.courses.readonly',
      'https://www.googleapis.com/auth/classroom.coursework.me'
    ];

    const url = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes
    });

    if (fs.existsSync(`${path}/tokens.json`)) {
      const stored = JSON.parse(fs.readFileSync(`${path}/tokens.json`, "utf8"));
      console.log(stored);
      oauth2Client.setCredentials({
        refresh_token: stored["refreshToken"]
      });

      google.options({
        auth: oauth2Client
      });
    }
    else
      window.location.href = url;
  }

}
