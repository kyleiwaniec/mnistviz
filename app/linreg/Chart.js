/* @flow */

import type {Point} from '../../shared/types.js';

import React from 'react';
import ReactDOM from 'react-dom';
import {GradientDescent} from './d3/GradientDescent';
import {LinRegClient} from './LinRegClient';

type Props = {
  costClient: LinRegClient,
  width: number,
  height: number,
  margin: number,
};

type State = {
  dataset: Array<Point>,
  points: Array<Point>,
};

export default class Chart extends React.Component {
  state: State;
  props: Props;
  gradientDescent: GradientDescent;

  constructor(props: Props) {
    super(props);

    (this: any).appendPoint = this.appendPoint.bind(this);

    this.state = {
      dataset: [],
      points: [],
    };
    this.gradientDescent = new GradientDescent(
      this.props.width,
      this.props.height,
      this.props.margin,
      this.appendPoint,
      this.props.costClient,
    );
  }

  componentDidMount(): void {
    this._initGradient();
  }

  componentDidUpdate(): void {
    this.gradientDescent.destroy();
    this._initGradient();
  }

  componentWillUnmount(): void {
    this.gradientDescent.destroy();
  }

  _initGradient(): void {
    this.gradientDescent.render(
      ReactDOM.findDOMNode(this),
      this.state.dataset,
      this.state.points,
    );
  }

  render(): React.Element<any> {
    return (
      <div className="svg" />
    );
  }

  appendPoint(pointElem: Point, datasetElem: Point): void {
    const dataset = this.state.dataset;
    const points = this.state.points;
    dataset.push(datasetElem);
    points.push(pointElem);
    this.setState({dataset, points});
  }
}

export type AppendPointCB = (pointElem: Point, datasetElem: Point) => void;
