import evaluatex from 'evaluatex';
import { connect, createStore } from 'undux';
import { IActions, IObjects, SolvingMethod } from '../types';
import withEffects from './effects';
import { loadState, saveState } from './local-storage';

export const initialState = {
    formula: 'sin(x)',
    step: 0.01,
    eps: 0.0001,
    solvingMethod: SolvingMethod.BISECT,
    scale: [100, 100],
    offset: [0.5, 0.5],
    precisePlot: false,
};

export const actions: Partial<IActions> = {};

let initialEvaluatex;

try {
    initialEvaluatex = evaluatex(initialState.formula);
} catch (err) {/* */}

export const objects: Partial<IObjects>  = {
    evaluatex: initialEvaluatex,
};

if (!loadState()) {
    saveState(initialState);
}

Object.assign(initialState, loadState());

export const Store = createStore(initialState);
withEffects(Store);
export const withStore = connect(Store);
