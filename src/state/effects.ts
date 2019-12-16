import Evaluate from 'evaluatex';
import { StoreEffects } from '../types';
import { saveState } from './local-storage';
import { actions, objects } from './store';

// @ts-ignore
window.evaluatex = Evaluate;

const withEffects: StoreEffects = store => {
  // store
  //   .hook('eps', (previousValue, value) => parseFloat());
  // store
  //   .hook('step', (previousValue, value) => );

  store
    .on('formula')
    .subscribe(f => {
      try {
        objects.evaluatex = Evaluate(f, undefined, { latex: true }
        );
        console.log(objects.evaluatex({x: 2}));
      } catch (error) {
        objects.evaluatex = null;
        console.log(error.toString().split('\n')[0]);
      }
    });

  store
    .on('eps')
    .subscribe(() => actions.solve!());

  store
    .onAll()
    .subscribe(() =>
      saveState(store.getState())
    );
  return store;
};

export default withEffects;
