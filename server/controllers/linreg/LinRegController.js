/* @flow */

import type {Point} from '../../../shared/types';

import {Controller} from '../lib/Controller';

export class LinRegController extends Controller {
  getCost(): string {
    return this._getCost(
      this.params.theta0,
      this.params.theta1,
      this.params.dataset
    ).toString();
  }

  _getCost(theta0: number, theta1: number, dataset: Array<Point>): number {
    let cost = 0;
    for(let i = 0 ; i < dataset.length ;i++) {
      cost += Math.pow((dataset[i].x * theta1 + theta0 - dataset[i].y), 2);
    }

    return cost / 2 / dataset.length;
  }

  getBatchCost(): Object {
    return this.params.points.map(point => {
      return this._getCost(point.theta0, point.theta1, this.params.dataset);
    });
  }

  getGradDescVector(): Object {
    return this._getGradDescVector(
      this.params.theta0,
      this.params.theta1,
      this.params.learnRate,
      this.params.animationSpeed,
      this.params.dataset,
    );
  }

  _getGradDescVector(
    _theta0: number,
    _theta1: number,
    learnRate: number,
    animationSpeed: number,
    dataset: Array<Point>,
  ): Object {
    let theta0 = _theta0;
    let theta1 = _theta1;

		for(let i = 0 ; i < 100 + (200 * animationSpeed) ; i++) {
      let sum0 = 0, sum1 = 0;
      const m = dataset.length;
      const a = learnRate;

      for(let i = 0 ; i < m ;i++) {
        const diff = dataset[i].x * theta1 + theta0 - dataset[i].y;

        sum0 += diff;
        sum1 += diff * dataset[i].x;
      }

      const v0 = a * sum0 / m / 2;
      const v1 = a * sum1 / m / 2;
      theta0 -= v0;
      theta1 -= v1;
    }

    return {theta0, theta1};
  }
};
