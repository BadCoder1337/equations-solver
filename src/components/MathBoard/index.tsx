import React from 'react';
import { MathQuillStatic } from 'react-mathquill';
import { IStoreProps, withStore } from '../../state/store';
import './MathBoard.css';

// interface IState {
//     editRaw: boolean;
// }

const operators = ['\\pi', '☐^2', 'x^{☐}', '\\sqrt{☐}', '\\sqrt[☐]{☐}', '\\frac{☐}{☐}', '\\log_{☐}'];

class MathBoard extends React.Component<IStoreProps /* IState */> {
    public state = { editRaw: false };

    public render() {
        const { store } = this.props;
        return (
            <div className="MathBoard">
                {operators.map((op, i) => (
                    <div
                        key={`btn${i}`}
                        className="MathBoard-buttons"
                        onClick={() => store.get('mathField')()!.write(op.replace(/☐/g, ''))}
                    >
                        <MathQuillStatic latex={op} />
                    </div>
                ))}
            </div>
        );
    }
}

export default withStore(MathBoard);
