import React, { Suspense } from 'react';
import { MovesGraphProps } from './MovesGraphProps';

export class MovesGraphAsync extends React.Component<MovesGraphProps, {}> {
    render() {
        const MovesComponent = React.lazy(() => import('./MovesGraphDumb'));

        return (
            <Suspense fallback={<div className="progress-circle-indeterminate text-hide">Loading...</div>}>
                <MovesComponent {...this.props} />
            </Suspense>
        );
        
    }
}