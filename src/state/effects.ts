import Evaluate from 'evaluatex';
import { saveState } from './local-storage';
import { StoreEffects } from './store';

const withEffects: StoreEffects = store => {
  // store
  //   .hook('eps', (previousValue, value) => parseFloat());
  // store
  //   .hook('step', (previousValue, value) => );

  store
    .on('formula')
    .subscribe(f => store.set('evaluatex')(() => Evaluate(f)));

  store
    .onAll()
    .subscribe(() =>
      saveState(store.getState())
    );
  return store;
};

export default withEffects;
