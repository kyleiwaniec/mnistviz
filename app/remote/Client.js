/* @flow */

import {get, post} from './requests';

export class Client {
  get(path: string, params: Object) {
    return get(path, params);
  }

  post(path: string, params: Object) {
    return post(path, params);
  }
}
