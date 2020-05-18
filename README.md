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

3) Register your Google OAuth Credentials as a webapp and get the client ID and secret with steps 4-6. Note that if you are going to package and distribute the app to others, there are additional considerations listed below under [Distribution](#Distribution) which change steps 4-6.

4) Create a project & OAuth 2.0 webapp client with the [Google Developer Console](https://console.developers.google.com/apis/credentials).

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

## Distribution

There are currently additional functional and security considerations when packaging this app. 

### Packaged Credentials
The code that loads the `credentials.json` does not properly adjust for the app running when packaged (as it tries to look in `src/data` and not the correct `/data` folder due to local app pathing). This can be corrected by changing the path in `auth.component.ts` and `app.component.ts` or placing the id in directly.

### Security Considerations
The `credentials.json` file is exposed to the user and isn't encrypted on package, which means a user can gain access to both the client id and secret. A workaround presented by Google is to register your oauth client as an iOS app, which allows you to only provide a client id and no secret. [More information can be found here](https://github.com/googleapis/google-auth-library-nodejs#oauth2-with-installed-apps-electron). The `credentials.json` can be modified to include an empty string for client secret.

I don't understand why this is better since [as this issue mentions](https://github.com/googleapis/google-auth-library-nodejs/issues/299#issuecomment-380939714) someone could impersonate your app.

As of commit `f772726` (#40) the refresh token is not encrypted.