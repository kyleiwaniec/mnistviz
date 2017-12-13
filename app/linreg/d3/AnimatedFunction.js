/* @flow */

import type {Point} from '../../../shared/types';

import d3 from 'd3';
import {LinRegClient} from '../LinRegClient';

/* animated vector for the right chart */

export class AnimatedFunction {
  theta0: number;
  theta1: number;
  learnRate: number;
  xDenorm: any;
  yDenorm: any;
  width: number;
  height: number;
  margin: number;
  costClient: LinRegClient;

  constructor(
    costClient: LinRegClient,
    width: number,
    height: number,
    margin: number,
  ) {
    this.theta0 = 0;
    this.theta1 = 0;
    this.learnRate = 0.07;
    this.costClient = costClient;

    this.width = width;
    this.height = height;
    this.margin = margin;
    this.initScales();
  }

  async iterateTheta(dataset: Array<Point>, animationSpeed: number): Promise<void> {
    const vt = await this.costClient.getGradDescVector(
      this.theta0,
      this.theta1,
      this.learnRate,
      animationSpeed,
      dataset,
    );
    this.theta0 = vt.theta0;
    this.theta1 = vt.theta1;
  }

  initScales(): void {
    this.xDenorm = d3.scale.linear()
    .domain([0, 1])
    .range([this.margin, this.width - this.margin]);

    this.yDenorm = d3.scale.linear()
    .domain([0, 1])
    .range([this.height - this.margin, this.margin]);
  }

  draw(svg: any): void {
    const func = svg.selectAll("line.func")
      .data([{theta0: this.theta0, theta1: this.theta1}]);

    const self = this;
    const xLeft = -1;
    const xRight = 2;

    [func.transition(), func.enter().append("line")].forEach(fi => {
      fi.attr("class", "func")
        .attr("x1", function(d) { return self.xDenorm(xLeft); } )
        .attr("y1", function(d) { return self.yDenorm(d.theta1 * xLeft + d.theta0); } )
        .attr("x2", function(d) { return self.xDenorm(xRight); } )
        .attr("y2", function(d) { return self.yDenorm(d.theta0+ d.theta1 * xRight); } );
    });

    const caption = svg.selectAll("text.theta")
      .data([
        {v: this.theta0, i:0},
        {v: this.theta1, i:1}
      ]);

    [caption, caption.enter().append("text").attr("class","theta")].forEach(ci => {
      ci
        .attr("x", 50)
        .attr("y", d =>{ return this.height - 20 + 16 * d.i})
        .text(d => { return "Theta" + d.i + ": " + Math.round(d.v * 100000) / 100000});

    });

    const learnRate = svg.selectAll("text.learnRate")
      .data([this.learnRate]);
  }
}
