import React from 'react';
import MathQuill, { addStyles } from 'react-mathquill';
import { IStoreProps, Store } from '../../state/store';

addStyles();

interface IFormula {
    latex?: string;
}

class Formula extends React.Component<IStoreProps> {
    public render() {
        const { store } = this.props;
        return (
            <MathQuill
                latex={store.get('formula')}
                onChange={mathField => store.set('formula')(mathField.latex())}
                config={{
                    handlers: {
                        deleteOutOf: () => console.log(1)
                    }
                }}
            />
        );
    }
}

export default Store.withStore(Formula);
