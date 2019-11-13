import Evaluate from 'evaluatex';
import { saveState } from './local-storage';
import { objects, StoreEffects } from './store';

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
        console.log(error.toString().split('\n')[0]);
      }
    });

  store
    .onAll()
    .subscribe(() =>
      saveState(store.getState())
    );
  return store;
};

export default withEffects;
