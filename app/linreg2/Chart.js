/* @flow */

import type {Point} from '../../shared/types.js';

import React from 'react';
import ReactDOM from 'react-dom';
import {GradientDescent} from './d3/GradientDescent';
import {LinRegClient} from '../linreg/LinRegClient';
import {LinRegStore} from '../linreg/LinRegStore';


type Props = {
  costClient: LinRegClient,
  width: number,
  height: number,
  store: LinRegStore,
};

type State = {
  dataset: Array<Point>,
};

export default class Chart extends React.Component {
  state: State;
  props: Props;
  gradientDescent: GradientDescent;

  constructor(props: Props) {
    super(props);

    (this: any).handleChangeX = this.handleChangeX.bind(this);
    (this: any).handleChangeY = this.handleChangeY.bind(this);
    (this: any)._rerenderGradient = this._rerenderGradient.bind(this);
    (this: any).handleRemove = this.handleRemove.bind(this);
    (this: any).handleNewPoint = this.handleNewPoint.bind(this);

    this.state = {
      dataset: this.props.store.getDataset(),
    }

    this.gradientDescent = new GradientDescent(
      this.props.width,
      this.props.height,
      this.props.costClient,
    );
  }

  componentDidMount(): void {
    this._initGradient();
  }

  componentWillUnmount(): void {
    this.gradientDescent.destroy();
  }

  getDataset(): Array<Point> {
    return this.state.dataset;
  }

  setDataset(dataset: Array<Point>): void {
    this.props.store.setDataset(dataset);
  }

  _initGradient(): void {
    this.gradientDescent.render(
      ReactDOM.findDOMNode(this),
      this.getDataset(),
    );
  }

  _rerenderGradient(): void {
    this.gradientDescent.destroy();
    this.gradientDescent.render(
      ReactDOM.findDOMNode(this),
      this.getDataset(),
    );
  }

  render(): React.Element<any> {
    return (
      <div style={{overflow: 'hidden', position: 'relative'}}>
        <div style={{float: 'left', marginRight: 50, marginLeft: 10}}>
          <table className="table">
            <tbody>
              {this.renderPoints()}
            </tbody>
          </table>
          <button
            type="button"
            className="btn but-default"
            onClick={this.handleNewPoint}>Add point</button>
        </div>
        <div className="svg" style={{float: 'left'}}/>
      </div>
    );
  }

  renderPointForIndex(point: Point, idx: number): React.Element<any> {
    return (
      <tr key={idx.toString()}>
        <td>
          <input
            type="text"
            value={point.x}
            className="form-control"
            onChange={(event) => this.handleChangeX(event.target.value, idx)}
            onBlur={this._rerenderGradient}
          />
        </td>
        <td>
          <input
            type="text"
            value={point.y}
            className="form-control"
            onChange={(event) => this.handleChangeY(event.target.value, idx)}
            onBlur={this._rerenderGradient}
          />
        </td>
        <td>
          <button
            className="btn btn-default"
            type="button"
            onClick={(event) => this.handleRemove(idx)}
          >
            X
          </button>
        </td>
      </tr>
    );
  }

  renderPoints(): Array<React.Element<any>> {
    return this.getDataset().map((pt, idx) => this.renderPointForIndex(pt, idx));
  }

  handleChangeX(x: number, idx: number): void {
    const dataset = this.getDataset();
    dataset[idx].x = x;
    this.setDataset(dataset);
    this.setState({dataset});
  }

  handleChangeY(y: number, idx: number): void {
    const dataset = this.getDataset();
    dataset[idx].y = y;
    this.setDataset(dataset);
    this.setState({dataset});
  }

  handleRemove(idx: number): void {
    const dataset = this.getDataset();
    dataset.splice(idx, 1);
    this.setDataset(dataset);
    this.setState({dataset}, () => this._rerenderGradient());
  }

  handleNewPoint(): void {
    const dataset = this.getDataset();
    dataset.push({x: 0, y: 0});
    this.setDataset(dataset);
    this.setState({dataset}, () => this._rerenderGradient());
  }
}
