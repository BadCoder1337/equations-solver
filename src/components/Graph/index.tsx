import React from 'react';
import Throttle from '../../decorators/throttle';
import './Graph.css';

const isMobile = [/Android/, /webOS/, /iPhone/, /iPad/, /iPod/, /BlackBerry/, /Windows Phone/].some(rexp => rexp.test(navigator.userAgent));

interface IState {
  width: number;
  height: number;
}

class Graph extends React.Component<any, IState> {
  constructor(props: any) {
    super(props);

    this.resizeCanvas = this.resizeCanvas.bind(this);
  }

  public state = { width: window.innerWidth * 0.9, height: window.innerHeight * 0.6 };

  public componentDidMount() {
    window.addEventListener('resize', this.resizeCanvas);
    this.drawCanvas();
  }

  public componentWillUnmount() {
    window.removeEventListener('resize', this.resizeCanvas);
  }

  @Throttle(isMobile ? 1000 : 250)
  public drawCanvas() {
    const canvas = this.canvas.current;
    if (canvas) {
      const ctx = canvas.getContext('2d')!;
      // ctx.fillRect(0,0, 100, 100);
      ctx.font = '48px Verdana';
      ctx.fillText('REACT', 0, 48);
    }
  }

  public resizeCanvas() {
    this.setState({ width: window.innerWidth * 0.9, height: window.innerHeight * 0.6 });
    this.drawCanvas();
  }

  public render() {
    const HandW = this.state;
    return (
        <div className="Graph">
          <canvas ref={this.canvas} {...HandW} />
        </div>
    );
  }

  private canvas = React.createRef<HTMLCanvasElement>();
}

export default Graph;
