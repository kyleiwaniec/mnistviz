/* @flow */

import React from 'react';
import ReactDOM from 'react-dom';

import {MnistStream} from './MnistStream';
import type {Iteration} from './MnistStream';
import {Line} from 'react-chartjs-2';
import {defaults} from 'react-chartjs-2';
import {Sketchpad} from './Sketchpad';
import {post} from '../remote/requests';

defaults.global.animation = false;

type Props = {
  stream: ?MnistStream,
};

type State = {
  iterations: Array<Iteration>,
  finished: boolean,
  stream: ?MnistStream,
  testError: ?number,
};

export class Graphs extends React.Component {
  props: Props;
  state: State;

  constructor(props: Props) {
    super(props)
    this.props = props;
    this.state = {
      iterations: [],
      finished: false,
      stream: this.props.stream,
      testError: null,
    };
    this.setUpStream(this.state.stream);
  }

  setUpStream(stream: ?MnistStream): void {
    if (stream) {
      stream.onFinished(() => this.setState(
        {finished: true},
        () => this.calculateError(),
      ));
      stream.onIteration(iteration => this.addIteration(iteration));
    }
  }

  componentWillReceiveProps(nextProps: Props): void {
    if (nextProps.stream != this.state.stream) {
      this.setUpStream(nextProps.stream);
      this.setState({
        stream: nextProps.stream,
        iterations: [],
        finished: false,
        testError: null,
      });
    }
  }

  addIteration(iteration: Iteration): void {
    const iterations = this.state.iterations.slice();
    iterations.push(iteration);
    this.setState({iterations});
  }

  calculateError(): void {
    const len = this.state.iterations.length;
    let nn = null;
    if (len > 0) {
      nn = this.state.iterations[len - 1].nn;
      post(
        '/mnist/test',
        {jsonNN: nn.toJSON()},
      ).then(
        testError => this.setState({testError})
      )
    }
  }

  render(): React.Element<any> {
    if (this.state.iterations.length === 0) {
      return (<div />);
    }
    return (
      <div>
        <Line
          options={{scales: {xAxes: [{display: false}]}}}
          data={{
            labels: new Array(this.state.iterations.length).fill().map((x, i) => 'It. ' + (i + 1)),
            datasets: [
              {
                label: 'Training error',
                fill: false,
                lineTension: 0.1,
                backgroundColor: 'rgba(255,0,80,1)',
                borderColor: 'rgba(255,0,80,1)',
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: 'rgba(255,0,80,1)',
                pointBackgroundColor: '#fff',
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: 'rgba(255,0,80,1)',
                pointHoverBorderColor: 'rgba(220,220,220,1)',
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: this.state.iterations.map(it => it.error),
              },
            ]
          }}
        />
        <div style={{marginTop: '20px'}}>
          Test Error:{' '}
          <strong>
            <small>
              {this.state.testError == null ? '?' : this.state.testError}
            </small>
          </strong>
        </div>
        {this.renderSketchpad()}
      </div>
    );
  }

  renderSketchpad(): ?React.Element<any> {
    const len = this.state.iterations.length;
    let nn = null;
    if (len > 0) {
      nn = this.state.iterations[len - 1].nn;
    }
    return (
      <Sketchpad nn={nn} />
    );
  }
}
