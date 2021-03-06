import React from 'react';
import { actions, Store, withStore } from '../../state/store';
import { IState, IStoreProps, SolvingMethod } from '../../types';
import './Control.css';

const writeCalculationMethod = (event: React.ChangeEvent<HTMLSelectElement>) => Store.set('solvingMethod')(parseInt(event.target.value));
const writeCheckbox = (param: keyof IState) => (event: React.ChangeEvent<HTMLInputElement>) => Store.set(param)(event.target.checked);

const Control: React.FC<IStoreProps> = ({ store }) => (
    <div className="Control">
        <div className="Control-panel">
            <select className="Control-select" value={store.get('solvingMethod')} onChange={writeCalculationMethod}>
                <option value={SolvingMethod.BISECT}>Метод бисекции</option>
                <option value={SolvingMethod.CHORD}>Метод хорд</option>
                <option value={SolvingMethod.TANGENT}>Метод касательных</option>
                {/* <option value={SolvingMethod.ITERATION}>Метод простых итераций</option> */}
            </select>
            <button onClick={actions.draw} className="Control-button">График</button>
            <button onClick={actions.solve} className="Control-button">Рассчитать</button>
            <button onClick={actions.save} className="Control-button">Сохранить</button>
        </div>
        <div className="Control-panel">
            <span className="Control-panel-checkbox">
                <input type="checkbox" checked={store.get('precisePlot')} onChange={writeCheckbox('precisePlot')}/>
                <span>Точное построение</span>
            </span>
            <span className="Control-panel-checkbox">
                <input type="checkbox" checked={store.get('debug')} onChange={writeCheckbox('debug')}/>
                <span>Отладка</span>
            </span>
        </div>
    </div>
);

export default withStore(Control);
