/* @flow */

import React from 'react';
import ReactDOM from 'react-dom';
import {Button, DropdownButton, MenuItem} from 'react-bootstrap';
import {Graph} from './GraphVis';

type State = {
  nodes: Array<number>,
};

const btnStyle = {margin: '2px 2px 2px 2px'};
const btnType = 'default';
const defaultNodes = 5;

export class NodesPicker extends React.Component {
  state: State;

  constructor(props: any) {
    super(props);
    this.state = {
      nodes: [10],
    };
  }

  render(): React.Element<any> {
    return (
      <div>
        <div className="row">
          <div className="col-sm-12">
            <div>
              {this.state.nodes.map((node, idx) => this.renderNode(node, idx))}
              <Button
                bsStyle={btnType}
                style={btnStyle}
                onClick={() => this.addOne()}>
                +
              </Button>
              <Button
                bsStyle={btnType}
                style={btnStyle}
                onClick={() => this.removeOne()}>
                -
              </Button>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-12">
            <Graph nodes={this.state.nodes}/>
          </div>
        </div>
      </div>
    );
  }

  getNodes(): Array<number> {
    return this.state.nodes;
  }

  addOne(): void {
    const nodes = this.state.nodes.slice();
    nodes.push(defaultNodes);
    this.setState({nodes});
  }

  removeOne(): void {
    if (this.state.nodes.length === 1) {
      return;
    }
    const nodes = this.state.nodes.slice();
    nodes.pop();
    this.setState({nodes});

  }

  onChange(idx: number, value: number): void {
    const nodes = this.state.nodes.slice();
    nodes[idx] = value;
    this.setState({nodes});
  }

  renderNode(node: number, idx: number): React.Element<any> {
    return (
      <DropdownButton
        key={`selector-${idx}`}
        title={node}
        id={`selector-${idx}`}
        bsStyle={btnType}
        style={btnStyle}
        >
        {new Array(20).fill().map((_, i_) => {
          const i = i_ + 1;
          return (
            <MenuItem
              eventKey={i}
              key={i}
              onClick={() => this.onChange(idx, i)}
              active={i === node}>
              {i}
            </MenuItem>
          );
        })}
      </DropdownButton>
    )
  }
}
