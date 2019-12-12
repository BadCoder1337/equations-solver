import React from 'react';
import { actions, IState, IStoreProps, Store, withStore } from '../../state/store';
import { SolvingMethod } from '../../types';
import './Control.css';

// interface IState {
//     value: number;
// }
const writeCalculationMethod = (event: React.ChangeEvent<HTMLSelectElement>) => Store.set('solvingMethod')(parseInt(event.target.value));
const writeCheckbox = (param: keyof IState) => (event: React.ChangeEvent<HTMLInputElement>) => Store.set(param)(event.target.checked);

class Control extends React.Component<IStoreProps/* , IState */> {
    public render() {
        const { store } = this.props;
        return (
            <div className="Control">
                <div className="Control-panel">
                    <select className="Control-select" value={store.get('solvingMethod')} onChange={writeCalculationMethod}>
                        <option value={SolvingMethod.DICHOTOMY}>Метод половинного деления</option>
                        <option value={SolvingMethod.SECANT}>Метод хорд</option>
                        <option value={SolvingMethod.NEWTON}>Метод касательных</option>
                        <option value={SolvingMethod.ITERATION}>Метод простых итераций</option>
                    </select>
                    <button onClick={actions.draw} className="Control-button">График</button>
                    <button onClick={actions.solve} className="Control-button">Рассчитать</button>
                    <span className="Control-panel-checkbox">
                        <input type="checkbox" checked={store.get('precisePlot')} onChange={writeCheckbox('precisePlot')}/>
                        <span>Точное построение</span>
                    </span>
                </div>
            </div>
        );
    }
}

export default withStore(Control);
