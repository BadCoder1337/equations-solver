import React from 'react';
import { IMathField, MathQuill, MathQuillStatic } from 'react-mathquill';
import { objects, Store, withStore } from '../../state/store';
import { IState, IStoreProps } from '../../types';
import './Formula.css';

interface IComponentState {
    editRaw: boolean;
}

interface IRoots {
    roots: number[];
}

const writeFloat = (param: keyof IState) => (mathField: IMathField) => Store.set(param)(parseFloat(mathField.latex()));
const writeFormula = (mathField: IMathField) => Store.set('formula')(mathField.latex());
const saveMQ = (mathField: IMathField) => objects.mathField = mathField;

class Formula extends React.Component<IStoreProps, IComponentState> {
    public state = { editRaw: false };

    public toggleRaw = () => {
        this.setState({ editRaw: !this.state.editRaw });
    }

    public render() {
        const { store } = this.props;
        return (
            <div className="Formula">
                <MathQuill
                    className={typeof objects.evaluatex !== 'object' ? '' : 'Formula-error'}
                    latex={store.get('formula')}
                    onChange={writeFormula}
                    mathquillDidMount={saveMQ}
                />
                <MathQuillStatic
                    latex="=0,\ e="
                />
                <MathQuill
                    latex={store.get('eps').toString()}
                    onChange={writeFloat('eps')}
                />
                <MathQuillStatic
                    latex=",\ \Delta="
                />
                <MathQuill
                    latex={store.get('step').toString()}
                    onChange={writeFloat('step')}
                />
            </div>
        );
    }
}

export const Roots: React.FC<IRoots> = ({ roots }) => (
    <>{
    // tslint:disable-next-line:jsx-no-multiline-js
        roots
        .map((r, i) => {
            const digits = Math.abs(Math.log10(Store.get('eps'))) || 0.1;
            const latex = `x_{${i + 1}}=`
                + +r.toFixed(digits)
                + (i < roots.length - 1 ? ',\\ ' : '');
            return (
                <MathQuillStatic
                    key={`r${i}`}
                    latex={latex}
                />
            );
        })
    }</>
);

export default withStore(Formula);
