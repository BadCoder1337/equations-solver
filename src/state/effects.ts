import { saveState } from './local-storage';
import { StoreEffects } from './store';

const withEffects: StoreEffects = store => {
  // store
  //   .hook('eps', (previousValue, value) => parseFloat());
  // store
  //   .hook('step', (previousValue, value) => );

  store
    .onAll()
    .subscribe(() =>
      saveState(store.getState())
    );
  return store;
};

export default withEffects;
