/* @flow */

import React from 'react';
import Chart from './linreg/Chart';
import Chart2 from './linreg2/Chart';
import {LinRegClient} from './linreg/LinRegClient';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import {LinRegStore} from './linreg/LinRegStore';
import {TestStream} from './stream/TestStream';
import {Mnist} from './stream/Mnist';
// $FlowFixMe
import '!!style-loader!css-loader!../app/css/main.css';

const linregStore = new LinRegStore();

export default class App extends React.Component {
  render() {
    return (
      <Mnist />
    );
  }
}
