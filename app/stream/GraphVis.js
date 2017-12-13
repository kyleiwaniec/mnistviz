import React, {Component} from 'react';
import sigma from 'sigma';
const uuid = require('uuid');

export class Graph extends Component {
  constructor(props) {
    super(props);
    const {identifier} = this.props;
    this.updateGraph = this.updateGraph.bind(this);
    this.state = {
      identifier : identifier ? identifier : uuid.v4()
    };
  }

  componentDidMount() {
    this.updateGraph();
  }

  componentDidUpdate() {
    this.updateGraph();
  }

  changeMode(event) {
    this.setState({hierarchicalLayout: !this.state.hierarchicalLayout});
    this.updateGraph();
  }

  createID(layer, node) {
    return '' + layer + '-' + node;
  }

  updateGraph() {
    let container = document.getElementById(this.state.identifier);
    while (container.hasChildNodes()) {
      container.removeChild(container.lastChild);
    }
    const s = new sigma({
      renderer: {
        type: 'canvas',
        container: container,
      },
      settings: {
        autoRescale: true,
      },
    });
    sigma.canvas.nodes.root = function(node, context, settings) {
      var prefix = settings('prefix') || '';

      context.fillStyle = node.color || settings('defaultNodeColor');
      const cx = node[prefix + 'x'];
      const cy = node[prefix + 'y'];
      const size = node[prefix + 'size'] * 4;
      const x0 = cx - size;
      const y0 = cy - size / 2.0;
      const smSize = size / 56;
      for (let i = 0; i < 28; i++) {
        for (let j = 0; j < 28; j++) {
          context.fillRect(
            x0 + i * 2 * smSize,
            y0 + j * 2 * smSize,
            smSize,
            smSize,
          )
        }
      }
      return;
      context.fillRect(
        cx - size / 2.0,
        cy - size / 2.0,
        size,
        size,
      );
      return;
      context.beginPath();
      context.arc(
        node[prefix + 'x'],
        node[prefix + 'y'],
        node[prefix + 'size'],
        0,
        Math.PI * 2,
        true
      );

      context.closePath();
      context.fill();

      // Adding a border
      context.lineWidth = 4;//node.borderWidth || 1;
      context.strokeStyle = node.borderColor || '#fff';
      context.stroke();
    };

    const nodeList = this.props.nodes.slice();
    nodeList.splice(0, 0, 1);
    const midTotal = nodeList.length;
    nodeList.forEach((nodes, layer) => {
      const mid = nodes;
      for (let i = 1; i <= nodes; i++) {
        const id = this.createID(layer, i);
        s.graph.addNode({
          id: id,
          x: layer * 2 + (layer == 0 ? -3 : 0),
          y: i * 2 - mid,
          size: layer == 0 ? 2 : 1,
          color: "gray",
          label: layer == 0 ? 'images' : undefined,
          type: layer == 0 ? 'root' : 'other',
        });
        if (layer > 0) {
          for (let j = 1; j <= nodeList[layer - 1]; j++) {
            s.graph.addEdge({
              id: `e-${layer}-${i}-${j}`,
              source: this.createID(layer - 1, j),
              target: id,
              color: "#D3D3D3",
            });
          }
        }
      }
    });

    /*
   }).addEdge({
     id: 'e0',
     // Reference extremities:
     source: 'n0',
     target: 'n1'
   });
   */

   // Finally, let's ask our sigma instance to refresh:
   s.refresh();
  }

  render() {
    const {identifier} = this.state;
    const style = {
      position: 'absolute',
      width: '100%',
      height: '380px',
    };
    return <div id={identifier} style={style} />;
  }
}

Graph.defaultProps = {
  graph: {},
  style: {width: '400px', height: '380px'}
};
