import React from 'react';
import { MathQuill, MathQuillStatic } from 'react-mathquill';
import { IStoreProps, StoreHOC } from '../../state/store';
import './Formula.css';

interface IState {
    editRaw: boolean;
}

class Formula extends React.Component<IStoreProps, IState> {
    public state = { editRaw: false };

    public toggleRaw = () => {
        this.setState({ editRaw: !this.state.editRaw });
    }

    public render() {
        const { store } = this.props;
        return (
            <div>
                <div>
                    <MathQuill
                        latex={store.get('formula')}
                        onChange={mathField => store.set('formula')(mathField.latex())}
                        mathquillDidMount={mathField => store.set('mathField')(() => mathField)}
                    />
                    <MathQuillStatic
                        latex="=0,\ e="
                    />
                    <MathQuill
                        latex={store.get('eps').toString()}
                        onChange={mathField => store.set('eps')(parseFloat(mathField.latex()))}
                    />
                    <MathQuillStatic
                        latex=",\ \Delta="
                    />
                    <MathQuill
                        latex={store.get('step').toString()}
                        onChange={mathField => store.set('step')(parseFloat(mathField.latex()))}
                    />
                </div>
            </div>
        );
    }
}

export default StoreHOC(Formula);
