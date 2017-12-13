/* @flow */

import React from 'react';
import ReactDOM from 'react-dom';
import DrawableCanvas from 'react-drawable-canvas';
import {NeuralNetwork} from './NeuralNetwork';

type DOMNOde = any;

type State = {
  result: string,
};

type Props = {
  nn: ?NeuralNetwork,
};

export class Sketchpad extends React.Component {
  state: State;
  props: Props;

  constructor(props: Props) {
    super(props);
    this.props = props;

    this.state = {
      result: '',
    };
  }

  imageDataToGrayscale(imgData: any) {
    var grayscaleImg = [];
    for (var y = 0; y < imgData.height; y++) {
      grayscaleImg[y]=[];
      for (var x = 0; x < imgData.width; x++) {
        var offset = y * 4 * imgData.width + 4 * x;
        var alpha = imgData.data[offset+3];
        // weird: when painting with stroke, alpha == 0 means white;
        // alpha > 0 is a grayscale value; in that case I simply take the R value
        if (alpha == 0) {
          imgData.data[offset] = 255;
          imgData.data[offset+1] = 255;
          imgData.data[offset+2] = 255;
        }
        imgData.data[offset+3] = 255;
        // simply take red channel value. Not correct, but works for
        // black or white images.
        grayscaleImg[y][x] = imgData.data[y*4*imgData.width + x*4 + 0] / 255;
      }
    }
    return grayscaleImg;
  }

  getBoundingRectangle(
    img: Array<Array<number>>,
    threshold: number,
  ): Object {
    var rows = img.length;
    var columns = img[0].length;
    var minX=columns;
    var minY=rows;
    var maxX=-1;
    var maxY=-1;
    for (var y = 0; y < rows; y++) {
        for (var x = 0; x < columns; x++) {
            if (img[y][x] < threshold) {
                if (minX > x) minX = x;
                if (maxX < x) maxX = x;
                if (minY > y) minY = y;
                if (maxY < y) maxY = y;
            }
        }
    }
    return { minY: minY, minX: minX, maxY: maxY, maxX: maxX};
  }

  centerImage(img: Array<Array<number>>): Object {
    var meanX = 0;
    var meanY = 0;
    var rows = img.length;
    var columns = img[0].length;
    var sumPixels = 0;
    for (var y = 0; y < rows; y++) {
        for (var x = 0; x < columns; x++) {
            var pixel = (1 - img[y][x]);
            sumPixels += pixel;
            meanY += y * pixel;
            meanX += x * pixel;
        }
    }
    meanX /= sumPixels;
    meanY /= sumPixels;

    var dY = Math.round(rows/2 - meanY);
    var dX = Math.round(columns/2 - meanX);
    return {transX: dX, transY: dY};
  }

  recognize(): void {
    const canvas = ReactDOM.findDOMNode(this.refs.canvas);
    const context = canvas.getContext('2d');
    let imgData = context.getImageData(0, 0, 280, 280);
    let grayscaleImg = this.imageDataToGrayscale(imgData);
    const boundingRectangle = this.getBoundingRectangle(grayscaleImg, 0.01);
    const trans = this.centerImage(grayscaleImg); // [dX, dY] to center of mass

    const canvasCopy = document.createElement("canvas");
    canvasCopy.width = imgData.width;
    canvasCopy.height = imgData.height;
    const copyCtx = canvasCopy.getContext("2d") || {};
    const brW = boundingRectangle.maxX+1-boundingRectangle.minX;
    const brH = boundingRectangle.maxY+1-boundingRectangle.minY;
    const scaling = 190 / (brW>brH?brW:brH);
    // scale
    copyCtx.translate(canvas.width/2, canvas.height/2);
    copyCtx.scale(scaling, scaling);
    copyCtx.translate(-canvas.width/2, -canvas.height/2);
    // translate to center of mass
    copyCtx.translate(trans.transX, trans.transY);

    copyCtx.drawImage(context.canvas, 0, 0);

    // now bin image into 10x10 blocks (giving a 28x28 image)
    imgData = copyCtx.getImageData(0, 0, 280, 280);
    grayscaleImg = this.imageDataToGrayscale(imgData);

    const nnInput = new Array(784);
    const nnInput2 = [];
    for (let y = 0; y < 28; y++) {
      for (let x = 0; x < 28; x++) {
        let mean = 0;
        for (let v = 0; v < 10; v++) {
          for (let h = 0; h < 10; h++) {
            mean += grayscaleImg[y*10 + v][x*10 + h];
          }
        }
        mean = (1 - mean / 100); // average and invert
        nnInput[x*28+y] = (mean - .5) / .5;
      }
    }
    if (true) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(copyCtx.canvas, 0, 0);
      for (var y = 0; y < 28; y++) {
        for (var x = 0; x < 28; x++) {
          var block = context.getImageData(x * 10, y * 10, 10, 10);
          var newVal = 255 * (0.5 - nnInput[x*28+y]/2);
          nnInput2.push(Math.round((255-newVal)/255*100)/100);
        }
      }
    }

    if (this.props.nn != null) {
      const output = this.props.nn.run(nnInput2);
      let maxIndex = 0;
      for (let i = 1; i < 10; i++) {
        if (output[i] > output[maxIndex]) {
          maxIndex = i;
        }
      }
      this.setState({result: `${maxIndex}`});
    }
  }

  clear(): void {
    const context = ReactDOM.findDOMNode(this.refs.canvas).getContext('2d');
    context.clearRect(0, 0, 280, 280);
    this.setState({result: ''});
  }

  render(): React.Element<any> {
    return (
        <div style={{marginTop: '20px'}}>
            <strong>
              Draw a digit in the box below and click recognise!
            </strong>
          <div style={{textAlign: 'center', marginTop: '10px'}}>
            <div style={{
              width: '280px',
              height: '280px',
              borderColor: 'gray',
              borderWidth: '1px',
              borderStyle: 'solid',
              display: 'inline-block'
            }}>
              <DrawableCanvas
                lineWidth={4}
                ref="canvas"
              />
            </div>
            <div style={{textAlign: 'center'}}>
              <div  className="btn-group" role="group">
                <button type="button" className="btn btn-default" onClick={() => this.clear()}>
                  Clear
                </button>
                <button type="button" className="btn btn-success" onClick={() => this.recognize()}>
                  Recognise
                </button>
              </div>
              <div>
                <strong>
                  <small>
                    {' '}Result : {this.state.result.length > 0 ? `${this.state.result}` : '?'}
                  </small>
                </strong>
              </div>
            </div>
          </div>
        </div>
    );
  }
}
