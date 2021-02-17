import React, { Suspense } from 'react';
import { AnalyseGraphProps } from './AnalyseGraphProps';

export class AnalyseGraphAsync extends React.Component<AnalyseGraphProps, {}> {
    render() {
        const AnalystsComponent = React.lazy(() => import('./AnalyseGraphDumb'));

        return (
            <Suspense fallback={<div className="progress-circle-indeterminate text-hide">Loading...</div>}>
                <AnalystsComponent {...this.props} />
            </Suspense>
        );
    }
}
