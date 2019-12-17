import { EvalFunc } from 'evaluatex';
import { Vector2d } from 'konva/types/types';
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

export type ItemComponent = (i: number, axis: keyof Vector2d, scale: Vector2d) => JSX.Element;

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
