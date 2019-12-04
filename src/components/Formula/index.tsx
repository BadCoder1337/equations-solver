import React from 'react';
import { IMathField, MathQuill, MathQuillStatic } from 'react-mathquill';
import { IState, IStoreProps, objects, Store, withStore } from '../../state/store';
import './Formula.css';

interface IComponentState {
    editRaw: boolean;
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
                    latex="=0,\ "
                />
                <MathQuillStatic
                    latex="e="
                />
                <MathQuill
                    latex={store.get('eps').toString()}
                    onChange={writeFloat('eps')}
                />
                <MathQuillStatic
                    latex=",\ "
                />
                <MathQuillStatic
                    latex="\Delta="
                />
                <MathQuill
                    latex={store.get('step').toString()}
                    onChange={writeFloat('step')}
                />
            </div>
        );
    }
}

export default withStore(Formula);
