/* @flow */

import type {Point} from '../../shared/types';

export class LinRegStore {
  dataset: Array<Point>;

  constructor() {
    this.dataset = [
      {x: 0.5, y: 0.5},
      {x: 0.4, y: 0.2},
      {x: 0.6, y: 0.9},
    ];
  }

  getDataset(): Array<Point> {
    return this.dataset;
  }

  setDataset(dataset: Array<Point>): void {
    this.dataset = dataset;
  }
}
