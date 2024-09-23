import React from 'react';
import Box from '@mui/material/Box';

type Props = {
    borderColor?: string;
};

const ButtonSeparator: React.FC<Props> = (props) => {
    const { borderColor } = props;
    return (
        <Box display="inline">
            <Box
                borderLeft={1}
                borderColor={borderColor ? borderColor : 'grey.400'}
                marginLeft="2px"
                marginRight="2px"
                display="inline"
            />
        </Box>
    );
};

export default ButtonSeparator;
