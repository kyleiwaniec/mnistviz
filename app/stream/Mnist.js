/* @flow */

import type {Point} from '../../shared/types';
import type {Iteration} from './MnistStream';

import {MnistStream} from './MnistStream';
import {NeuralNetwork} from './NeuralNetwork';
import {Matrix} from './Matrix';
import React from 'react';
import ReactDOM from 'react-dom';
import {Graphs} from './Graphs';
import {Matrices} from './Matrices';
import {NodesPicker} from './NodesPicker';

type Status = 'running' | 'finished' | 'none';

type State = {
  iterations: Array<Iteration>,
  status: Status,
  stream: ?MnistStream,
};

export class Mnist extends React.Component {
  state: State;

  constructor(props: any) {
    super(props);
    this.state = {
      nodes: '',
      iterations: [],
      status: 'none',
      stream: null,
    };
    (this: any).handleRun = this.handleRun.bind(this);
  }

  closeStream(): void {
    if (this.state.stream != null) {
      this.state.stream.close();
      this.setState({status: 'finished'});
    }
  }

  componentWillUnmount(): void {
    this.closeStream();
  }

  handleRun(): void {
    const nodes = this.refs.picker.getNodes();
    if (nodes.length === 0) {
      return;
    }
    this.closeStream();
    const stream = new MnistStream(nodes.join(' '));
    stream.onFinished(() => this.closeStream());
    this.setState(
      {
        iterations: [],
        status: 'running',
        stream,
       },
      () => stream.run(),
    );
  }

  renderTopPart(): React.Element<any> {
    return (
      <div className="row" style={{minHeigth: '400px'}}>
        <div className="col-lg-3">
          <p>
            So far we've looked at a couple of toy examples, and gotten some idea of the basic mechanics of a network. <span style={{fontSize: '160%', fontWeight: '500'}}>So what does a model on a real problem look like?</span> If we think of our model in terms of its parameters, here is what those parameters "look like". We demonstrate the model weights as they are updated during training. The first layer contains 784 rows corresponding to the input size of our data, a 28 x 28 pixel image (flattened to 1 x 784), and user specified number of columns.
          </p>
          <hr />
          <img src="http://machinelearningalgorithmsillustrated.azurewebsites.net/img/digits.png" style={{width: '100%'}}/>
          <p style={{color: '#888', textAlign: 'center'}}>
            <i>
              <small>
                Example hand drawn digits from the MNIST dataset.
              </small>
            </i>
          </p>
        </div>
        <div className="col-lg-3">
          <p>
            In this first hidden layer, you can hover over the boxes and see the corresponding pixel position in an image. The weights (those purple boxes) start out with some random values, but as the model trains, you can actually see that some pixel positions are less important (with lighter color) than others. In particular, the edge pixels carry very little weight (becomes white boxes). This is to be expected, as the pixels around the edges of the MNIST digits are mostly white.
          </p>
          <p>
            If the subsequent hidden layers are of different dimensions than our inputs, then you can no longer make those direct comparisons. Hence the 'black box' effect - or in other words, there is no clear way to interpret the model past the first set of weights (Logistic Regression).
          </p>
        </div>
        <div className="col-lg-6">
          <div className="row">
            <div className="col-sm-12">
              <h3 style={{marginTop: '0'}}>Create a new network. <span style={{fontSize: '14px',fontWeight:'400'}}>
              Use the dropdowns to add layers and select dimensions (# of nodes) in each layer. Then click play below to train your network [ 20 20 20 gives descent results ].
                </span>
              </h3> 
            </div>
          </div>
          <div className="row">
            <div className="col-sm-12">
              <div className="input-group">
                <NodesPicker ref="picker" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  render(): React.Element<any> {
    return (
      <div>
        {this.renderTopPart()}
        <div className="row">
          <div className="col-lg-12">
            <Matrices
              stream={this.state.stream}
              handleRun={() => this.handleRun()}
              handleCancel={() => this.closeStream()}
            />
          </div>
        </div>
      </div>
    );
  }
}
