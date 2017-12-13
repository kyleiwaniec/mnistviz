import React from 'react';
import ReactDOM from 'react-dom';

type Props = {
  color: string,
  value: number,
  fromNode: string,
  toNode: string,
  pixelIndex: ?number,
};

type State = {
  hover: boolean,
};

const hiddenStyle = {
  visibility: 'hidden',
  backgroundColor: 'black',
  color: '#fff',
  textAlign: 'center',
  padding: '5px 5px 5px 5px',
  borderRadius: '6px',
  position: 'absolute',
  margin: '15px 15px 15px 15px',
  zIndex: '1',
};

const visibleStyle = {
  visibility: 'visible',
  backgroundColor: 'black',
  color: '#fff',
  textAlign: 'center',
  padding: '5px 5px 5px 5px',
  borderRadius: '6px',
  position: 'absolute',
  margin: '15px 15px 15px 15px',
  zIndex: '1',
};

export class Cell extends React.Component {
  props: Props;
  state: State;

  constructor(props: Props) {
    super(props);
    this.state = {
      hover: false,
    };
    (this: any).onMouseEnter = this.onMouseEnter.bind(this);
    (this: any).onMouseLeave = this.onMouseLeave.bind(this);
  }

  onMouseEnter() {
    this.setState({hover: true});
  }

  onMouseLeave() {
    this.setState({hover: false});
  }

  render(): React.Element<any> {
    return (
      <div
        style={{
          backgroundColor: this.props.color,
          width: 10,
          height: 10,
          boxSizing: 'border-box',
          margin: 1,
          position: 'relative',
        }}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
      >
      {this.state.hover ?
        <div style={{
          visibility: 'visible',
          backgroundColor: 'black',
          color: '#fff',
          textAlign: 'center',
          padding: '5px 5px 5px 5px',
          borderRadius: '6px',
          position: 'absolute',
          margin: '15px 15px 15px 15px',
          zIndex: '1',
        }}>
          From {this.props.fromNode}
          <br />
          To {this.props.toNode}
          <br />
          {this.props.value}
          <br />
          {this.drawTable()}
        </div>
      : null}
      </div>);
  }

  drawTable(): ?React.Element<any> {
    if (this.props.pixelIndex == null) {
      return null;
    }
    const r = Math.floor(this.props.pixelIndex / 28);
    const c = this.props.pixelIndex % 28;
    const rows = new Array(28).fill().map((x, i) =>
      (<tr key={`row row ${i}`}>
        {new Array(28).fill().map((y, j) =>
          (<td
            key={`cell ${i}-${j}`}
            style={{
              backgroundColor: r == i && c == j ? 'black' : 'white',
              width: 5,
              height: 5,
              border: '1px solid black',
            }}
           />)
        )}
      </tr>)
    );
    return (
      <div style={{margin: 'auto', display: 'inline-block'}}>
        <table style={{borderCollapse: 'collapse'}}>
          <tbody>
            {rows}
          </tbody>
        </table>
      </div>
    );
  }
}
