import { EvalFunc } from 'evaluatex';
import { IMathField } from 'react-mathquill';
import { Effects, Store } from 'undux';
import { initialState } from '../state/store';

export enum SolvingMethod {
    BISECT,
    CHORD,
    TANGENT,
    ITERATION
}

export type ArrayPoint = [number, number];

export type IState = typeof initialState;

export interface IObjects {
    mathField: IMathField;
    evaluatex: EvalFunc | null;
}

export interface IActions {
    solve: () => void;
    draw: () => void;
}

export interface IStoreProps {
    store: Store<IState>;
}

export type StoreEffects = Effects<IState>;
