/* @flow */

import {StreamController} from '../lib/StreamController';
import brain from '../../brain/lib/neuralnetwork';
import fs from 'fs';
import mnist from 'mnist';

export class MnistController extends StreamController {
  run(): void {
    const nodes = this.req.query.nodes.split(' ');
    console.log('Using ' + nodes.join(' ') + ' nodes');
    const net = new brain.NeuralNetwork({
      hiddenLayers: nodes,
    });
    const set = mnist.set(5000, 0);
    const trainingSet = set.training;

    const gen = net.train(trainingSet,
      {
        errorThresh: 0.005,  // error threshold to reach
        iterations: 10,   // maximum training iterations
        log: true,           // console.log() progress periodically
        logPeriod: 1,       // number of iterations between logging
        learningRate: 0.3,    // learning rate
        callback: data =>  {
          this._see.sseSend(data);
        },
        callbackPeriod: 1
      }
    );
    const interval = setInterval(() => {
        const it = gen.next();
        if (it.done) {
        this._see.sseSend('done');
          clearInterval(interval);
        }
        const data = it.value;
        this._see.sseSend(data);
      },
      50,
    );
  }
}
