/* @flow */

import type {Request} from './Controller.js';

import SEE from 'express-sse';

import invariant from 'invariant';

let app: ?Request = null;

function getApp(): Request {
  invariant(app != null, "app can't be null");
  return app;
}

export function initRoutes(_app: Request): void {
  app = _app;
}

export function get(path: string, cb: (req: Request) => mixed): void {
  const processor = (req: Request, res: any) => {
    res.send(cb(req));
  };
  getApp().get(path, processor);
}

export function post(path: string, cb: (req: Request) => mixed): void {
  const processor = (req: Request, res: any) => {
    res.send(cb(req));
  };
  getApp().post(path, processor);
}

export function stream(path: string, cb: (req: Request, see: SEE) => mixed): void {
  const see = new SEE();
  const processor = (req: Request, res: any) => {
    //see.init(req, res);
    res.sseSetup();
    cb(req, res);
  };
  getApp().get(path, processor);
}
