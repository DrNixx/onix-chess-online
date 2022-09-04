import React, {Suspense} from 'react';
import { MovesGraphProps } from './MovesGraphProps';

const MovesGraphAsync: React.FC<MovesGraphProps> = (props) => {
    const MovesComponent = React.lazy(() => import('./MovesGraphDumb'));

    return (
        <Suspense fallback={null}><MovesComponent {...props} /></Suspense>
    );
};

export default MovesGraphAsync;