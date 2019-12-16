import React from 'react';
import { MathQuillStatic } from 'react-mathquill';
import { objects, withStore } from '../../state/store';
import { IStoreProps } from '../../types';
import './MathBoard.css';

// interface IState {
//     editRaw: boolean;
// }

const operators = ['\\pi', '☐^2', 'x^{☐}', '\\sqrt{☐}', '\\sqrt[☐]{☐}', '\\frac{☐}{☐}', '\\log_{☐}'];

const writeLaTex = (op: string) => () => objects.mathField && objects.mathField.write(op.replace(/☐/g, ''));

const Button = (op: string, i: number) => (
    <div
        key={`btn${i}`}
        className="MathBoard-buttons"
        onClick={writeLaTex(op)}
    >
        <MathQuillStatic latex={op} />
    </div>
);

const MathBoard: React.FC<IStoreProps> = ({ store }) => (
    <div className="MathBoard">
        {operators.map(Button)}
    </div>
);

export default withStore(MathBoard);
