import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppConfig } from '../../environments/environment';
import { ElectronService } from '../core/services';
import { google } from 'googleapis';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute,
              private electron: ElectronService) { }

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

    // Check for returned auth code
    this.activatedRoute.queryParams.subscribe(params => {
      if (params["code"]) {
        // Get access token
        oauth2Client.getToken(params["code"], (err, tokens) => {
          oauth2Client.setCredentials(tokens);
  
          // Set as globally accessible
          google.options({ auth: oauth2Client });
  
          // Save refresh token
          this.electron.ipcRenderer.sendSync("store-set", "refreshToken", tokens.refresh_token);
  
          // Redirect to home page
          window.location.pathname = "/";
        });
      }
    });
  }

}
