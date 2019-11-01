import React from 'react';
import './Graph.css';

class Graph extends React.Component {
  public componentDidMount() {
    this.updateCanvas();
  }
  public updateCanvas() {
      const canvas = this.canvas.current!;
      const ctx = canvas.getContext('2d')!;
      // ctx.fillRect(0,0, 100, 100);
      ctx.font = '48px Verdana';
      ctx.fillText('REACT', 0, 48);
  }
  public render() {
      return (
          <div className="Graph">
            <canvas ref={this.canvas} width={300} height={300}/>
          </div>
      );
  }

  private canvas = React.createRef<HTMLCanvasElement>();
}

export default Graph;
