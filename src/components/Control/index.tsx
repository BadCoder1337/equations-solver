import React from 'react';
import { IStoreProps, withStore } from '../../state/store';
import './Control.css';

interface IState {
    value: number;
}

class Control extends React.Component<IStoreProps, IState> {
    public state = {
        value: 0
    };

    // constructor(props: any) {
    //     super(props);
    // }

    public handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        this.setState({value: parseInt(event.target.value)});
    }

    public render() {
        const { store } = this.props;
        return (
            <div className="Control">
                <div>Lorem ipsum dolor sit amet.</div>
                <div className="Control-panel">
                    <select className="Control-select" value={this.state.value} onChange={this.handleChange}>
                        <option value="0">Метод половинного деления</option>
                        <option value="1">Метод хорд</option>
                        <option value="2">Метод касательных</option>
                        <option value="3">Метод секущих</option>
                        <option value="4">Метод простых итераций</option>
                    </select>
                    <button className="Control-button">Рассчитать</button>
                </div>
            </div>
        );
    }
}

export default withStore(Control);
