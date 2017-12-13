/* @flow */

import type {Point, LinRegPoint} from '../../shared/types';

import {Client} from '../remote/Client';

export class LinRegClient extends Client {
  hypothesisFunctionLabel: string = 'Hypothesis Function: Ho(x)=theta0 + theta1 * x';

  costFunctionLabel: string = 'Cost Function: J(theta0, theta1)';

  getGradDescVector(
    theta0: number,
    theta1: number,
    learnRate: number,
    animationSpeed: number,
    dataset: Array<Point>,
  ): Promise<LinRegPoint> {
    return this.get('/linreg/graddescentvector', {
      theta0,
      theta1,
      learnRate,
      animationSpeed,
      dataset,
    });
  }

  getCost(theta0: number, theta1: number, dataset: Array<Point>): Promise<number> {
    return this.get( '/linreg/cost', {theta0, theta1, dataset});
  }

  getBatchCost(
    points: Array<LinRegPoint>,
    dataset: Array<Point>,
  ): Promise<Array<number>> {
    return this.post('/linreg/batchcost', {points, dataset});
  }
}
