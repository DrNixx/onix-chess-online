import React from 'react';
import AnalyseGraphDumb from './AnalyseGraphDumb';

type Props = {
    height?: number;
};

const AnalyseGraph: React.FC<Props> = (props) => {
    return <AnalyseGraphDumb {...props} />
};

export default AnalyseGraph;