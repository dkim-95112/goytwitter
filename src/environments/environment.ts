// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  debug: 'app:*', // for npm debug module
  apiUrl: 'http://localhost:3001/api',
  websocketUrl: 'ws://localhost:3001/api',
  // apiUrl: 'http://east-1-app-lb.goytoot.com/api',
  // websocketUrl: 'ws://east-1-app-lb.goytoot.com',
  // apiUrl: 'https://awseb-AWSEB-9PJXIW26F2DY-1525272243.us-east-1.elb.amazonaws.com/api',
  // websocketUrl: 'wss:awseb-AWSEB-9PJXIW26F2DY-1525272243.us-east-1.elb.amazonaws.com',
//   apiUrl: 'https://awseb-e-x-awsebloa-1mvomxpnq6ska-35021143.us-east-2.elb.amazonaws.com/api',
//   websocketUrl: 'wss://awseb-e-x-awsebloa-1mvomxpnq6ska-35021143.us-east-2.elb.amazonaws.com',
// apiUrl: 'http://meangoywithloadbalancer-env.eba-it8yxdve.us-east-2.elasticbeanstalk.com/api',
// websocketUrl: 'ws://meangoywithloadbalancer-env.eba-it8yxdve.us-east-2.elasticbeanstalk.com',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
