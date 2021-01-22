// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

const baseUri = '50.17.51.244';
const port = '8765';

export const environment = {
  production: false,
  // productUri: `${baseUri}:${port}/product-service/`,
  // locationUri: `${baseUri}:${port}/location-service/`,
  // balanceUri: `${baseUri}:${port}/balance-service/`
  productUri: `http://54.89.173.151:8100/`,
  locationUri: `http://54.242.26.106:8200/`,
  balanceUri: `http://3.86.29.195:8300/`
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
