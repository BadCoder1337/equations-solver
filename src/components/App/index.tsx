import React from 'react';
import { IStoreProps, withStore } from '../../state/store';
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
          {/* <div onClick={() => store.set('step')(store.get('step') + 0.1)}>
            Edit <code>src/App.tsx</code> and save to {store.get('step')}.
          </div> */}
        </header>
      </div>
    );
  }
}

export default withStore(App);
