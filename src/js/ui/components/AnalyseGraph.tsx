import * as React from 'react';
import { AnalyseGraphProps } from './AnalyseGraphProps';
import AnalyseGraphDumb from './AnalyseGraphDumb';

export class AnalyseGraph extends React.Component<AnalyseGraphProps, {}> {
    render() {
        return <AnalyseGraphDumb {...this.props} />
    }
}
