import evaluatex, { EvalFunc } from 'evaluatex';
import { IMathField } from 'react-mathquill';
import { connect, createStore, Effects, Store as UnduxStore } from 'undux';
import withEffects from './effects';
import { loadState, saveState } from './local-storage';

export interface IState {
    formula: string;
    step: number;
    eps: number;
    calculationMethod: number;
    scale: [number, number];
    offset: [number, number];
}

export interface IObjects {
    mathField: IMathField;
    evaluatex: EvalFunc | null;
}

export interface IActions {
    calculate: () => void;
    draw: () => void;
}

export interface IStoreProps {
    store: UnduxStore<IState>;
}

export type StoreEffects = Effects<IState>;

const initialState: IState = {
    formula: 'sin(x)',
    step: 0.01,
    eps: 0.001,
    calculationMethod: 0,
    scale: [100, 100],
    offset: [0.5, 0.5]
};

if (!loadState()) {
    saveState(initialState);
}

Object.assign(initialState, loadState());

export const Store = createStore(initialState);
withEffects(Store);
export const withStore = connect(Store);

export const actions: Partial<IActions> = {

};

let initialEvaluatex;

try {
    initialEvaluatex = evaluatex(initialState.formula);
} catch (err) {/* */}

export const objects: Partial<IObjects>  = {
    evaluatex: initialEvaluatex,
};
