import React, {Suspense} from 'react';
import { AnalyseGraphProps } from './AnalyseGraphProps';

export class AnalyseGraphAsync extends React.Component<AnalyseGraphProps, {}> {
    render() {
        const AnalystsComponent = React.lazy(() => import('./AnalyseGraphDumb'));

        return (
            <Suspense fallback={null}><AnalystsComponent {...this.props} /></Suspense>
        );
    }
}
