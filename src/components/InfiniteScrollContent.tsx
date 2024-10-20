import React from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

type Props = {
    loadingSpinner?:
        | 'bubbles'
        | 'circles'
        | 'circular'
        | 'crescent'
        | 'dots'
        | 'lines'
        | 'lines-sharp'
        | 'lines-sharp-small'
        | 'lines-small'
        | null
        | undefined;
    loadingText?: string;
};
const InfiniteScrollContent: React.FC<Props> = ({ loadingText }: Props) => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                minHeight: 84,
                textAlign: 'center',
                userSelect: 'none',
            }}
        >
            <Box
                className="infinite-loading"
                sx={{
                    marginLeft: 0,
                    marginRight: 0,
                    marginTop: 0,
                    marginBottom: 2,
                    // display: 'none',
                    width: '100%',
                }}
            >
                <div className="infinite-loading-spinner">
                    <CircularProgress />
                </div>
                {!!loadingText && (
                    <Box sx={{ marginInlineStart: 4, marginInlineEnd: 4, marginTop: 0.5, marginBottom: 0 }}>
                        {loadingText}
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default InfiniteScrollContent;
