/* @flow */

import {StreamController} from '../lib/StreamController';

export class SecondsStreamController extends StreamController {
  run(): void {
    const interval = setInterval(() => {
      const seconds = (new Date()).getSeconds().toString();
      this._see.send(seconds);
    }, 1000);
    this.req.on("close", () => {
      clearInterval(interval);
    });
  }
}
