import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ElectronService, CacheService } from './core/services';
import { TranslateService } from '@ngx-translate/core';
import { AppConfig } from '../environments/environment';
import { google } from 'googleapis';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(public electron: ElectronService,
              private cache: CacheService,
              private translate: TranslateService,
              private router: Router) {
    translate.setDefaultLang('en');
    console.log('AppConfig', AppConfig);

    if (electron.isElectron) {
      console.log(process.env);
      console.log('Mode electron');
      console.log('Electron ipcRenderer', electron.ipcRenderer);
      console.log('NodeJS childProcess', electron.childProcess);
    } else {
      console.log('Mode web');
    }
  }
  
  ngOnInit(): void {
    const oauth2Client = new google.auth.OAuth2(
      AppConfig.googleClientId,
      AppConfig.googleClientSecret,
      AppConfig.googleCallbackUrl
    );

    // If a stored refresh token exists, authenticate
    if (this.cache.has("refreshToken")) {
      oauth2Client.setCredentials({ 
        refresh_token: this.cache.get("refreshToken")
      });

      // Set to globally accessible
      google.options({
        auth: oauth2Client
      });
    }
    // Otherwise, redirect to auth page
    else {
      this.router.navigateByUrl("/auth");
    }
        
    const win = this.electron.remote.getCurrentWindow();
    window.onbeforeunload = (): void => {
      /* If window is reloaded, remove win event listeners
      (DOM element listeners get auto garbage collected but not
      Electron win listeners as the win is not dereferenced unless closed) */
      win.removeAllListeners();
    }

    this.handleWindowControls();
  }

  handleWindowControls(): void {
    const win = this.electron.remote.getCurrentWindow();

    // Make minimise/maximise/restore/close buttons work when they are clicked
    document.getElementById('min-button').addEventListener("click", () => {
      win.minimize();
    });

    document.getElementById('max-button').addEventListener("click", () => {
      win.maximize();
    });

    document.getElementById('restore-button').addEventListener("click", () => {
      win.unmaximize();
    });

    document.getElementById('close-button').addEventListener("click", () => {
      win.close();
    });

    function toggleMaxRestoreButtons(): void {
      if (win.isMaximized()) {
        document.body.classList.add('maximized');
      } else {
        document.body.classList.remove('maximized');
      }
    }

    // Toggle maximise/restore buttons when maximisation/unmaximisation occurs
    toggleMaxRestoreButtons();
    win.on('maximize', toggleMaxRestoreButtons);
    win.on('unmaximize', toggleMaxRestoreButtons);
  }
}
