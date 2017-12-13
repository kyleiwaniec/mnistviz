/* @flow */

import type {Iteration } from './MnistStream';

import React from 'react';
import ReactDOM from 'react-dom';
import { Matrix } from './Matrix';
import { MnistStream } from './MnistStream';
import { Graphs } from './Graphs';

type Props = {
  stream: ?MnistStream,
  handleRun: () => void,
  handleCancel: () => void,
};

type PlayStatus = 'completed' | 'running' | 'paused' | 'none';

type State = {
  iterations: Array<Iteration>,
  finished: boolean,
  stream: ?MnistStream,
  currentIteration: number,
  playStatus: PlayStatus,
};

export class Matrices extends React.Component {
  props: Props;
  state: State;
  isRendering: boolean;

  constructor(props: any) {
    super(props)
    this.props = props;
    this.state = {
      iterations: [],
      finished: false,
      stream: this.props.stream,
      currentIteration: -1,
      playStatus: 'none',
    };
    this.setUpStream(this.state.stream);
    this.isRendering = false;
  }

  componentDidMount(): void {
    setInterval(() => {
      if (!this.isRendering && this.state.playStatus === 'running') {
        const nextIteration = this.state.currentIteration + 1;
        if (nextIteration < this.state.iterations.length) {
          this.setState({ currentIteration: nextIteration });
        }
      }
    }, 100);
  }

  setUpStream(stream: ?MnistStream): void {
    if (stream) {
      stream.onFinished(() => this.setState({ finished: true }));
      stream.onIteration(iteration => this.addIteration(iteration));
      this.setState({ playStatus: 'running' })
    }
  }

  shouldComponentUpdate(nextProps: Props, nextState: State): boolean {
    if (this.isRendering && nextState.playStatus !== 'running') {
      return false;
    }
    this.isRendering = true;
    if (this.didComplete(nextState)) {
      nextState.playStatus = 'completed';
    }
    return true;
  }

  componentDidUpdate(): void {
    this.isRendering = false;
  }

  componentWillReceiveProps(nextProps: Props): void {
    if (nextProps.stream != this.state.stream) {
      this.setUpStream(nextProps.stream);
      this.setState({
        stream: nextProps.stream,
        iterations: [],
        finished: false,
        currentIteration: -1,
      });
    }
  }

  addIteration(iteration: Iteration): void {
    const iterations = this.state.iterations.slice();
    iterations.push(iteration);
    let currentIteration = this.state.currentIteration;
    if (currentIteration === -1) {
      currentIteration = 0;
    }
    this.setState({ iterations, currentIteration });
  }

  render(): React.Element<any> {
    const disabled = this.state.iterations.length === 0;
    const weights = disabled
      ? []
      : this.state.iterations[this.state.currentIteration].nn.weights;
    return (
      <div>
        <div className="row">
          {this.renderIterationSelector(disabled)}
        </div>
        <div className="row">
          <div className="col-lg-4">
            <div style={{ marginTop: "20px" }}>
              <Graphs stream={this.props.stream} />
            </div>
          </div>
          <div style={{ display: 'flex', marginTop: '10px' }} className="col-log-8">
            {
              weights.map((weightMatrix, i) => (
                <div style={{ marginRight: '20px' }} key={i}>
                  <Matrix
                    weightMatrix={weightMatrix}
                    layerIndex={i}
                    totalMatrices={weights.length}
                    />
                </div>
              ))
            }
          </div>
        </div>
      </div>
    );
  }

  didComplete(state: State): boolean {
    if (state.finished && state.currentIteration + 1 == state.iterations.length) {
      return true;
    }
    return false;
  }

  renderIterationSelector(disabled: boolean): React.Element<any> {
    const it = this.state.currentIteration + 1;
    return (
      <div>
        <div className="row">
          <div className="col-sm-12 play-bar">
            <span style={{ color: '#fff' }}>
              {it == 0 ? '' : `Iteration ${it}`}
            </span>

            {
              this.state.playStatus === 'running'
                ?
                <span className="play">
                  <i className="material-icons">hourglass_empty</i>
                </span>
                :
                <span className="play"
                  onClick={this.props.handleRun}>
                  <i className="material-icons">play_circle_outline</i>
                </span>
            }
          </div>
        </div>
        {
          this.state.playStatus === 'running'
            ?
            <div className="PlaySpinner">
              <p className="text-center">Model training...</p>
              <div className="spinner">
                <div className="bounce1"></div>
                <div className="bounce2"></div>
                <div className="bounce3"></div>
              </div>
            </div>
            :
            <div>
            </div>
        }
      </div>
    );
  }

  renderPlayStatusButton(): React.Element<any> {
    if (this.state.playStatus === 'completed') {
      return (
        <span style={{ color: '#fff' }}>
          Finished
        </span>
      );
    } else if (this.state.playStatus === 'none') {
      return (
        <span style={{ color: '#fff' }}>
          Not running
        </span>
      );
    } else if (this.state.playStatus === 'paused') {
      return (
        <div>
          <span style={{ color: '#fff' }}
            onClick={() => this.setState({ playStatus: 'running' })}>
            Pause
          </span>
          <span style={{ color: '#fff' }}
            onClick={this.props.handleCancel}>
            Stop
          </span>
        </div>
      );
    } else {
      return (
        <span style={{ color: '#fff' }}
          onClick={() => this.setState({ playStatus: 'paused' })}>
          Running
        </span>
      );
    }
  }

  onChangeIteration(delta: number): void {
    let newIteration = this.state.currentIteration + delta;
    if (newIteration < 0) {
      newIteration = 0;
    }
    if (newIteration >= this.state.iterations.length) {
      newIteration = this.state.iterations.length - 1;
    }
    let playStatus = this.state.playStatus;
    if (playStatus === 'running' && newIteration + 1 < this.state.iterations.length) {
      playStatus = 'paused';
    } else if (playStatus === 'paused' && newIteration + 1 === this.state.iterations.length) {
      playStatus = 'running';
    }
    this.setState({
      currentIteration: newIteration,
      playStatus,
    });
  }
}
