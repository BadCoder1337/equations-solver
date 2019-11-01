import { saveState } from './local-storage';
import { StoreEffects } from './store';

const withEffects: StoreEffects = store => {
    store
      .onAll()
      .subscribe(() =>
        saveState(store.getState())
      );
    return store;
};

export default withEffects;
