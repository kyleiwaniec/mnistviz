/* @flow */

import {Controller} from '../lib/Controller.js'

export class SecondsController extends Controller {
  getCurrentSecondsAsString(): string {
    return (new Date()).getSeconds().toString();
  }
}
