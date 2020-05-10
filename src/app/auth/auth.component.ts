import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { google } from 'googleapis';

const app = require('electron').remote.app;
import * as fs from 'fs';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    const path = `${app.getAppPath()}/src/data`;
    const secrets = JSON.parse(fs.readFileSync(`${path}/credentials.json`, "utf8"));

    const oauth2Client = new google.auth.OAuth2(
      secrets["googleClientId"],
      secrets["googleClientSecret"],
      "http://localhost:4200/oauthcallback"
    );

    // Check for returned auth code
    this.activatedRoute.queryParams.subscribe(async params => {
      if (params["code"]) {
        // Get access token
        const { tokens } = await oauth2Client.getToken(params["code"]);
        oauth2Client.setCredentials(tokens);

        // Set as globally accessible
        google.options({ auth: oauth2Client });

        // Save refresh token
        const json = JSON.stringify({ "refreshToken" : tokens.refresh_token });
        fs.writeFileSync(`${path}/tokens.json`, json);

        // Redirect to home page
        window.location.pathname = "/";
      }
    });
  }

}
