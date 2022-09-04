import React from 'react';
import { MovesGraphProps } from './MovesGraphProps';
import MovesGraphDumb from './MovesGraphDumb';

const MovesGraph: React.FC<MovesGraphProps> = (props) => {
    return <MovesGraphDumb {...props} />
};

export default MovesGraph;