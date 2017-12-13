/* @flow */

import type {Point} from '../../shared/types';

import {NeuralNetwork} from './NeuralNetwork';

export type Iteration = {
  error: number,
  index:  number,
  nn: NeuralNetwork,
};

type EventSourceType = any;

export class MnistStream {
  es: any;
  nodes: string;
  finishedCBs: Array<() => void>;
  iterationCBs: Array<(iteration: Iteration) => void>;
  closed: boolean;

  constructor(nodes: string) {
    console.log('CREATE stream');
    this.es = null;
    this.nodes = nodes;
    this.finishedCBs = [];
    this.iterationCBs = [];
    this.closed = false;
  }

  run(): void {
    // $FlowFixMe
    this.es = new EventSource('/mnist/stream?nodes=' + this.nodes);
    this.es.onmessage = event => {
      if (event.data == '"done"') {
        this.sendFinished();
      } else {
        this.sendIteration(this.parseIteration(event.data.trim()));
      }
    };
    this.es.onopen = event => console.log(event);
    this.es.onerror = event => console.log(event);

  }

  parseIteration(streamData: string): Iteration {
    const iteration = JSON.parse(streamData);
    return {
      error: iteration.error,
      index: iteration.iterations + 1,
      nn: new NeuralNetwork((iteration.json: Object)),
    };
  }

  sendFinished(): void {
    this.finishedCBs.forEach(cb => cb());
  }

  sendIteration(iteration: Iteration): void {
    this.iterationCBs.forEach(cb => cb(iteration));
  }

  onFinished(cb: () => void): void {
    this.finishedCBs.push(cb);
  }

  onIteration(cb: (Iteration: Iteration) => void): void {
    this.iterationCBs.push(cb);
  }

  close(): void {
    if (this.es != null && !this.closed) {
      console.log('CLOSE stream');
      this.closed = true;
      this.sendFinished();
      this.es.close();
    }
  }
}
