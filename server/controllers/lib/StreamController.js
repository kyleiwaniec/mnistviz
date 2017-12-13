/* @flow */

import {Controller} from './Controller';
import SEE from 'express-sse';

export class StreamController extends Controller {
  _see: SEE;

  constructor(req: Request, see: SEE) {
    super(req);
    this._see = see;
  }
}
