import { KonvaEventObject } from 'konva/types/Node';
import React from 'react';
import { Group, Layer, Line, Rect, Stage, Text } from 'react-konva';
import Throttle from '../../decorators/throttle';
import { actions, IStoreProps, objects, withStore } from '../../state/store';
import './Graph.css';

const isMobile = [/Android/, /webOS/, /iPhone/, /iPad/, /iPod/, /BlackBerry/, /Windows Phone/].some(rexp => rexp.test(navigator.userAgent));

interface IState {
  width: number;
  height: number;
  points: number[];
}

class Graph extends React.Component<IStoreProps, IState> {
  constructor(props: any) {
    super(props);

    this.resizeCanvas = this.resizeCanvas.bind(this);
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
      const points = [];
      const corners = [-100, 100];
      for (let x = corners[0]; x < corners[1]; x += step) {
        points.push(x, objects.evaluatex({ x }));
      }
      this.setState({ points });
    }
  }

  @Throttle(isMobile ? 1000 : 250)
  public resizeCanvas() {
    this.setState({ width: window.innerWidth * 0.9, height: window.innerHeight * 0.6 });
    // this.drawCanvas();
  }

  public handleModifiers(event: KonvaEventObject<WheelEvent>) {
    const keys = ['Shift', 'Alt', 'Control'];
    console.log(keys.map(key => event.evt.getModifierState(key)));
    event.evt.preventDefault();
  }

  public handleDrag(event: KonvaEventObject<DragEvent>) {
    console.log(event.evt);
  }

  public render() {
    const state = this.state;
    const store = this.props.store;
    const center = {
      x: state.width / 2 + store.get('offset')[0],
      y: state.height / 2 + store.get('offset')[1],
    };
    return (
        <div>
          <Stage onWheel={this.handleModifiers} onDragStart={console.log} onDragEnd={this.handleDrag} className="Graph-stage" {...state}>
            <Layer>
              <Text text={`react-konva H:${state.height.toFixed(2)} W:${state.width.toFixed()} S:${store.get('scale')} O:${store.get('offset')}`} fontSize={12} fontFamily={`"Lucida Console", Monaco, monospace`} />
            </Layer>
            <Layer draggable>
              <Group>
                <Rect fill="transparent" x={0} y={0} width={state.width} height={state.height} />
                <Line stroke="black" strokeWidth={2} {...center} points={[-9000, 0, 9000, 0]} />
                <Line stroke="black" strokeWidth={2} {...center} points={[0, -9000, 0, 9000]} />
              </Group>
              <Group>
                <Line stroke="black" strokeWidth={2} {...center} points={this.state.points}/>
              </Group>
            </Layer>
          </Stage>
        </div>
    );
  }
}

export default withStore(Graph);
