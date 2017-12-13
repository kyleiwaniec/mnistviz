/* @flow */

import type {Point} from '../../../shared/types';

import d3 from 'd3';
import {AnimatedFunction} from './AnimatedFunction';
import {CostFunction} from './CostFunction';
import {LinRegClient} from '../../linreg/LinRegClient';

export class GradientDescent {
  revXScale: any;
	revYScale: any;
	normX: any;
	normY: any;
	svg: any;
  animationSpeed: number;
  costFunction: CostFunction;
  animatedFunction: AnimatedFunction;
  interval: any;
  costClient: LinRegClient;
  width: number;
  height: number;

  constructor(
    width: number,
    height: number,
    costClient: LinRegClient,
  ) {
    this.revXScale = null;
  	this.revYScale = null;
  	this.normX = null;
  	this.normY = null;
  	this.svg = null;
    this.animationSpeed = 1;
    this.interval = null;
    this.costClient = costClient;
    this.width = width;
    this.height = height;

    this.costFunction = new CostFunction(costClient, width, height);
    this.animatedFunction = new AnimatedFunction(costClient, width, height);
    this.initScales();
  }

  render(
    el: HTMLElement,
    dataset: Array<Point>,
  ): void {
    this.initSvg(el);
    this.costFunction.render(el, this.animatedFunction);
    this.drawAll(dataset);
    this.run(dataset)
  }

  initScales(): void {
    this.revXScale = d3.scale.linear()
      .domain([0, this.width])
      .range([0, this.width]);

    this.revYScale = d3.scale.linear()
      .domain([0, this.height])
      .range([this.height, 0]);

    this.normX = d3.scale.linear()
      .domain([0, this.width])
      .range([0, 1]);

    this.normY = d3.scale.linear()
      .domain([0, this.height])
      .range([1, 0]);
  }

  initSvg(el: HTMLElement): void {
    const self = this;
    this.svg = d3.select(el).append("svg")
      .attr("width", 0)
      .attr("height", 0);
  }

  drawAll(dataset: Array<Point>): void {
    this.animatedFunction.draw(this.svg);
    this.costFunction.draw(this.svg, dataset);
	}

  run(dataset: Array<Point>): void {
  	this.interval = setInterval(() => {
  		if(dataset.length > 1) {
  			this.animatedFunction.iterateTheta(dataset, this.animationSpeed).then(() => {
    			this.animatedFunction.draw(this.svg);
    			this.costFunction.animatePointer(dataset, this.animatedFunction);
        });
  		}
  	}, 500);
  }

  destroy(): void {
    if (this.interval) {
      clearInterval(this.interval);
    }
    this.costFunction.destroy();
    this.svg.remove();
  }
}
