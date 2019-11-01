import React from 'react';
import { Store } from '../../state/store';
import App from '../App';

class Root extends React.Component {
  public render() {
    return <Store.Container>
      <App />
    </Store.Container>;
  }
}

export default Root;
