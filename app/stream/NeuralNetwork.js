/* @flow */

import brain from 'brain';

export class NeuralNetwork {
  weights: Array<Array<Array<number>>>;
  brainNN: ?Object;
  nn: Object;

  constructor(nn: Object) {
    this.nn = nn;

    this.weights = nn.layers.filter((x, i) => i > 0).map(layer => {
      const nodes = Object.keys(layer).length;
      const weightMatrix = new Array(nodes).fill();
      let prevNodes = null;
      for (let i = 0; i < nodes; i++) {
        const prevLayer = layer[i].weights;
        const weigths = new Array(prevNodes || 0).fill();
        if (prevLayer) {
          prevNodes = prevNodes || Object.keys(prevLayer).length;
          for (let j = 0; j < prevNodes; j++) {
            weigths[j] = Number(prevLayer[j]);
          }
        }
        weightMatrix[i] = weigths;
      }
      return weightMatrix;
    });
  }

  getWeigthsForLayer(idx: number): Array<Array<number>> {
    return this.weights[idx];
  }

  run(input: Array<number>): Array<number> {
    this.brainNN = this.brainNN || new brain.NeuralNetwork().fromJSON(this.nn);
    return this.brainNN.run(input);
  }

  test(input: any): number {
    this.brainNN = this.brainNN || new brain.NeuralNetwork().fromJSON(this.nn);
    return this.brainNN.test(input).error;
  }

  toJSON(): mixed {
    return this.nn;
  }
}
