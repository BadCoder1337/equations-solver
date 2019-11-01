import React from 'react';
import { IStoreProps, Store } from '../../state/store';
import Formula from '../Formula';
import Graph from '../Graph';
import './App.css';

class App extends React.Component<IStoreProps> {
  public render() {
    const { store } = this.props;
    return (
      <div className="App">
        <header className="App-header">
          <Graph />
          <Formula />
          <p onClick={() => store.set('step')(store.get('step') + 0.1)}>
            Edit <code>src/App.tsx</code> and save to {store.get('step')}.
          </p>
          <input value={store.get('formula')} type="text" onChange={e => store.set('formula')(e.target.value)} />
        </header>
      </div>
    );
  }
}

export default Store.withStore(App);
