import { Layer as LayerType } from 'konva/types/Layer';
import { KonvaEventObject } from 'konva/types/Node';
import { Stage as StageType } from 'konva/types/Stage';
import React from 'react';
import * as ReactKonva from 'react-konva';
import { MathQuillStatic } from 'react-mathquill';
import Methods from '../../methods';
import { actions, objects, withStore } from '../../state/store';
import { ArrayPoint, IStoreProps, ItemComponent } from '../../types';
import Portal from '../../utils/portal';
import Throttle from '../../utils/throttle';
import { Roots } from '../Formula';
import './Graph.css';

const isMobile = [/Android/, /webOS/, /iPhone/, /iPad/, /iPod/, /BlackBerry/, /Windows Phone/].some(rexp => rexp.test(navigator.userAgent));
const scaleFactor = 1.05;

const defaultState = {
  width: window.innerWidth * 0.9,
  height: window.innerHeight * 0.6,
  points: [] as ArrayPoint[],
  roots: null as number[] | null,
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
    this.reset = this.reset.bind(this);
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
    this.drawCanvas();
    if (this.state.roots !== null) {
      this.solve();
    }
  }

  public handleDrag(event: KonvaEventObject<DragEvent> & { type: string }) {
    switch (event.type) {
      case 'dragend':
        const absPos = event.target.getAbsolutePosition();
        this.props.store.set('offset')([absPos.x / this.state.width, absPos.y / this.state.height]);
        this.setState({ dragging: false });
        this.drawCanvas();
        if (this.state.roots !== null) {
          this.solve();
        }
        break;
      case 'dragstart':
        this.setState({ dragging: true });
        break;
    }
  }

  public reset() {
    this.props.store.set('offset')([0.5, 0.5]);
    this.props.store.set('scale')([100, 100]);
    this.setState({ roots: null });
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

  @Throttle(isMobile ? 1000 : 200)
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

  public save() {
    const uri = this.stage!.toDataURL({ pixelRatio: 2, x: 0, y: 0 });
    const link = document.createElement('a');
    link.download = 'plot.png';
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  public render() {
    const { Stage, Layer, Group, Rect, Line, Text } = ReactKonva;

    return (
      <div className="Graph">
        <Stage
          ref={r => this.ref = r}
          onWheel={this.handleScroll}
          className="Graph-stage"
          {...this.state}
        >
          <Layer
            onDblTap={this.reset}
            onDblClick={this.reset}
            draggable
            onDragStart={this.handleDrag}
            onDragEnd={this.handleDrag}
            scale={this.scale}
            id="graph"
            {...this.center}
            // Main layer
          >
            <Group>
              <Rect
                fill="transparent"
                x={-this.center.x / this.scale.x}
                y={-this.center.y / this.scale.y}
                width={this.state.width / this.scale.x}
                height={this.state.height / this.scale.y}
              />

              {this.Lines.x()}
              {this.Numbers.x()}

              {this.Lines.y()}
              {this.Numbers.y()}

              <Portal>
                {(this.state.roots && !this.state.dragging ? this.state.roots : [])
                  .map((root, i) => {
                    const props = {
                      x: root - 0.1,
                      y: -0.5,
                      i
                    };
                    return <this.MQLabel key={root} {...props} />;
                })}
              </Portal>
            </Group>
            <Group>
              <Line stroke="black" strokeWidth={this.strokeWidth.x} points={this.state.points.flat()} scaleY={-1} />
            </Group>
          </Layer>
          <Layer
            visible={this.store.get('debug')}
            id="debug"
            // Debug layer
          >
            <Text
              onClick={this.reset}
              text={
                'react-konva'
                + '\nH:'
                + this.state.height.toFixed(2)
                + ' W:'
                + this.state.width.toFixed(2)
                + '\nS:'
                + this.store.get('scale').map(v => v.toFixed(2))
                + '\nO:'
                + this.store.get('offset').map(v => v.toFixed(2))
                + '\nC:'
                + Object.values(this.center).map(v => v.toFixed(2))
                + '\nBx:'
                + this.corners.x.map(v => v.toFixed(2))
                + ' By:'
                + this.corners.y.map(v => v.toFixed(2))
                + '\nRx:'
                + this.range.x.toFixed(2)
                + ' Ry:'
                + this.range.y.toFixed(2)
                + '\nSx:'
                + this.strokeWidth.x.toFixed(3)
                + ' Sy:'
                + this.strokeWidth.y.toFixed(3)
                + '\nP:'
                + this.state.points.length
                + '\nDouble-click to reset.'
              }
              fontSize={12}
              fontFamily={`"Lucida Console", Monaco, monospace`}
            />
          </Layer>
        </Stage>
        <div className="Graph-roots">
          <Roots roots={this.state.roots || []} />
        </div>
      </div>
    );
  }

  // getters

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

  public get scale() {
    return {
      x: this.store.get('scale')[0],
      y: this.store.get('scale')[1]
    };
  }

  public get strokeWidth() {
    return {
      x: 2 / this.scale.x,
      y: 2 / this.scale.y
    };
  }

  public get stage() {
    return this.ref?.getStage();
  }

  // Sub-components

  public MQLabel: React.FC<IRootLabel> = ({ i, x, y }) => {
    const stageElement = this.ref!.getStage().container();
    const location = {
      left: this.center.x + stageElement.offsetLeft + this.state.width * x / this.range.x,
      top: this.center.y + stageElement.offsetTop + this.state.height * y / this.range.y,
    };
    return (
      <MathQuillStatic
        style={{
          position: 'absolute',
          backgroundColor: 'white',
          ...location
        }}
        latex={`x_{${i + 1}}`}
      />
    );
  }

  public componentArrayFactory = (component: ItemComponent, axis: 'x' | 'y') => () =>
    new Array(
      Math.round(this.range[axis]) + 1
    )
    .fill(null)
    .map((_, i) =>
      Math.floor(this.corners[axis][0]) + i)
    .map(i => component(i, axis, this.scale))

  public Lines = {
    x: this.componentArrayFactory(Graph.ItemLine, 'x'),
    y: this.componentArrayFactory(Graph.ItemLine, 'y'),
  };

  public Numbers = {
    x: this.componentArrayFactory(Graph.ItemNumber, 'x'),
    y: this.componentArrayFactory(Graph.ItemNumber, 'y'),
  };

  public static ItemLine: ItemComponent = (i, axis, scale) => (
    <ReactKonva.Line
      key={i}
      stroke="black"
      strokeWidth={2 / Math.sqrt(scale.x * scale.y) / (i ? 3 : 1)}
      points={axis === 'x' ? [i, -9000, i, 9000] : [-9000, i, 9000, i]}
    />
  )

  public static ItemNumber: ItemComponent = (i, axis, scale) => (
    <ReactKonva.Text
      key={i}
      // strokeWidth={2 / Math.sqrt(scale.x * scale.y) / 2}
      x={(axis === 'x' ? i : 0) + 0.1}
      y={(axis === 'x' ? 0 : i) + 0.1}
      scaleX={0.3}
      scaleY={0.3}
      fontSize={1}
      text={+i.toFixed(1) + ''}
    />
  )
}

export default withStore(Graph);
