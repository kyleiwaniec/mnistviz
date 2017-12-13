/* @flow  */

import type {Request} from './lib/Controller.js'

import {get, post, stream} from './lib/routesInternal.js';
import {SecondsController} from './utils/SecondsController';
import {SecondsStreamController} from './utils/SecondsStreamController';
import {LinRegController} from './linreg/LinRegController';
import {MnistController} from './mnist/MnistController';
import {MnistTestController} from './mnist/MnistTestController';
import SEE from 'express-sse';

export function registerRoutes(): void {
  get(
    '/seconds',
    (req: Request) => new SecondsController(req).getCurrentSecondsAsString(),
  );

  get(
    '/linreg/cost',
    (req: Request) => new LinRegController(req).getCost(),
  );

  get(
    '/linreg/graddescentvector',
    (req: Request) => new LinRegController(req).getGradDescVector(),
  );

  post(
    '/linreg/batchcost',
    (req: Request) => new LinRegController(req).getBatchCost(),
  );

  stream(
    '/mnist/stream',
    (req: Request, see: SEE) => new MnistController(req, see).run(),
  );

  stream(
    '/seconds/stream',
    (req: Request, see: SEE) => new SecondsStreamController(req, see).run(),
  );

  post(
    '/mnist/test',
    (req: Request) => new MnistTestController(req).test(),
  );
}
