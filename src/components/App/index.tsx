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
        <header className="App-header">
          <Graph />
          <Formula />
          <Control />
          <MathBoard />
        </header>
      </div>
    );
  }
}

export default withStore(App);
