/* 
This file contains an example for the environment.ts file
that the user needs to create for this app to function.
*/

export const AppConfig = {
  production: false,
  environment: 'LOCAL',
  googleClientId: 'your client id here',
  googleClientSecret: '',
  googleCallbackUrl: 'http://localhost:4200/oauthcallback'
};
