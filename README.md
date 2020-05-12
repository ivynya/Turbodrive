# Turbodrive
[![Build Status](https://travis-ci.com/SDBagel/Turbodrive.svg?branch=master)](https://travis-ci.com/SDBagel/Turbodrive) [![codecov](https://codecov.io/gh/SDBagel/Turbodrive/branch/master/graph/badge.svg)](https://codecov.io/gh/SDBagel/Turbodrive)

Turbocharged GSuite. WIP.

## 😕 Google Got You Down?

This project aims to heavily improve upon GSuite services including Google Classroom and Drive, increasing app responsiveness and your efficiency by radically redesigning the user experience. It's built on Google's API for developers with SSO, as a desktop app with Angular 9 & Electron 8 using [this boilerplate](https://github.com/maximegris/angular-electron).

## 🛠 Designed By Users, for Users

Turbodrive is built with real user (student) feedback in mind. Google Classroom is workable, but it could be way better, and that's where this project comes in.

### Design Goals
- Information: It should communicate info quickly across and without confusion.
- Inclusivity: It should be easy to transition from a GSuite service like Classroom.
- Speed: It should reduce loading times through a variety of techniques and redesigns.

## ⚡ Power Up With Microsoft 365

If you have access to the Google APIs and the local filesystem, why not power up with Microsoft 365? Edit documents and work on Google Classroom assignments completely offline using Microsoft 365's comprehensive suite of tools. Manage your Microsoft To Do and Calendar directly in-app.

# Setup
Currently, there is no packaged release of Turbodrive due to the lack of almost everything. If you'd like to check out how this app is (barely) functioning, follow these steps.

1) Clone the git repo [`https://github.com/SDBagel/Turbodrive.git`]

2) Run `npm install` (This boilerplate has issues with yarn!)

3) Register your Google OAuth Credentials and get the client ID and secret with steps 4-6.

4) Create a project & OAuth 2.0 client with the [Google Developer Console](https://console.developers.google.com/apis/credentials).

5) Set the callback URL of your app to be `http://localhost:4200/oauthcallback`

6) Create the file `credentials.json` in `src/data/` with the following format:
```json
{
  "googleClientId": "yourclientid",
  "googleClientSecret": "yourclientsecret"
}
```

7) Run `npm start` to build and start the electron process. 

The electron window will open and should redirect you to the Google Auth page. Sign in with Google and you will be redirected back to the home page where you can see all active Google Classrooms you are in (and maybe other stuff as this gets more updates).