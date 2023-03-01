# Turbodrive

> ⚠️ This project is unsupported! It will not recieve future updates. If you are a student and use Canvas LMS, check out [Caravel](https://github.com/ivynya/Caravel) instead. If you are interested in developing a Google Classroom client, consider opening an issue in Caravel to create a unified education client for students.

This README was updated on February 28th, 2023 for clarity in archival purposes. 

## README.md

Turbocharged education client built on [this boilerplate](https://github.com/maximegris/angular-electron).

## 🛠 Designed By Users, for Users

Turbodrive is built with real user (student) feedback in mind. Google Classroom is workable, but it could be way better, and that's where this project comes in. Turbodrive was designed with the following goals in mind:

- Information: It should communicate info quickly across and without confusion.
- Inclusivity: It should be easy to transition from a GSuite service like Classroom.
- Speed: It should reduce loading times through a variety of techniques and redesigns.

## Setup
There is currently no packaged release of Turbodrive. Follow the steps below to get started with the source code. Also see [Known Issues](#Issues) below.

1) Clone the git repo [`https://github.com/SDBagel/Turbodrive.git`]

2) Run `npm install` (This boilerplate has issues with yarn!)

3) Create a project & OAuth 2.0 **iOS Application** with the [Google Developer Console](https://console.developers.google.com/apis/credentials). This is the Google recommended workaround to not publishing a client secret with the app.

4) Set the callback URL of your app to be `http://localhost:4200/oauthcallback`

5) Create a `src/environments/environment.ts` file to contain your client ID and callback URL. The format of this file should look like the `src/environments/environment.example.ts` file. A spot for a client secret is provided but should be left empty unless you know what you are doing.

6) Run `npm start` to build and start the electron process. Due to the use of the Google NodeJS auth library it is incompatible running as a webserver only. There may be plans to change this.

The electron window will open and should redirect you to the Google Auth page. Sign in with Google and you will be redirected back to the home page where you can see all active Google Classrooms you are in (and maybe other stuff as this gets more updates).

## Known Issues

### External Issues:
- ~~https://issuetracker.google.com/issues/115421140~~ FIXED: Classroom API now contains CourseMaterials
- Google API does not contain comments endpoint

### Project Issues:
 - As of commit `f772726` (#40) no stored (local) data is encrypted.
