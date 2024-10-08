import React, {Suspense} from 'react';

type Props = {
    height?: number;
};

const AnalyseGraphAsync: React.FC<Props> = (props) => {
    const AnalystsComponent = React.lazy(() => import('./AnalyseGraphDumb'));

    return (
        <Suspense fallback={null}><AnalystsComponent {...props} /></Suspense>
    );
};

export default AnalyseGraphAsync;