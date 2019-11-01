
import { createConnectedStore, Effects, Store as UnduxStore } from 'undux';
import withEffects from './effects';
import { loadState, saveState } from './local-storage';

export interface IState {
    formula: string;
    step: number;
}

const initialState: IState = {
    formula: 'sin(x)',
    step: 0.01,
};

if (!loadState()) {
    saveState(initialState);
}

export const Store = createConnectedStore(loadState(), withEffects);

export interface IStoreProps {
    store: UnduxStore<IState>;
}

export type StoreEffects = Effects<IState>;
