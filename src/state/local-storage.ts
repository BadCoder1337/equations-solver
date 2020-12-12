import { IState } from '../types';

export const loadState: () => IState = () => {
  try {
      const serializedState = localStorage.getItem('state');
      if (serializedState === null) {
      return undefined;
      }
      return JSON.parse(serializedState);
  } catch (err) {
      return undefined;
  }
};

export const saveState = (state: IState) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('state', serializedState);
  } catch {
    // ignore write errors
  }
};