import 'rxjs/add/operator/toPromise';

import { Injectable } from '@angular/core';

import { Api } from '../api/api';

/**
 * Most apps have the concept of a User. This is a simple provider
 * with stubs for login/signup/etc.
 *
 * This User provider makes calls to our API at the `login` and `signup` endpoints.
 *
 * By default, it expects `login` and `signup` to return a JSON object of the shape:
 *
 * ```json
 * {
 *   status: 'success',
 *   user: {
 *     // User fields your app needs, like "id", "name", "email", etc.
 *   }
 * }Ø
 * ```
 *
 * If the `status` field is not `success`, then an error is detected and returned.
 */
@Injectable()
export class User {
  _user: any;

  constructor(public api: Api) { }

  /**
   * Send a POST request to our login endpoint with the data
   * the user entered on the form.
   */
  login(accountInfo: any, loginBy: string) {
    let urlOnBY = '';
    if (loginBy == 'EMAIL') {
      urlOnBY = 'login.php?loginByEmail=AREMAIL12345';
    } else {
      urlOnBY = 'login.php?loginByMobile=AREMAIL12345';
    }
    let seq = this.api.get(urlOnBY, accountInfo).share();

    seq.subscribe((res: any) => {
      // If the API returned a successful response, mark the user as logged in
      if (res != null) {
        if (res.status == 'success') {
          this._loggedIn(res);
        } else {
        }
      }

    }, (err:any) => {
      console.error('ERROR', err);
    });

    return seq;
  }

  /**
   * Send a POST request to our signup endpoint with the data
   * the user entered on the form.
   */
  signup(accountInfo: any, signUpBy) {

    let urlOnBY = '';
    if (signUpBy == 'EMAIL') {
      urlOnBY = 'sign_up.php?SignupByEmail=ARQP12345';
    } else {
      urlOnBY = 'sign_up.php?SignupByMobile=ARQP12345';
    }

    let seq = this.api.get(urlOnBY, accountInfo).share();

    seq.subscribe((res: any) => {
      // If the API returned a successful response, mark the user as logged in
      if (res != null) {
        if (res.status == 'success') {
          this._loggedIn(res);
        } else {

        }
      }
    }, err => {
      console.error('ERROR', err);
    });

    return seq;
  }

  /**
   * Log the user out, which forgets the session
   */
  logout() {
    this._user = null;
  }

  /**
   * Process a login/signup response to store user data
   */
  _loggedIn(resp) {
    this._user = resp.user;
  }
}
