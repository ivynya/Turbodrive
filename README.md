# Turbodrive
[![Build Status](https://travis-ci.com/SDBagel/Turbodrive.svg?branch=master)](https://travis-ci.com/SDBagel/Turbodrive) [![codecov](https://codecov.io/gh/SDBagel/Turbodrive/branch/master/graph/badge.svg)](https://codecov.io/gh/SDBagel/Turbodrive)

## ⚠️ THIS PROJECT IS UNSUPPORTED

Turbodrive is unsupported and will not recieve future updates. If you are a student and use Canvas LMS, check out [Caravel](https://github.com/ivynya/Caravel) instead. If you are interested in developing a Google Classroom client, consider opening an issue in Caravel to create a unified education client for students.

Below is the old README.

<hr>

Turbocharged education client.

This project is built on [this boilerplate](https://github.com/maximegris/angular-electron).

## 🎉 Google Classroom's REST API now includes Materials
https://issuetracker.google.com/issues/115421140

Google Classroom's API now includes Materials! Only took 2 years for them to do it.

## Persisting Limitations
Google's API still does not include support for comments or direct messages on assignments. This would limit some functionality in the app compared to using the website.

## 🛠 Designed By Users, for Users

Turbodrive is built with real user (student) feedback in mind. Google Classroom is workable, but it could be way better, and that's where this project comes in.

### Design Goals
- Information: It should communicate info quickly across and without confusion.
- Inclusivity: It should be easy to transition from a GSuite service like Classroom.
- Speed: It should reduce loading times through a variety of techniques and redesigns.

## ⚡ Power Up With Microsoft 365

If you have access to the Google APIs and the local filesystem, why not power up with Microsoft 365? Edit documents and work on Google Classroom assignments completely offline using Microsoft 365's comprehensive suite of tools. Manage your Microsoft To Do and Calendar directly in-app.

# Setup
There is currently no packaged release of Turbodrive. Follow the steps below to get started with the source code. Also see [Known Issues](#Issues) below.

1) Clone the git repo [`https://github.com/SDBagel/Turbodrive.git`]

2) Run `npm install` (This boilerplate has issues with yarn!)

3) Create a project & OAuth 2.0 **iOS Application** with the [Google Developer Console](https://console.developers.google.com/apis/credentials). This is the Google recommended workaround to not publishing a client secret with the app.

4) Set the callback URL of your app to be `http://localhost:4200/oauthcallback`

5) Create a `src/environments/environment.ts` file to contain your client ID and callback URL. The format of this file should look like the `src/environments/environment.example.ts` file. A spot for a client secret is provided but should be left empty unless you know what you are doing.

6) Run `npm start` to build and start the electron process. Due to the use of the Google NodeJS auth library it is incompatible running as a webserver only. There may be plans to change this.

The electron window will open and should redirect you to the Google Auth page. Sign in with Google and you will be redirected back to the home page where you can see all active Google Classrooms you are in (and maybe other stuff as this gets more updates).

## Known Issues

### Not my problem:
- Google does not include an endpoint for CourseMaterials. This is solved by adding a very helpful link that just leads to the actual Google Classroom page. Until an endpoint is added, not much can be done. [The feature request can be found here.](https://issuetracker.google.com/issues/115421140)

### Pretty much my problem:
 - As of commit `f772726` (#40) no stored (local) data is encrypted.
