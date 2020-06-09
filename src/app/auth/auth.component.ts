import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppConfig } from '../../environments/environment';
import { StorageService } from '../core/services';

import { google } from 'googleapis';
import * as http from 'http';
import * as url from 'url';
import * as opn from 'open';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  constructor(private activatedRoute: ActivatedRoute,
              private storage: StorageService) { }

  ngOnInit(): void {
    // Try get credentials from config
    if (!AppConfig.googleClientId || !AppConfig.googleCallbackUrl) { 
      console.error("No credentials found!");
      return;
    }

    const oauth2Client = new google.auth.OAuth2(
      AppConfig.googleClientId,
      AppConfig.googleClientSecret,
      AppConfig.googleCallbackUrl
    );

    const scopes = [
      'https://www.googleapis.com/auth/classroom.announcements.readonly',
      'https://www.googleapis.com/auth/classroom.courses.readonly',
      'https://www.googleapis.com/auth/classroom.coursework.me',
      'https://www.googleapis.com/auth/drive',
      'https://www.googleapis.com/auth/drive.file'
    ];

    // Modified from https://github.com/googleapis/google-api-nodejs-client/blob/master/samples/oauth2.js
    // Apache 2.0 License http://www.apache.org/licenses/LICENSE-2.0
    async function authenticate(scopes: string[]): Promise<any> {
      return new Promise((resolve, reject) => {
        const authorizeUrl = oauth2Client.generateAuthUrl({
          access_type: 'offline',
          scope: scopes.join(' '),
        });
  
        // Temporary HTTP server to get code
        const server = http
          .createServer((req, res) => {
            try {
              if (req.url.includes('/oauth2callback')) {
                // Get params and kill server
                const qs = new url.URL(req.url, 'http://localhost:3000').searchParams;
                res.end('Success! You can now close this window.');
                server.close();
                
                // Return code to get tokens
                resolve(qs.get("code"));
              }
            } catch (e) {
              reject(e);
            }
          })
          .listen(3000, () => {
            // Open the browser to the authorize url to start the workflow
            opn(authorizeUrl, {wait: false}).then(cp => cp.unref());
          });
      });
    }

    authenticate(scopes).then(async (code: any) => {
      // Get tokens from code
      const { tokens } = await oauth2Client.getToken(code);
      oauth2Client.setCredentials(tokens);
  
      // Set as globally accessible
      google.options({
        auth: oauth2Client
      });

      // Store locally
      this.storage.set("refreshToken", tokens.refresh_token);

      // Redirect to home, forcing reload
      window.location.href = "/";
    });
  }
}
