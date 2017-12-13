/* @flow */

import type {AppendPointCB} from '../Chart';
import type {Point} from '../../../shared/types';

import d3 from 'd3';
import {AnimatedFunction} from './AnimatedFunction';
import {Axies} from './Axies'
import {CostFunction} from './CostFunction';
import {LinRegClient} from '../LinRegClient';

export class GradientDescent {
  revXScale: any;
	revYScale: any;
	normX: any;
	normY: any;
	svg: any;
  animationSpeed: number;
  axies: Axies;
  costFunction: CostFunction;
  animatedFunction: AnimatedFunction;
  interval: any;
  appendPointCB: AppendPointCB;
  costClient: LinRegClient;
  width: number;
  height: number;
  margin: number;

  constructor(
    width: number,
    height: number,
    margin: number,
    appendPointCB: AppendPointCB,
    costClient: LinRegClient,
  ) {
    this.revXScale = null;
  	this.revYScale = null;
  	this.normX = null;
  	this.normY = null;
  	this.svg = null;
    this.animationSpeed = 1;
    this.interval = null;
    this.appendPointCB = appendPointCB;
    this.costClient = costClient;
    this.width = width;
    this.height = height;
    this.margin = margin;

    this.axies = new Axies(width, height, margin);
    this.costFunction = new CostFunction(costClient, width, height, margin);
    this.animatedFunction = new AnimatedFunction(costClient, width, height, margin);
    this.initScales();
  }

  render(
    el: HTMLElement,
    dataset: Array<Point>,
    points: Array<Point>,
  ): void {
    this.initSvg(el);
    this.costFunction.render(el, this.animatedFunction);
    this.drawAll(points, dataset);
    this.run(dataset)
  }

  initScales(): void {
    this.revXScale = d3.scale.linear()
      .domain([this.margin, this.width - this.margin])
      .range([0, this.width]);

    this.revYScale = d3.scale.linear()
      .domain([this.margin, this.height - this.margin])
      .range([this.height, 0]);

    this.normX = d3.scale.linear()
      .domain([this.margin, this.width - this.margin])
      .range([0, 1]);

    this.normY = d3.scale.linear()
      .domain([this.margin, this.height - this.margin])
      .range([1, 0]);
  }

  initSvg(el: HTMLElement): void {
    const self = this;
    this.svg = d3.select(el).append("svg")
      .attr("width", this.width)
      .attr("height", this.height);

    this.svg.on("click", function(d){
      const coord = d3.mouse(this);
      const pointElem = {
        x: self.revXScale(coord[0]),
        y: self.revYScale(coord[1])
      };
      const datasetElem = {
        x: self.normX(coord[0]),
        y: self.normY(coord[1])
      };
      self.appendPointCB(pointElem, datasetElem);
    });
  }

  draw(svg: any, _points: Array<Point>): void {
    const points = svg.selectAll("g.point")
      .data(_points);

    const g = points.enter()
      .append("g")
      .attr("class", "point");

    g.append("circle")
      .attr("cx", (d) => { return this.axies.xScale(d.x); })
      .attr("cy", (d) => { return this.axies.yScale(d.y); })
      .attr("r", 6);

    g.append("circle")
      .attr("class", "c")
      .attr("cx", (d) => { return this.axies.xScale(d.x); })
      .attr("cy", (d) => { return this.axies.yScale(d.y); })
      .attr("r", 1);

    points.exit().remove();
  }

  drawAll(points: Array<Point>, dataset: Array<Point>): void {
    this.draw(this.svg, points);

    this.svg.append("text")
      .attr("y", this.margin - 10)
      .attr("x", this.margin)
      .text(this.costClient.hypothesisFunctionLabel);

    this.animatedFunction.draw(this.svg);
    this.axies.draw(this.svg);
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
