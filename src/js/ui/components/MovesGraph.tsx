import * as React from 'react';
import { MovesGraphProps } from './MovesGraphProps';
import MovesGraphDumb from './MovesGraphDumb';

export class MovesGraph extends React.Component<MovesGraphProps, {}> {
    render() {
        return <MovesGraphDumb {...this.props} />
    }
}