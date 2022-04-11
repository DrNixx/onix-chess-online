import React, {Suspense} from 'react';
import { MovesGraphProps } from './MovesGraphProps';

export class MovesGraphAsync extends React.Component<MovesGraphProps, {}> {
    render() {
        const MovesComponent = React.lazy(() => import('./MovesGraphDumb'));

        return (
            <Suspense fallback={null}><MovesComponent {...this.props} /></Suspense>
        );
        
    }
}