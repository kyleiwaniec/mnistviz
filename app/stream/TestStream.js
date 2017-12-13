/* @flow */

import type {Point} from '../../shared/types.js';

import React from 'react';
import ReactDOM from 'react-dom';

type State = {
  seconds: number,
};

export class TestStream extends React.Component {
  state: State;
  es: any;

  constructor(props: any) {
    super(props);
    this.state = {
      seconds: -1,
    };
  }

  componentDidMount(): void {
    // $FlowFixMe
    this.es = new EventSource('/seconds/stream');
    this.es.onmessage = (event) => {
      const num = JSON.parse(event.data);
      console.log(num);
      this.setState({seconds: num});
    };
    this.es.onopen = (event) => {
      console.log(event);
    };
    this.es.onerror = (event) => {
      console.log(event);
    }
  }

  componentWillUnmount(): void {
    this.es.close();
  }


  render(): React.Element<any> {
    return (
      <div>
        <label>Seconds:</label>
        <span>{' '}{this.state.seconds}</span>
      </div>

    );
  }
}
