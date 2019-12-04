import { Layer } from 'konva/types/Layer';
import { KonvaEventObject } from 'konva/types/Node';
import { Stage } from 'konva/types/Stage';
import React from 'react';
import * as ReactKonva from 'react-konva';
import Throttle from '../../decorators/throttle';
import { actions, IStoreProps, objects, withStore } from '../../state/store';
import './Graph.css';

const isMobile = [/Android/, /webOS/, /iPhone/, /iPad/, /iPod/, /BlackBerry/, /Windows Phone/].some(rexp => rexp.test(navigator.userAgent));
const scaleFactor = 1.01;

interface IState {
  width: number;
  height: number;
  points: Array<[number, number]>;
}

class Graph extends React.Component<IStoreProps, IState> {
  constructor(props: any) {
    super(props);

    this.resizeCanvas = this.resizeCanvas.bind(this);
    this.resetTransform = this.resetTransform.bind(this);
    this.handleDrag = this.handleDrag.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    actions.draw = this.drawCanvas.bind(this);
  }

  public state = { width: window.innerWidth * 0.9, height: window.innerHeight * 0.6, points: [] };

  public componentDidMount() {
    window.addEventListener('resize', this.resizeCanvas);
    this.drawCanvas();
  }

  public componentWillUnmount() {
    window.removeEventListener('resize', this.resizeCanvas);
  }

  @Throttle(isMobile ? 1000 : 250)
  public drawCanvas() {
    console.log('Draw called');
    if (objects.evaluatex) {
      console.log('Evaluatex OK');
      const scale = this.props.store.get('scale');
      const offset = this.props.store.get('offset');
      const step = this.props.store.get('step');
      const points: Array<[number, number]> = [];
      const corners = [-100, 100];
      try {
        for (let x = corners[0]; x < corners[1]; x += step) {
          points.push([x, objects.evaluatex({ x })]);
        }
      } catch (error) {/* */}
      this.setState({ points });
    }
  }

  @Throttle(isMobile ? 1000 : 250)
  public resizeCanvas() {
    this.setState({ width: window.innerWidth * 0.9, height: window.innerHeight * 0.6 });
    // this.drawCanvas();
  }

  public handleScroll(event: KonvaEventObject<WheelEvent>) {
    event.evt.preventDefault();
    const layer = event.target.getLayer() as Layer;
    if (layer && layer.attrs.id === 'graph') {
      const keys = ['Control', 'Alt', 'Shift'];
      const modifiers = keys.map(key => event.evt.getModifierState(key));
      const stage = layer.getStage() as Stage;
      console.log(layer);
      const oldScale = layer.scale();
      const mousePos = {
        x: stage.getPointerPosition()!.x / oldScale.x - layer.x() / oldScale.x,
        y: stage.getPointerPosition()!.y / oldScale.y - layer.y() / oldScale.y
      };
      const newScale = {
        x: (modifiers[0] || modifiers[1])
          ? (event.evt.deltaY > 0 ? oldScale.x * scaleFactor : oldScale.x / scaleFactor)
          : oldScale.x,
        y: (modifiers[0] || modifiers[2])
          ? (event.evt.deltaY > 0 ? oldScale.y * scaleFactor : oldScale.y / scaleFactor)
          : oldScale.y,
      };
      const newPos = {
        x: -(mousePos.x - stage.getPointerPosition()!.x / newScale.x) * newScale.x,
        y: -(mousePos.x - stage.getPointerPosition()!.x / newScale.x) * newScale.x,
      };
      console.log(oldScale, mousePos, newScale, newPos);
    }
    // console.log();
  }

  public handleDrag(event: KonvaEventObject<DragEvent>) {
    const absPos = event.target.getAbsolutePosition();
    this.props.store.set('offset')([absPos.x / this.state.width, absPos.y / this.state.height]);
  }

  public resetTransform() {
    this.props.store.set('offset')([0.5, 0.5]);
    this.props.store.set('scale')([0, 0]);
  }

  public render() {
    const state = this.state;
    const store = this.props.store;
    const center = {
      x: state.width * store.get('offset')[0],
      y: state.height * store.get('offset')[1],
    };
    const { Stage, Layer, Group, Rect, Line, Text } = ReactKonva;
    return (
      <div>
        <Stage onWheel={this.handleScroll} className="Graph-stage" {...state}>
          <Layer id="graph" onDragEnd={this.handleDrag} {...center} draggable>
            <Group>
              <Rect fill="green" x={-center.x} y={-center.y} width={state.width} height={state.height} />
              <Rect fill="red" width={state.width} height={state.height} />
              <Line stroke="black" strokeWidth={2} points={[-9000, 0, 9000, 0]} />
              <Line stroke="black" strokeWidth={2} points={[0, -9000, 0, 9000]} />
            </Group>
            <Group>
              <Line stroke="black" strokeWidth={2} points={this.state.points.flat()} scaleY={-1} />
            </Group>
          </Layer>
          <Layer id="text">
            <Text
              onClick={this.resetTransform}
              // tslint:disable-next-line:jsx-no-multiline-js
              text={
                'react-konva H:'
                + state.height.toFixed(2)
                + ' W:'
                + state.width.toFixed(2)
                + ' S:'
                + store.get('scale').map(v => v.toFixed(2))
                + ' O:'
                + store.get('offset').map(v => v.toFixed(2))
                + ' C:'
                + Object.values(center).map(v => v.toFixed(2))
              }
              fontSize={12}
              fontFamily={`"Lucida Console", Monaco, monospace`}
            />
          </Layer>
        </Stage>
      </div>
    );
  }
}

export default withStore(Graph);
