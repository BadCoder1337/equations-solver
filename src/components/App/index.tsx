import React from 'react';
import { withStore } from '../../state/store';
import { IStoreProps } from '../../types';
import Control from '../Control';
import Formula from '../Formula';
import Graph from '../Graph';
import MathBoard from '../MathBoard';
import './App.css';

class App extends React.Component<IStoreProps> {
  public render() {
    // const { store } = this.props;
    return (
      <div className="App">
        <Graph />
        <Formula />
        <Control />
        <MathBoard />
        <div className="App-footer">
          Репозиторий:&nbsp;<a href="https://github.com/BadCoder1337/equations-solver">equations-solver</a>
          &#160;
          Автор:&nbsp;<a href="https://github.com/BadCoder1337">BadCoder1337</a>
          &#160;
          Сделано&nbsp;с&nbsp;помощью&nbsp;<a href="https://typescriptlang.org">TypeScript</a>&nbsp;&&nbsp;<a href="https://reactjs.org/">React</a>
        </div>
      </div>
    );
  }
}

export default withStore(App);
