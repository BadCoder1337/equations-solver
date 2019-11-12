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
    .subscribe(f => objects.evaluatex = Evaluate(f, undefined, { latex: true }));

  store
    .onAll()
    .subscribe(() =>
      saveState(store.getState())
    );
  return store;
};

export default withEffects;
