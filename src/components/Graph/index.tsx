import { Layer as LayerType } from 'konva/types/Layer';
import { KonvaEventObject } from 'konva/types/Node';
import { Stage as StageType } from 'konva/types/Stage';
import React from 'react';
import * as ReactKonva from 'react-konva';
import { MathQuillStatic } from 'react-mathquill';
import Methods from '../../methods';
import { actions, objects, withStore } from '../../state/store';
import { ArrayPoint, IStoreProps } from '../../types';
import Portal from '../../utils/portal';
import Throttle from '../../utils/throttle';
import { Roots } from '../Formula';
import './Graph.css';

const isMobile = [/Android/, /webOS/, /iPhone/, /iPad/, /iPod/, /BlackBerry/, /Windows Phone/].some(rexp => rexp.test(navigator.userAgent));
const scaleFactor = 1.1;

const defaultState = {
  width: window.innerWidth * 0.9,
  height: window.innerHeight * 0.6,
  points: [] as ArrayPoint[],
  roots: [] as number[],
  dragging: false
 };

interface IRootLabel {
  i: number;
  x: number;
  y: number;
}

class Graph extends React.Component<IStoreProps, typeof defaultState> {
  constructor(props: any) {
    super(props);

    this.resizeCanvas = this.resizeCanvas.bind(this);
    this.resetTransform = this.resetTransform.bind(this);
    this.handleDrag = this.handleDrag.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    actions.draw = this.drawCanvas.bind(this);
    actions.solve = this.solve.bind(this);
  }

  public ref: ReactKonva.Stage | null = null;

  public state = defaultState;

  public componentDidMount() {
    window.addEventListener('resize', this.resizeCanvas);
    this.drawCanvas();
  }

  public componentWillUnmount() {
    window.removeEventListener('resize', this.resizeCanvas);
  }

  @Throttle(isMobile ? 1000 : 500)
  public drawCanvas() {
    console.log('Draw called');

    this.setState({ points: this.calculatePoints() });
  }

  public resizeCanvas() {
    this.setState({ width: window.innerWidth * 0.9, height: window.innerHeight * 0.6 });
    this.drawCanvas();
  }

  public handleScroll(event: KonvaEventObject<WheelEvent>) {
    event.evt.preventDefault();
    const layer = event.target.getLayer() as LayerType;
    if (layer?.attrs.id === 'graph') {
      const keys = ['Control', 'Alt', 'Shift'];
      const modifiers = keys.map(key => event.evt.getModifierState(key));
      const stage = layer.getStage() as StageType;
      const oldScale = layer.scale();
      const mousePos = {
        x: stage.getPointerPosition()!.x / oldScale.x - layer.x() / oldScale.x,
        y: stage.getPointerPosition()!.y / oldScale.y - layer.y() / oldScale.y
      };
      const newScale = {
        x: (modifiers[0] || modifiers[1])
          ? (event.evt.deltaY < 0 ? oldScale.x * scaleFactor : oldScale.x / scaleFactor)
          : oldScale.x,
        y: (modifiers[0] || modifiers[2])
          ? (event.evt.deltaY < 0 ? oldScale.y * scaleFactor : oldScale.y / scaleFactor)
          : oldScale.y,
      };
      const newPos = {
        x: -(mousePos.x - stage.getPointerPosition()!.x / newScale.x) * newScale.x,
        y: -(mousePos.y - stage.getPointerPosition()!.y / newScale.y) * newScale.y,
      };
      this.props.store.set('scale')([newScale.x, newScale.y]);
      this.props.store.set('offset')([newPos.x / this.state.width, newPos.y / this.state.height]);
    }
    // console.log();
    this.drawCanvas();
  }

  public handleDrag(event: KonvaEventObject<DragEvent>) {
    const absPos = event.target.getAbsolutePosition();
    this.props.store.set('offset')([absPos.x / this.state.width, absPos.y / this.state.height]);
    this.drawCanvas();
  }

  public resetTransform() {
    this.props.store.set('offset')([0.5, 0.5]);
    this.props.store.set('scale')([100, 100]);
    this.drawCanvas();
  }

  public calculatePoints() {
    if (objects.evaluatex) {
      const store = this.props.store;

      const scaledStep = store.get('precisePlot') ? store.get('step') : (this.corners.x[1] - this.corners.x[0]) / this.state.width;

      const points: ArrayPoint[] = [];
      for (let x = this.corners.x[0]; x < this.corners.x[1]; x += scaledStep) {
        try {
          points.push([x, objects.evaluatex({ x })]);
        } catch (error) {
          console.log('errrr');
        }
      }
      return points;
    } else {
      return [];
    }
  }

  public solve() {
    const points = this.calculatePoints();
    const rootZones: ArrayPoint[] = [];
    points.forEach((p, i) => {
      const next = points[i + 1];
      if (next && next[1] * p[1] <= 0) {
        rootZones.push([p[0], next[0]]);
      }
    });
    console.log(rootZones);
    const roots = rootZones
      .map(Methods[this.props.store.get('solvingMethod')])
      .filter(Number.isFinite);

    console.log(roots);

    this.setState({ points, roots });
  }

  public RootLabel: React.FC<IRootLabel> = ({ i, x, y }) => {
    const stageElement = this.ref!.getStage().container();
    const location = {
      left: this.center.x + stageElement.offsetLeft + this.state.width * x / this.range.x,
      top: this.center.y + stageElement.offsetTop + this.state.height * y / this.range.y,
    };
    return (
      <MathQuillStatic
        style={{
          position: 'absolute',
          ...location
        }}
        latex={`x_{${i + 1}}`}
      />
    );
  }

  public render() {
    const state = this.state;
    const store = this.store;

    const scale = {
      x: store.get('scale')[0],
      y: store.get('scale')[1]
    };
    const strokeWidth = 2 / Math.sqrt(scale.x * scale.y);

    const withStrokeWidth = { strokeWidth };

    const { Stage, Layer, Group, Rect, Line, Text } = ReactKonva;

    return (
      <div className="Graph">
        <Stage ref={r => this.ref = r} onWheel={this.handleScroll} className="Graph-stage" {...state}>
          <Layer onDblTap={this.resetTransform} onDblClick={this.resetTransform} draggable onDragEnd={this.handleDrag} {...{scale}} id="graph" {...this.center}>
            <Group>
              <Rect fill="transparent" x={-this.center.x / scale.x} y={-this.center.y / scale.y} width={state.width / scale.x} height={state.height / scale.y} />

              <Line stroke="black" {...withStrokeWidth} points={[-9000, 0, 9000, 0]} /* OX */ />

              <Line stroke="black" {...withStrokeWidth} points={[0, -9000, 0, 9000]} /* OY */ />

              <Portal>
                {
                  state.roots
                  .map((root, i) => {
                    const props = {
                      x: root,
                      y: 0,
                      i
                    };
                    return <this.RootLabel key={i} {...props} />;
                  })
                }
              </Portal>
            </Group>
            <Group>
              <Line stroke="black" {...withStrokeWidth} points={state.points.flat()} scaleY={-1} />
            </Group>
          </Layer>
          <Layer id="text">
            <Text
              onClick={this.resetTransform}
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
                + Object.values(this.center).map(v => v.toFixed(2))
                + ' Bx:'
                + this.corners.x.map(v => v.toFixed(2))
                + ' By:'
                + this.corners.y.map(v => v.toFixed(2))
                + ' P:'
                + state.points.length
                + ' Click here to reset.'
              }
              fontSize={12}
              fontFamily={`"Lucida Console", Monaco, monospace`}
            />
          </Layer>
        </Stage>
        <div className="Graph-roots">
          <Roots roots={state.roots} />
        </div>
      </div>
    );
  }

  public get store() {
    return this.props.store;
  }

  public get center() {
    const state = this.state;
    const store = this.store;
    return {
      x: state.width * store.get('offset')[0],
      y: state.height * store.get('offset')[1],
    };
  }

  public get range() {
    return {
      x: this.state.width / this.store.get('scale')[0],
      y: this.state.height / this.store.get('scale')[1]
    };
  }

  public get corners() {
    const offset = this.store.get('offset');
    return {
      x: [-this.range.x * offset[0], this.range.x * (1 - offset[0])],
      y: [-this.range.y * offset[1], this.range.y * (1 - offset[1])]
    };
  }

}

export default withStore(Graph);
