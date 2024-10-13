import React, { PropsWithChildren } from 'react';
import Box from '@mui/material/Box';
import BoldButton from '../buttons/BoldButton';
import ItalicButton from '../buttons/ItalicButton';
import CodeButton from '../buttons/CodeButton';
import StrikethroughButton from '../buttons/StrikethroughButton';
import UnderlinedButton from '../buttons/UnderlinedButton';
import NumberedListButton from '../buttons/NumberedListButton';
import BulletedListButton from '../buttons/BulletedListButton';
import ButtonSeparator from '../buttons/ButtonSeparator';
import LinkButton from '../buttons/LinkButton';
import LeftButton from '../buttons/LeftButton';
import CenterButton from '../buttons/CenterButton';
import RightButton from '../buttons/RightButton';
import HighlightButton from '../buttons/HighlightButton';

type Props = {
    custom?: boolean;
};

const Toolbar: React.FC<PropsWithChildren<Props>> = (props) => {
    const { custom, children } = props;
    return (
        <Box
            sx={{
                borderBottomWidth: 1,
                borderBottomStyle: 'solid',
                borderBottomColor: 'grey.200',
                margin: 0.5,
            }}
        >
            {!custom && (
                <React.Fragment>
                    <BoldButton />
                    <ItalicButton />
                    <UnderlinedButton />
                    <StrikethroughButton />
                    <HighlightButton />
                    <ButtonSeparator />
                    <BulletedListButton />
                    <NumberedListButton />
                    <ButtonSeparator />
                    <CodeButton />
                    <LinkButton />
                    <ButtonSeparator />
                    <LeftButton />
                    <CenterButton />
                    <RightButton />
                </React.Fragment>
            )}
            {children}
        </Box>
    );
};

export default Toolbar;
