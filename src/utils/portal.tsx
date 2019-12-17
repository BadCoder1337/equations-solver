import React from 'react';
import ReactDOM from 'react-dom';

interface IPortalProps {
    node?: Element | null;
}

export default class Portal extends React.Component<IPortalProps> {
    public defaultNode: HTMLDivElement | null = null;

    public componentDidMount() {
        this.renderPortal();
    }

    public componentDidUpdate() {
        this.renderPortal();
    }

    public componentWillUnmount() {
        ReactDOM.unmountComponentAtNode(this.defaultNode! || this.props.node);
        if (this.defaultNode) {
            document.body.removeChild(this.defaultNode);
        }
        this.defaultNode = null;
    }

    public renderPortal() {
        if (!this.props.node && !this.defaultNode) {
            this.defaultNode = document.createElement('div');
            document.body.appendChild(this.defaultNode);
        }

        const children = this.props.children;
          // https://gist.github.com/jimfb/d99e0678e9da715ccf6454961ef04d1b
        // if (typeof children.type === 'function') {
        //     children = React.cloneElement(children);
        // }

        ReactDOM.render(<>{children}</>, this.props.node || this.defaultNode);
    }

    public render() {
        return null;
    }
}
