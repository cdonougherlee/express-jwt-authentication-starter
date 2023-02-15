import { Injectable } from '@angular/core';

// Moment.js will get the exact date and stuff
import * as moment from 'moment';

// Basically this puts it into local storage, deletes upon logout
@Injectable()
export class AuthService {
  constructor() {}

  // Reponseobj
  //   {
  //     "success": true,
  //     "user": {
  //         "_id": "63e9dc1452ae4c342c4489c0",
  //         "username": "CameronJWT",
  //         "hash": "862531f3054f9fbd6783a1f795f6a495f888b6891b24ba10db038bc75c0f66d7088998201deb1a18e87c18a7713b13d5ea2cf6e0ec3ad75b54c2ceb710b1ffd0",
  //         "salt": "d23a9e9685cc6be9b1e5bafd64c38889c41053aadf1088f024fdedb49fedbcbe",
  //         "__v": 0
  //     },
  //     "token": "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2M2U5ZGMxNDUyYWU0YzM0MmM0NDg5YzAiLCJpYXQiOjE2NzYyNzExMzcsImV4cCI6MTY3NjM1NzUzN30.jUkqInCCFYD253xoe2QEAg1TATbtZPpFbwjpdOkWmeFNNsZ86aMGJ9GoxcVGY95fCqPqms3_Bc7ux7aAs0-aremWPOP0jfEHsKl5982ZrG-GCDSO08_c2A_HxkaPsYMGQBRG8inbwYlecdiAJqlhyP-qpLgUDYgAPQK63cxjkJgnS5KtGteNd0tC0PAjNsLCH2Ds7Pkx0mPl91HIduL_FPvt51gkblPZZDqj_RZUCpzWB5HoPn5wC9dlhvXo7gYplatc5fxicQF0B8FikJw42he1KME7IA_NyMmto9Mp81oq5FYmTP_vi0-uWNePqWkQ9lI4k325FVdY12fo7AIfriGYUfS8htwuSRPB46nhMRSK5Dj6UQvOajeD-E7bFCvXMSubG28q70Ax6KvPjAouUU5kez1ifhz15KrSWjHhGGt3o21i7X7EHGUI2LTbmIpWlQJzpHgxzp1JgW6tgXvc8w4mg4_ps3NBBSjTst0HdK9NvowxxX1NBUdrorMbYpzF_90sjJ4zeWpVvkiT8t_2a9yAKpNxMMqdROE2FuBe-P3fwKEeF37NUx8ITuWN6_9NIOGSlPXvfy2sLImhoYdaprIByHVNXbuh7o1To2ljg-BYxZ6N1xca17ifAsuDO9Dr08BHFYnUtgGNhUqiETY5ZATHVE_l1hokC3WiGAAcErY",
  //     "expiresIn": "1d"
  //  }

  setLocalStorage(responseObj: any) {
    const expires = moment().add(responseObj.expiresIn);

    // Takes a key value pair
    localStorage.setItem('token', responseObj.token);
    localStorage.setItem('expires', JSON.stringify(expires.valueOf()));
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('expires');
  }

  isLoggedIn() {
    return moment().isBefore(this.getExpiration()); // True means JWT is still valid
  }

  isLoggedOut() {
    return !this.isLoggedIn();
  }

  getExpiration() {
    const expiration = localStorage.getItem('expires');
    if (expiration) {
      const expiresAt = JSON.parse(expiration);
      return moment(expiresAt);
    } else {
      return moment();
    }
  }
}
