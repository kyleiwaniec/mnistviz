/* @flow */

import {Controller} from '../lib/Controller.js'
import mnist from 'mnist';
import brain from 'brain';

export class MnistTestController extends Controller {
  test(): string {
    const jsonNN = this.params.jsonNN;
    const nn = new brain.NeuralNetwork().fromJSON(jsonNN);
    const testData = mnist.set(0, 1000).test;
    return nn.test(testData).error.toString();
  }
}
