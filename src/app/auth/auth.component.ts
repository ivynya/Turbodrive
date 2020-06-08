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

    async function authenticate(scopes: string[]) {
      return new Promise((resolve, reject) => {
        const authorizeUrl = oauth2Client.generateAuthUrl({
          access_type: 'offline',
          scope: scopes.join(' '),
        });
  
        // Temporary HTTP server to get code
        const server = http
          .createServer(async (req, res) => {
            try {
              if (req.url.indexOf('/oauth2callback') > -1) {
                // Get params and kill server
                const qs = new url.URL(req.url, 'http://localhost:3000').searchParams;
                res.end('Success! You can now close this window.');
                server.close();
  
                // Get tokens from code
                const { tokens } = await oauth2Client.getToken(qs.get('code'));
                oauth2Client.setCredentials(tokens);

                // Set as globally accessible
                google.options({
                  auth: oauth2Client
                });
                
                // Return tokens to be stored
                resolve(tokens);
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

    authenticate(scopes).then((tokens: any) => {
      this.storage.set("refreshToken", tokens.refresh_token);
      window.location.href = "/";
    });
  }
}
